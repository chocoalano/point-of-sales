<?php

namespace App\Services;

use App\Models\Inventory;
use App\Models\Product;
use App\Models\Purchase;
use App\Models\InventoryAdjustment;
use Illuminate\Support\Facades\DB;

class InventoryService
{
    /**
     * SATU-SATUNYA pintu perubahan stok (LOW LEVEL)
     */
    public static function record(
        int $productId,
        string $type,
        float $qty,
        ?string $note = null,
        ?string $referenceType = null,
        ?int $referenceId = null,
        ?int $userId = null
    ): void {
        DB::transaction(function () use (
            $productId,
            $type,
            $qty,
            $note,
            $referenceType,
            $referenceId,
            $userId
        ) {
            $product = Product::lockForUpdate()->findOrFail($productId);

            $qtyIn = 0;
            $qtyOut = 0;

            if (in_array($type, [
                'purchase',
                'return',
                'adjustment_in',
            ])) {
                $qtyIn = $qty;
            } else {
                $qtyOut = $qty;
            }

            InventoryAdjustment::create([
                'product_id'    => $productId,
                'type'          => $type,
                'qty_in'        => $qtyIn,
                'qty_out'       => $qtyOut,
                'stock_before'  => $product->stock,
                'stock_after'   => ($product->stock + $qtyIn) - $qtyOut,
                'note'          => $note,
                'reference_type' => $referenceType,
                'reference_id'  => $referenceId,
                'user_id'       => $userId,
            ]);

            $product->update([
                'stock' => ($product->stock + $qtyIn) - $qtyOut
            ]);
        });
    }

    /**
     * JURNAL PEMBELIAN (HIGH LEVEL)
     */
    public function processPurchase(Purchase $purchase): void
    {
        foreach ($purchase->items as $item) {
            if (!$item->product_id) {
                continue;
            }

            self::record(
                productId: $item->product_id,
                type: 'purchase',
                qty: $item->quantity,
                note: "Purchase from {$purchase->supplier_name}",
                referenceType: 'purchase',
                referenceId: $purchase->id,
                userId: auth()->id()
            );
        }
    }

    /**
     * REVERSE JURNAL PEMBELIAN (UNTUK UPDATE / DELETE)
     */
    // app/Services/InventoryService.php

    public function reversePurchase(Purchase $purchase): void
    {
        DB::transaction(function () use ($purchase) {
            foreach ($purchase->items as $item) {
                if (!$item->product_id) {
                    continue;
                }

                $inventory = Inventory::where('product_id', $item->product_id)->first();

                if (!$inventory) {
                    continue;
                }

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
     * Proses transaksi penjualan (OUT stok)
     */
    public function processTransaction($transaction): void
    {
        $transaction->load('details.product');

        foreach ($transaction->details as $detail) {
            if (!$detail->product_id) {
                continue;
            }

            self::record(
                productId: $detail->product_id,
                type: 'sale',
                qty: $detail->quantity,
                note: 'Penjualan #' . $transaction->invoice,
                referenceType: 'transaction',
                referenceId: $transaction->id,
                userId: auth()->id()
            );
        } 
    }

    public function reverseTransaction($transaction): void
    {
        $transaction->load('details.product');

        foreach ($transaction->details as $detail) {
            if (!$detail->product_id) {
                continue;
            }

            self::record(
                productId: $detail->product_id,
                type: 'sale_reverse',
                qty: $detail->quantity,
                note: 'Reverse transaksi #' . $transaction->invoice,
                referenceType: 'transaction',
                referenceId: $transaction->id,
                userId: auth()->id()
            );
        }
    }



    /**
     * Ringkasan inventory (DASHBOARD)
     * ⚠️ Menggunakan saldo akhir produk, BUKAN jurnal
     */
    public function getInventorySummary(): array
    {
        return [
            'total_products' => Product::count(),

            'total_stock' => Product::sum('stock'),

            'total_stock_value_buy' => Product::sum(
                DB::raw('stock * COALESCE(buy_price, 0)')
            ),

            'total_stock_value_sell' => Product::sum(
                DB::raw('stock * COALESCE(sell_price, 0)')
            ),

            'low_stock_count' => Product::where('stock', '>', 0)
                ->where('stock', '<=', 10)
                ->count(),

            'out_of_stock_count' => Product::where('stock', '<=', 0)
                ->count(),
        ];
    }
}
