<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Transaction;
use App\Models\TransactionDetail;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * Process inventory for a purchase (increase stock)
     */
    public function processPurchase(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase) {
            foreach ($purchase->items as $item) {
                if (!$item->product_id) continue;

                $inventory = Inventory::getOrCreateForProduct($item->product);

                $inventory->addStock(
                    quantity: $item->quantity,
                    type: InventoryAdjustment::TYPE_PURCHASE,
                    reason: "Purchase from {$purchase->supplier_name}",
                    referenceType: 'purchase',
                    referenceId: $purchase->id
                );
            }
        });
    }

    /**
     * Reverse inventory for a purchase (when deleted/cancelled)
     */
    public function reversePurchase(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase) {
            foreach ($purchase->items as $item) {
                if (!$item->product_id) continue;

                $inventory = Inventory::where('product_id', $item->product_id)->first();
                if (!$inventory) continue;

                $inventory->reduceStock(
                    quantity: $item->quantity,
                    type: InventoryAdjustment::TYPE_CORRECTION,
                    reason: "Reversed purchase from {$purchase->supplier_name}",
                    referenceType: 'purchase',
                    referenceId: $purchase->id
                );
            }
        });
    }

    /**
     * Process inventory for a transaction/sale (decrease stock)
     */
    public function processTransaction(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            foreach ($transaction->details as $detail) {
                if (!$detail->product_id) continue;

                $inventory = Inventory::where('product_id', $detail->product_id)->first();
                if (!$inventory) {
                    $inventory = Inventory::getOrCreateForProduct($detail->product);
                }

                $inventory->reduceStock(
                    quantity: $detail->quantity,
                    type: InventoryAdjustment::TYPE_SALE,
                    reason: "Sale invoice: {$transaction->invoice}",
                    referenceType: 'transaction',
                    referenceId: $transaction->id
                );
            }
        });
    }

    /**
     * Reverse inventory for a transaction (when refunded/cancelled)
     */
    public function reverseTransaction(Transaction $transaction): void
    {
        DB::transaction(function () use ($transaction) {
            foreach ($transaction->details as $detail) {
                if (!$detail->product_id) continue;

                $inventory = Inventory::where('product_id', $detail->product_id)->first();
                if (!$inventory) continue;

                $inventory->addStock(
                    quantity: $detail->quantity,
                    type: InventoryAdjustment::TYPE_RETURN,
                    reason: "Return for invoice: {$transaction->invoice}",
                    referenceType: 'transaction',
                    referenceId: $transaction->id
                );
            }
        });
    }

    /**
     * Manual stock adjustment
     */
    public function manualAdjustment(
        Product $product,
        float $quantity,
        string $type,
        ?string $reason = null,
        ?int $userId = null
    ): InventoryAdjustment {
        $inventory = Inventory::getOrCreateForProduct($product);

        if (in_array($type, [InventoryAdjustment::TYPE_IN, InventoryAdjustment::TYPE_PURCHASE, InventoryAdjustment::TYPE_RETURN])) {
            return $inventory->addStock($quantity, $type, $reason, null, null, $userId);
        } else {
            return $inventory->reduceStock($quantity, $type, $reason, null, null, $userId);
        }
    }

    /**
     * Stock correction (set to specific quantity)
     */
    public function stockCorrection(Product $product, float $newQuantity, ?string $reason = null, ?int $userId = null): InventoryAdjustment
    {
        $inventory = Inventory::getOrCreateForProduct($product);
        return $inventory->setStock($newQuantity, $reason, $userId);
    }

    /**
     * Get stock movement history for a product
     */
    public function getStockHistory(Product $product, ?string $from = null, ?string $to = null)
    {
        $query = InventoryAdjustment::forProduct($product->id)
            ->with('user')
            ->orderBy('created_at', 'desc');

        if ($from && $to) {
            $query->dateRange($from, $to);
        }

        return $query->get();
    }

    /**
     * Get inventory summary
     */
    public function getInventorySummary()
    {
        return [
            'total_products' => Product::count(),
            'total_stock_value' => Product::sum(DB::raw('stock * buy_price')),
            'total_sell_value' => Product::sum(DB::raw('stock * sell_price')),
            'low_stock_count' => Product::where('stock', '<=', 10)->where('stock', '>', 0)->count(),
            'out_of_stock_count' => Product::where('stock', '<=', 0)->count(),
        ];
    }

    /**
     * Sync inventory with product stock
     */
    public function syncInventoryWithProducts(): int
    {
        $synced = 0;

        Product::chunk(100, function ($products) use (&$synced) {
            foreach ($products as $product) {
                $inventory = Inventory::firstOrNew(['product_id' => $product->id]);
                $inventory->barcode = $product->barcode;
                $inventory->quantity = $product->stock;
                $inventory->save();
                $synced++;
            }
        });

        return $synced;
    }
}
