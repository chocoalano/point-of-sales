<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Purchase;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    public function index(Request $request)
    {
        // Filters
        $filters = [
            'search' => $request->input('search'),
            'supplier' => $request->input('supplier'),
            'status' => $request->input('status'),
            'date_from' => $request->input('date_from'),
            'date_to' => $request->input('date_to'),
        ];

        $purchases = Purchase::query()
            ->with('items.product')
            ->withSum('items as total_quantity', 'quantity')
            ->withSum('items as total_price_sum', 'total_price')
            ->when($filters['search'], function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference', 'like', "%{$search}%")
                      ->orWhere('supplier_name', 'like', "%{$search}%");
                });
            })
            ->when($filters['supplier'], function ($query, $supplier) {
                $query->where('supplier_name', 'like', "%{$supplier}%");
            })
            ->when($filters['status'], function ($query, $status) {
                $query->where('status', $status);
            })
            ->when($filters['date_from'], function ($query, $date) {
                $query->whereDate('purchase_date', '>=', $date);
            })
            ->when($filters['date_to'], function ($query, $date) {
                $query->whereDate('purchase_date', '<=', $date);
            })
            ->orderByDesc('created_at')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Dashboard/Purchase/Index', [
            'purchases' => $purchases,
            'filters' => $filters,
        ]);
    }

    public function create()
    {
        // Supaya bisa cari produk berdasarkan barcode di React
        $products = \App\Models\Product::all();

        return Inertia::render('Dashboard/Purchase/Create', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        // dd($request->all());

        $request->validate([
            'supplier_name' => 'nullable|string|max:255',
            'purchase_date' => 'required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'tax_included' => 'boolean',
            'reference' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.barcode' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.purchase_price' => 'required|numeric|min:0',
            'items.*.tax_percent' => 'nullable|numeric|min:0',
            'items.*.discount_percent' => 'nullable|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $purchase = Purchase::create([
                'supplier_name' => $request->supplier_name,
                'purchase_date' => $request->purchase_date,
                'status' => $request->status ?? 'received',
                'notes' => $request->notes,
                'tax_included' => $request->tax_included ?? false,
                'reference' => $request->reference,
            ]);

            foreach ($request->items as $item) {
                // Find product by barcode to get product_id
                $product = \App\Models\Product::where('barcode', $item['barcode'])->first();

                $purchase->items()->create([
                    'product_id' => $product?->id,
                    'barcode' => $item['barcode'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'total_price' => $item['total_price'],
                    'tax_percent' => $item['tax_percent'] ?? 0,
                    'discount_percent' => $item['discount_percent'] ?? 0,
                    'warehouse' => $item['warehouse'] ?? null,
                    'batch' => $item['batch'] ?? null,
                    'expired' => $item['expired'] ?? null,
                    'currency' => $item['currency'] ?? 'IDR',
                ]);

                // Update product stock if product exists
                if ($product) {
                    $product->increment('stock', $item['quantity']);
                }
            }

            // Process inventory adjustment
            $purchase->load('items.product');
            $this->inventoryService->processPurchase($purchase);

            DB::commit();

            return to_route('purchase.index')
                ->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Gagal menyimpan pembelian: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified purchase with full details.
     */
    public function show(Purchase $purchase)
    {
        $purchase->load([
            'items.product.category',
            'user',
        ]);

        // Get inventory adjustments related to this purchase
        $inventoryAdjustments = \App\Models\InventoryAdjustment::where('reference_type', 'purchase')
            ->where('reference_id', $purchase->id)
            ->with(['product', 'user'])
            ->get();

        // Calculate totals
        $totals = [
            'subtotal' => $purchase->items->sum('total_price'),
            'total_quantity' => $purchase->items->sum('quantity'),
            'total_items' => $purchase->items->count(),
            'total_tax' => $purchase->items->sum(function ($item) {
                return $item->total_price * ($item->tax_percent / 100);
            }),
            'total_discount' => $purchase->items->sum(function ($item) {
                $basePrice = $item->quantity * $item->purchase_price;
                return $basePrice * ($item->discount_percent / 100);
            }),
        ];

        return Inertia::render('Dashboard/Purchase/Show', [
            'purchase' => $purchase,
            'inventoryAdjustments' => $inventoryAdjustments,
            'totals' => $totals,
        ]);
    }

    public function edit(Purchase $purchase)
    {
        $products = Product::all();

        return Inertia::render('Dashboard/Purchase/Edit', [
            'purchase' => $purchase->load('items.product'),
            'products' => $products,
        ]);
    }

    public function update(Request $request, Purchase $purchase)
    {
        $request->validate([
            'supplier_name' => 'nullable|string|max:255',
            'purchase_date' => 'required|date',
            'status' => 'nullable|string',
            'notes' => 'nullable|string',
            'tax_included' => 'boolean',
            'reference' => 'nullable|string|max:255',
            'items' => 'required|array|min:1',
            'items.*.barcode' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:0',
            'items.*.purchase_price' => 'required|numeric|min:0',
            'items.*.tax_percent' => 'nullable|numeric|min:0',
            'items.*.discount_percent' => 'nullable|numeric|min:0',
            'items.*.total_price' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();

        try {
            $purchase->update([
                'supplier_name' => $request->supplier_name,
                'purchase_date' => $request->purchase_date,
                'status' => $request->status ?? 'received',
                'notes' => $request->notes,
                'tax_included' => $request->tax_included ?? false,
                'reference' => $request->reference,
            ]);

            // hapus semua item lama
            $oldItems = $purchase->items()->with('product')->get();

            // Reverse old stock changes
            foreach ($oldItems as $oldItem) {
                if ($oldItem->product_id) {
                    $oldItem->product->decrement('stock', $oldItem->quantity);
                }
            }

            // Delete old inventory adjustments
            \App\Models\InventoryAdjustment::where('reference_type', 'purchase')
                ->where('reference_id', $purchase->id)
                ->delete();

            $purchase->items()->delete();

            // simpan ulang item
            foreach ($request->items as $item) {
                // Find product by barcode to get product_id
                $product = Product::where('barcode', $item['barcode'])->first();

                $purchase->items()->create([
                    'product_id' => $product?->id,
                    'barcode' => $item['barcode'],
                    'description' => $item['description'] ?? null,
                    'quantity' => $item['quantity'],
                    'purchase_price' => $item['purchase_price'],
                    'total_price' => $item['total_price'],
                    'tax_percent' => $item['tax_percent'] ?? 0,
                    'discount_percent' => $item['discount_percent'] ?? 0,
                    'warehouse' => $item['warehouse'] ?? null,
                    'batch' => $item['batch'] ?? null,
                    'expired' => $item['expired'] ?? null,
                    'currency' => $item['currency'] ?? 'IDR',
                ]);

                // Update product stock if product exists
                if ($product) {
                    $product->increment('stock', $item['quantity']);
                }
            }

            // Process inventory adjustment
            $purchase->load('items.product');
            $this->inventoryService->processPurchase($purchase);

            DB::commit();

            return to_route('purchase.index')
                ->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Gagal mengupdate pembelian: ' . $e->getMessage()]);
        }
    }

    public function destroy(Purchase $purchase)
    {
        DB::beginTransaction();

        try {
            // Reverse inventory changes
            $purchase->load('items.product');

            foreach ($purchase->items as $item) {
                if ($item->product_id) {
                    $item->product->decrement('stock', $item->quantity);
                }
            }

            // Reverse inventory adjustments
            $this->inventoryService->reversePurchase($purchase);

            // Delete inventory adjustments
            \App\Models\InventoryAdjustment::where('reference_type', 'purchase')
                ->where('reference_id', $purchase->id)
                ->delete();

            if ($purchase->invoice) {
                Storage::delete('public/purchases/' . $purchase->invoice);
            }

            $purchase->delete();

            DB::commit();

            return to_route('purchase.index')
                ->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            return back()->withErrors(['error' => 'Gagal menghapus pembelian: ' . $e->getMessage()]);
        }
    }
}
