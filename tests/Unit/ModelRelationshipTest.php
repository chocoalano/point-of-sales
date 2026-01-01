<?php

namespace Tests\Unit;

use App\Models\Category;
use App\Models\Customer;
use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ModelRelationshipTest extends TestCase
{
    use RefreshDatabase;

    protected User $user;
    protected Category $category;
    protected Product $product;

    protected function setUp(): void
    {
        parent::setUp();

        // Create base models
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
    public function product_belongs_to_category()
    {
        $this->assertInstanceOf(Category::class, $this->product->category);
        $this->assertEquals($this->category->id, $this->product->category->id);
    }

    /** @test */
    public function category_has_many_products()
    {
        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $this->category->products);
        $this->assertTrue($this->category->products->contains($this->product));
    }

    /** @test */
    public function product_has_one_inventory()
    {
        $inventory = Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => $this->product->stock,
        ]);

        $this->product->refresh();

        $this->assertInstanceOf(Inventory::class, $this->product->inventory);
        $this->assertEquals($inventory->id, $this->product->inventory->id);
    }

    /** @test */
    public function inventory_belongs_to_product()
    {
        $inventory = Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => $this->product->stock,
        ]);

        $this->assertInstanceOf(Product::class, $inventory->product);
        $this->assertEquals($this->product->id, $inventory->product->id);
    }

    /** @test */
    public function product_has_many_inventory_adjustments()
    {
        $inventory = Inventory::create([
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 100,
        ]);

        $adjustment = InventoryAdjustment::create([
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
            'type' => InventoryAdjustment::TYPE_IN,
            'quantity_before' => 100,
            'quantity_change' => 10,
            'quantity_after' => 110,
            'reason' => 'Test adjustment',
        ]);

        $this->product->refresh();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $this->product->inventoryAdjustments);
        $this->assertTrue($this->product->inventoryAdjustments->contains($adjustment));
    }

    /** @test */
    public function inventory_adjustment_belongs_to_product_and_user()
    {
        $adjustment = InventoryAdjustment::create([
            'product_id' => $this->product->id,
            'user_id' => $this->user->id,
            'type' => InventoryAdjustment::TYPE_PURCHASE,
            'quantity_before' => 100,
            'quantity_change' => 50,
            'quantity_after' => 150,
            'reason' => 'Purchase stock',
        ]);

        $this->assertInstanceOf(Product::class, $adjustment->product);
        $this->assertInstanceOf(User::class, $adjustment->user);
        $this->assertEquals($this->product->id, $adjustment->product->id);
        $this->assertEquals($this->user->id, $adjustment->user->id);
    }

    /** @test */
    public function purchase_has_many_items()
    {
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        $item = PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 10,
            'purchase_price' => 10000,
            'total_price' => 100000,
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $purchase->items);
        $this->assertTrue($purchase->items->contains($item));
    }

    /** @test */
    public function purchase_item_belongs_to_purchase_and_product()
    {
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        $item = PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 10,
            'purchase_price' => 10000,
            'total_price' => 100000,
        ]);

        $this->assertInstanceOf(Purchase::class, $item->purchase);
        $this->assertInstanceOf(Product::class, $item->product);
        $this->assertEquals($purchase->id, $item->purchase->id);
        $this->assertEquals($this->product->id, $item->product->id);
    }

    /** @test */
    public function transaction_has_many_details()
    {
        $customer = Customer::create([
            'name' => 'Test Customer',
            'no_telp' => '08123456789',
            'address' => 'Test Address',
        ]);

        $transaction = Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis'),
            'cash' => 50000,
            'change' => 5000,
            'discount' => 0,

            'grand_total' => 45000,
        ]);

        $detail = TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $this->product->id,
            'barcode' => 'TEST001',
            'quantity' => 3,
            'discount' => 0,
            'price' => 15000,
        ]);

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $transaction->details);
        $this->assertTrue($transaction->details->contains($detail));
    }

    /** @test */
    public function transaction_belongs_to_cashier_and_customer()
    {
        $customer = Customer::create([
            'name' => 'Test Customer',
            'no_telp' => '08123456789',
            'address' => 'Test Address',
        ]);

        $transaction = Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis'),
            'cash' => 50000,
            'change' => 5000,
            'discount' => 0,

            'grand_total' => 45000,
        ]);

        $this->assertInstanceOf(User::class, $transaction->cashier);
        $this->assertInstanceOf(Customer::class, $transaction->customer);
        $this->assertEquals($this->user->id, $transaction->cashier->id);
        $this->assertEquals($customer->id, $transaction->customer->id);
    }

    /** @test */
    public function transaction_detail_belongs_to_transaction_and_product()
    {
        $customer = Customer::create([
            'name' => 'Test Customer',
            'no_telp' => '08123456789',
            'address' => 'Test Address',
        ]);

        $transaction = Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis'),
            'cash' => 50000,
            'change' => 5000,
            'discount' => 0,

            'grand_total' => 45000,
        ]);

        $detail = TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $this->product->id,
            'barcode' => 'TEST001',
            'quantity' => 3,
            'discount' => 0,
            'price' => 15000,
        ]);

        $this->assertInstanceOf(Transaction::class, $detail->transaction);
        $this->assertInstanceOf(Product::class, $detail->product);
    }

    /** @test */
    public function product_has_many_purchase_items()
    {
        $purchase = Purchase::create([
            'supplier_name' => 'Test Supplier',
            'purchase_date' => now(),
            'status' => 'received',
        ]);

        PurchaseItem::create([
            'purchase_id' => $purchase->id,
            'product_id' => $this->product->id,
            'barcode' => $this->product->barcode,
            'quantity' => 10,
            'purchase_price' => 10000,
            'total_price' => 100000,
        ]);

        $this->product->refresh();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $this->product->purchaseItems);
        $this->assertEquals(1, $this->product->purchaseItems->count());
    }

    /** @test */
    public function product_has_many_transaction_details()
    {
        $customer = Customer::create([
            'name' => 'Test Customer',
            'no_telp' => '08123456789',
            'address' => 'Test Address',
        ]);

        $transaction = Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis'),
            'cash' => 50000,
            'change' => 5000,
            'discount' => 0,

            'grand_total' => 45000,
        ]);

        TransactionDetail::create([
            'transaction_id' => $transaction->id,
            'product_id' => $this->product->id,
            'barcode' => 'TEST001',
            'quantity' => 3,
            'discount' => 0,
            'price' => 15000,
        ]);

        $this->product->refresh();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $this->product->transactionDetails);
        $this->assertEquals(1, $this->product->transactionDetails->count());
    }

    /** @test */
    public function customer_has_many_transactions()
    {
        $customer = Customer::create([
            'name' => 'Test Customer',
            'no_telp' => '08123456789',
            'address' => 'Test Address',
        ]);

        Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis') . '1',
            'cash' => 50000,
            'change' => 5000,
            'discount' => 0,

            'grand_total' => 45000,
        ]);

        Transaction::create([
            'cashier_id' => $this->user->id,
            'customer_id' => $customer->id,
            'invoice' => 'INV-' . date('YmdHis') . '2',
            'cash' => 100000,
            'change' => 10000,
            'discount' => 0,

            'grand_total' => 90000,
        ]);

        $customer->refresh();

        $this->assertInstanceOf(\Illuminate\Database\Eloquent\Collection::class, $customer->transactions);
        $this->assertEquals(2, $customer->transactions->count());
    }
}
