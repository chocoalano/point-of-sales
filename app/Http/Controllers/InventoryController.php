<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Category;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryController extends Controller
{
    public function index(Request $request)
    {
        // Filters
        $filters = [
            'search' => $request->input('search'),
            'category_id' => $request->input('category_id'),
            'stock_status' => $request->input('stock_status'), // low, out, available
        ];

        // Product query with inventory and adjustment data
        $productsQuery = Product::query()
            ->with(['category', 'inventory'])
            // Menghitung total pembelian
            ->withSum('purchaseItems as purchase_quantity', 'quantity')
            ->withSum('purchaseItems as purchase_total', 'total_price')
            // Menghitung total penjualan per produk
            ->withSum('transactionDetails as sale_quantity', 'quantity')
            // Menghitung total adjustment
            ->withCount(['inventoryAdjustments as adjustment_count'])
            // Urutkan berdasarkan title produk
            ->orderBy('title');

        // Apply filters
        if ($filters['search']) {
            $search = $filters['search'];
            $productsQuery->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($filters['category_id']) {
            $productsQuery->where('category_id', $filters['category_id']);
        }

        if ($filters['stock_status']) {
            switch ($filters['stock_status']) {
                case 'low':
                    $productsQuery->where('stock', '>', 0)->where('stock', '<=', 10);
                    break;
                case 'out':
                    $productsQuery->where('stock', '<=', 0);
                    break;
                case 'available':
                    $productsQuery->where('stock', '>', 10);
                    break;
            }
        }

        $products = $productsQuery->paginate(15)->withQueryString();

        // Calculate summary
        $summaryQuery = Product::query();
        $summary = [
            'total_products' => $summaryQuery->count(),
            'total_stock' => Product::sum('stock'),
            'total_stock_value' => Product::selectRaw('SUM(stock * buy_price) as value')->value('value') ?? 0,
            'total_sell_value' => Product::selectRaw('SUM(stock * sell_price) as value')->value('value') ?? 0,
            'low_stock_count' => Product::where('stock', '>', 0)->where('stock', '<=', 10)->count(),
            'out_of_stock_count' => Product::where('stock', '<=', 0)->count(),
            'total_adjustments' => InventoryAdjustment::count(),
            'today_adjustments' => InventoryAdjustment::whereDate('created_at', today())->count(),
        ];

        // Get categories for filter
        $categories = Category::orderBy('name')->get(['id', 'name']);

        // Get recent adjustments
        $recentAdjustments = InventoryAdjustment::with(['product:id,title,barcode', 'user:id,name'])
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Dashboard/Reports/Inventories', [
            'products' => $products,
            'filters' => $filters,
            'summary' => $summary,
            'categories' => $categories,
            'recentAdjustments' => $recentAdjustments,
        ]);
    }

    /**
     * Get product detail with all inventory relations
     */
    public function show($id)
    {
        $product = Product::with([
            'category',
            'inventory',
            'purchaseItems.purchase',
            'transactionDetails.transaction',
            'inventoryAdjustments' => function ($q) {
                $q->with('user:id,name')->latest()->take(20);
            }
        ])
            ->withSum('purchaseItems as total_purchased', 'quantity')
            ->withSum('transactionDetails as total_sold', 'quantity')
            ->findOrFail($id);

        // Calculate movement summary
        $movementSummary = [
            'total_in' => InventoryAdjustment::where('product_id', $id)
                ->whereIn('type', ['in', 'purchase', 'return'])
                ->sum('quantity_change'),
            'total_out' => abs(InventoryAdjustment::where('product_id', $id)
                ->whereIn('type', ['out', 'sale', 'damage'])
                ->sum('quantity_change')),
            'total_corrections' => InventoryAdjustment::where('product_id', $id)
                ->where('type', 'correction')
                ->count(),
        ];

        return response()->json([
            'product' => $product,
            'movementSummary' => $movementSummary,
        ]);
    }

    public function create() {}
    public function store(Request $request) {}
    public function edit($id) {}
    public function update(Request $request, $id) {}
    public function destroy($id) {}
}
