<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\User;
use App\Services\InventoryService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryServiceTest extends TestCase
{
    use RefreshDatabase;

    protected InventoryService $inventoryService;
    protected User $user;
    protected Category $category;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        $this->inventoryService = new InventoryService();
        $this->user = User::factory()->create();
        $this->category = Category::create([
            'name' => 'Test Category',
            'description' => 'Test description',
        ]);
        $this->product = Product::create([
            'barcode' => 'TEST001',
            'title' => 'Test Product',
            'description' => 'Test product description',
            'category_id' => $this->category->id,
            'buy_price' => 10000,
            'sell_price' => 15000,
            'stock' => 100,
        ]);
    }

    /** @test */
    public function can_process_purchase_and_update_inventory()
    {
        $this->actingAs($this->user);

        // Create inventory
        Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        // Create purchase
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 50,
            'purchase_price' => 10000,
            'total_price' => 500000,
        ]);

        $purchase->load('items.product');

        // Process purchase
        $this->inventoryService->processPurchase($purchase);

        // Verify inventory updated
        $inventory = Inventory::where('product_id', $this->product->id)->first();
        $this->assertEquals(150, $inventory->quantity);

        // Verify adjustment created
        $adjustment = InventoryAdjustment::where('reference_type', 'purchase')
            ->where('reference_id', $purchase->id)
            ->first();

        $this->assertNotNull($adjustment);
        $this->assertEquals(InventoryAdjustment::TYPE_PURCHASE, $adjustment->type);
        $this->assertEquals(50, $adjustment->quantity_change);
    }

    /** @test */
    public function can_reverse_purchase_and_update_inventory()
    {
        $this->actingAs($this->user);

        // Create inventory with stock
        $inventory = Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 150,
        ]);

        // Create purchase that we'll reverse
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 50,
            'purchase_price' => 10000,
            'total_price' => 500000,
        ]);

        $purchase->load('items.product');

        // Reverse purchase
        $this->inventoryService->reversePurchase($purchase);

        // Verify inventory updated (reduced)
        $inventory->refresh();
        $this->assertEquals(100, $inventory->quantity);
    }

    /** @test */
    public function can_manual_adjustment_add_stock()
    {
        $this->actingAs($this->user);

        // Create inventory
        Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        $adjustment = $this->inventoryService->manualAdjustment(
            $this->product,
            25,
            InventoryAdjustment::TYPE_IN,
            'Manual stock in',
            $this->user->id
        );

        // Verify inventory updated
        $inventory = Inventory::where('product_id', $this->product->id)->first();
        $this->assertEquals(125, $inventory->quantity);

        // Verify adjustment
        $this->assertEquals(InventoryAdjustment::TYPE_IN, $adjustment->type);
        $this->assertEquals(25, $adjustment->quantity_change);
    }

    /** @test */
    public function can_manual_adjustment_reduce_stock()
    {
        $this->actingAs($this->user);

        // Create inventory
        Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        $adjustment = $this->inventoryService->manualAdjustment(
            $this->product,
            30,
            InventoryAdjustment::TYPE_DAMAGE,
            'Damaged goods',
            $this->user->id
        );

        // Verify inventory updated
        $inventory = Inventory::where('product_id', $this->product->id)->first();
        $this->assertEquals(70, $inventory->quantity);

        // Verify adjustment
        $this->assertEquals(InventoryAdjustment::TYPE_DAMAGE, $adjustment->type);
        $this->assertEquals(-30, $adjustment->quantity_change);
    }

    /** @test */
    public function can_stock_correction()
    {
        $this->actingAs($this->user);

        // Create inventory
        Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        $adjustment = $this->inventoryService->stockCorrection(
            $this->product,
            85,
            'Stock opname correction',
            $this->user->id
        );

        // Verify inventory set to exact value
        $inventory = Inventory::where('product_id', $this->product->id)->first();
        $this->assertEquals(85, $inventory->quantity);

        // Verify adjustment
        $this->assertEquals(InventoryAdjustment::TYPE_CORRECTION, $adjustment->type);
        $this->assertEquals(100, $adjustment->quantity_before);
        $this->assertEquals(-15, $adjustment->quantity_change);
        $this->assertEquals(85, $adjustment->quantity_after);
    }

    /** @test */
    public function can_get_stock_history()
    {
        $this->actingAs($this->user);

        // Create inventory and some adjustments
        Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        $this->inventoryService->manualAdjustment($this->product, 10, InventoryAdjustment::TYPE_IN, 'Add 1');
        $this->inventoryService->manualAdjustment($this->product, 20, InventoryAdjustment::TYPE_PURCHASE, 'Add 2');
        $this->inventoryService->manualAdjustment($this->product, 5, InventoryAdjustment::TYPE_SALE, 'Reduce 1');

        $history = $this->inventoryService->getStockHistory($this->product);

        $this->assertEquals(3, $history->count());
    }

    /** @test */
    public function can_get_inventory_summary()
    {
        // Create some products
        Product::create([
            'barcode' => 'PROD002',
            'title' => 'Product 2',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 5000,
            'sell_price' => 7500,
            'stock' => 50,
        ]);

        Product::create([
            'barcode' => 'PROD003',
            'title' => 'Product 3',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 8000,
            'sell_price' => 12000,
            'stock' => 5, // Low stock
        ]);

        Product::create([
            'barcode' => 'PROD004',
            'title' => 'Product 4',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 3000,
            'sell_price' => 5000,
            'stock' => 0, // Out of stock
        ]);

        $summary = $this->inventoryService->getInventorySummary();

        $this->assertArrayHasKey('total_products', $summary);
        $this->assertArrayHasKey('total_stock_value', $summary);
        $this->assertArrayHasKey('total_sell_value', $summary);
        $this->assertArrayHasKey('low_stock_count', $summary);
        $this->assertArrayHasKey('out_of_stock_count', $summary);

        $this->assertEquals(4, $summary['total_products']);
        $this->assertGreaterThan(0, $summary['total_stock_value']);
        $this->assertEquals(1, $summary['low_stock_count']);
        $this->assertEquals(1, $summary['out_of_stock_count']);
    }

    /** @test */
    public function can_sync_inventory_with_products()
    {
        // Create products without inventory
        Product::create([
            'barcode' => 'SYNC001',
            'title' => 'Sync Product 1',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 5000,
            'sell_price' => 7500,
            'stock' => 30,
        ]);

        Product::create([
            'barcode' => 'SYNC002',
            'title' => 'Sync Product 2',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 8000,
            'sell_price' => 12000,
            'stock' => 45,
        ]);

        $synced = $this->inventoryService->syncInventoryWithProducts();

        // Should have synced all products
        $this->assertEquals(Product::count(), $synced);

        // Verify inventories created
        $this->assertEquals(Product::count(), Inventory::count());
    }

    /** @test */
    public function creates_inventory_if_not_exists_on_process_purchase()
    {
        $this->actingAs($this->user);

        // Create a product without inventory
        $newProduct = Product::create([
            'barcode' => 'NEW001',
            'title' => 'New Product',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 5000,
            'sell_price' => 7500,
            'stock' => 0,
        ]);

        // Create purchase
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $newProduct->id,
            'barcode' => $newProduct->barcode,
            'quantity' => 100,
            'purchase_price' => 5000,
            'total_price' => 500000,
        ]);

        $purchase->load('items.product');

        // Process purchase - should create inventory automatically
        $this->inventoryService->processPurchase($purchase);

        // Verify inventory created
        $inventory = Inventory::where('product_id', $newProduct->id)->first();
        $this->assertNotNull($inventory);
        $this->assertEquals(100, $inventory->quantity);
    }
}
