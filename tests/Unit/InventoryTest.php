<?php

namespace Tests\Unit;

use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class InventoryTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Category $category;
    protected Product $product;
    protected Inventory $inventory;

    protected function setUp(): void
    {
        parent::setUp();

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
        $this->inventory = Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);
    }

    /** @test */
    public function can_add_stock_and_create_adjustment()
    {
        $this->actingAs($this->user);

        $adjustment = $this->inventory->addStock(
            quantity: 50,
            type: InventoryAdjustment::TYPE_PURCHASE,
            reason: 'Purchase from supplier'
        );

        // Verify inventory updated
        $this->assertEquals(150, $this->inventory->fresh()->quantity);

        // Verify adjustment created
        $this->assertInstanceOf(InventoryAdjustment::class, $adjustment);
        $this->assertEquals($this->product->id, $adjustment->product_id);
        $this->assertEquals(InventoryAdjustment::TYPE_PURCHASE, $adjustment->type);
        $this->assertEquals(100, $adjustment->quantity_before);
        $this->assertEquals(50, $adjustment->quantity_change);
        $this->assertEquals(150, $adjustment->quantity_after);
        $this->assertEquals('Purchase from supplier', $adjustment->reason);
    }

    /** @test */
    public function can_reduce_stock_and_create_adjustment()
    {
        $this->actingAs($this->user);

        $adjustment = $this->inventory->reduceStock(
            quantity: 30,
            type: InventoryAdjustment::TYPE_SALE,
            reason: 'Sale transaction'
        );

        // Verify inventory updated
        $this->assertEquals(70, $this->inventory->fresh()->quantity);

        // Verify adjustment created
        $this->assertInstanceOf(InventoryAdjustment::class, $adjustment);
        $this->assertEquals(InventoryAdjustment::TYPE_SALE, $adjustment->type);
        $this->assertEquals(100, $adjustment->quantity_before);
        $this->assertEquals(-30, $adjustment->quantity_change);
        $this->assertEquals(70, $adjustment->quantity_after);
    }

    /** @test */
    public function can_set_stock_with_correction()
    {
        $this->actingAs($this->user);

        $adjustment = $this->inventory->setStock(
            newQuantity: 75,
            reason: 'Stock opname correction'
        );

        // Verify inventory updated
        $this->assertEquals(75, $this->inventory->fresh()->quantity);

        // Verify adjustment created
        $this->assertEquals(InventoryAdjustment::TYPE_CORRECTION, $adjustment->type);
        $this->assertEquals(100, $adjustment->quantity_before);
        $this->assertEquals(-25, $adjustment->quantity_change);
        $this->assertEquals(75, $adjustment->quantity_after);
    }

    /** @test */
    public function add_stock_increases_quantity()
    {
        $this->actingAs($this->user);

        $initialQuantity = $this->inventory->quantity;
        $addQuantity = 25;

        $this->inventory->addStock($addQuantity, InventoryAdjustment::TYPE_IN, 'Manual add');

        $this->assertEquals($initialQuantity + $addQuantity, $this->inventory->fresh()->quantity);
    }

    /** @test */
    public function reduce_stock_decreases_quantity()
    {
        $this->actingAs($this->user);

        $initialQuantity = $this->inventory->quantity;
        $reduceQuantity = 25;

        $this->inventory->reduceStock($reduceQuantity, InventoryAdjustment::TYPE_OUT, 'Manual reduce');

        $this->assertEquals($initialQuantity - $reduceQuantity, $this->inventory->fresh()->quantity);
    }

    /** @test */
    public function stock_cannot_go_below_zero()
    {
        $this->actingAs($this->user);

        // Try to reduce more than available
        $this->inventory->reduceStock(150, InventoryAdjustment::TYPE_OUT, 'Over reduce');

        // Stock should be 0, not negative
        $this->assertEquals(0, $this->inventory->fresh()->quantity);
    }

    /** @test */
    public function can_get_or_create_inventory_for_product()
    {
        // Create a new product without inventory
        $newProduct = Product::create([
            'barcode' => 'NEW001',
            'title' => 'New Product',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 5000,
            'sell_price' => 7500,
            'stock' => 0,
        ]);

        $this->assertNull($newProduct->inventory);

        // Get or create should create new inventory
        $inventory = Inventory::getOrCreateForProduct($newProduct);

        $this->assertInstanceOf(Inventory::class, $inventory);
        $this->assertEquals($newProduct->id, $inventory->product_id);
        $this->assertEquals($newProduct->barcode, $inventory->barcode);
    }

    /** @test */
    public function get_or_create_returns_existing_inventory()
    {
        // Should return existing inventory, not create new
        $inventory = Inventory::getOrCreateForProduct($this->product);

        $this->assertEquals($this->inventory->id, $inventory->id);
    }

    /** @test */
    public function adjustment_tracks_reference()
    {
        $this->actingAs($this->user);

        $adjustment = $this->inventory->addStock(
            quantity: 20,
            type: InventoryAdjustment::TYPE_PURCHASE,
            reason: 'Purchase',
            referenceType: 'purchase',
            referenceId: 123
        );

        $this->assertEquals('purchase', $adjustment->reference_type);
        $this->assertEquals(123, $adjustment->reference_id);
    }

    /** @test */
    public function adjustment_tracks_user()
    {
        $this->actingAs($this->user);

        $adjustment = $this->inventory->addStock(
            quantity: 10,
            type: InventoryAdjustment::TYPE_IN,
            reason: 'Test'
        );

        $this->assertEquals($this->user->id, $adjustment->user_id);
    }

    /** @test */
    public function inventory_has_adjustments_relationship()
    {
        $this->actingAs($this->user);

        $this->inventory->addStock(10, InventoryAdjustment::TYPE_IN, 'Add 1');
        $this->inventory->addStock(20, InventoryAdjustment::TYPE_PURCHASE, 'Add 2');
        $this->inventory->reduceStock(5, InventoryAdjustment::TYPE_SALE, 'Reduce 1');

        $this->assertEquals(3, $this->inventory->adjustments()->count());
    }

    /** @test */
    public function can_filter_adjustments_by_type()
    {
        $this->actingAs($this->user);

        $this->inventory->addStock(10, InventoryAdjustment::TYPE_PURCHASE, 'Purchase 1');
        $this->inventory->addStock(20, InventoryAdjustment::TYPE_PURCHASE, 'Purchase 2');
        $this->inventory->reduceStock(5, InventoryAdjustment::TYPE_SALE, 'Sale 1');

        $purchaseAdjustments = InventoryAdjustment::ofType(InventoryAdjustment::TYPE_PURCHASE)->count();
        $saleAdjustments = InventoryAdjustment::ofType(InventoryAdjustment::TYPE_SALE)->count();

        $this->assertEquals(2, $purchaseAdjustments);
        $this->assertEquals(1, $saleAdjustments);
    }

    /** @test */
    public function can_filter_adjustments_by_product()
    {
        $this->actingAs($this->user);

        // Create another product with inventory
        $product2 = Product::create([
            'barcode' => 'PROD002',
            'title' => 'Product 2',
            'description' => 'Description',
            'category_id' => $this->category->id,
            'buy_price' => 5000,
            'sell_price' => 7500,
            'stock' => 50,
        ]);

        $inventory2 = Inventory::create([
            'product_id' => $product2->id,
            'barcode' => $product2->barcode,
            'quantity' => 50,
        ]);

        $this->inventory->addStock(10, InventoryAdjustment::TYPE_IN, 'Add to product 1');
        $inventory2->addStock(20, InventoryAdjustment::TYPE_IN, 'Add to product 2');

        $product1Adjustments = InventoryAdjustment::forProduct($this->product->id)->count();
        $product2Adjustments = InventoryAdjustment::forProduct($product2->id)->count();

        $this->assertEquals(1, $product1Adjustments);
        $this->assertEquals(1, $product2Adjustments);
    }

    /** @test */
    public function adjustment_type_label_attribute_works()
    {
        $adjustment = new InventoryAdjustment([
            'type' => InventoryAdjustment::TYPE_PURCHASE,
        ]);

        $this->assertEquals('Pembelian', $adjustment->type_label);

        $adjustment->type = InventoryAdjustment::TYPE_SALE;
        $this->assertEquals('Penjualan', $adjustment->type_label);
    }

    /** @test */
    public function adjustment_incoming_outgoing_helpers_work()
    {
        $incomingAdjustment = new InventoryAdjustment([
            'type' => InventoryAdjustment::TYPE_PURCHASE,
        ]);

        $outgoingAdjustment = new InventoryAdjustment([
            'type' => InventoryAdjustment::TYPE_SALE,
        ]);

        $this->assertTrue($incomingAdjustment->isIncoming());
        $this->assertFalse($incomingAdjustment->isOutgoing());

        $this->assertFalse($outgoingAdjustment->isIncoming());
        $this->assertTrue($outgoingAdjustment->isOutgoing());
    }
}
