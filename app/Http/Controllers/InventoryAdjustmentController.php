<?php

namespace App\Http\Controllers;

use App\Models\Inventory;
use App\Models\InventoryAdjustment;
use App\Models\Product;
use App\Services\InventoryService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InventoryAdjustmentController extends Controller
{
    protected InventoryService $inventoryService;

    public function __construct(InventoryService $inventoryService)
    {
        $this->inventoryService = $inventoryService;
    }

    /**
     * Display a listing of inventory adjustments.
     */
    public function index(Request $request)
    {
        $query = InventoryAdjustment::with(['product', 'user'])
            ->orderBy('created_at', 'desc');

        // Filter by product
        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        // Filter by date range
        if ($request->filled('from') && $request->filled('to')) {
            $query->dateRange($request->from, $request->to);
        }

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reason', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($q) use ($search) {
                        $q->where('title', 'like', "%{$search}%")
                            ->orWhere('barcode', 'like', "%{$search}%");
                    });
            });
        }

        $adjustments = $query->paginate(15)->withQueryString();

        // Get summary data
        $summary = $this->inventoryService->getInventorySummary();

        // Get products for filter
        $products = Product::select('id', 'title', 'barcode')->orderBy('title')->get();

        return Inertia::render('InventoryAdjustment/Index', [
            'adjustments' => $adjustments,
            'products' => $products,
            'summary' => $summary,
            'types' => [
                InventoryAdjustment::TYPE_IN => 'Stock In',
                InventoryAdjustment::TYPE_OUT => 'Stock Out',
                InventoryAdjustment::TYPE_ADJUSTMENT => 'Adjustment',
                InventoryAdjustment::TYPE_PURCHASE => 'Purchase',
                InventoryAdjustment::TYPE_SALE => 'Sale',
                InventoryAdjustment::TYPE_RETURN => 'Return',
                InventoryAdjustment::TYPE_DAMAGE => 'Damage',
                InventoryAdjustment::TYPE_CORRECTION => 'Correction',
            ],
            'filters' => $request->only(['search', 'product_id', 'type', 'from', 'to']),
        ]);
    }

    /**
     * Show the form for creating a new adjustment.
     */
    public function create()
    {
        $products = Product::with('inventory')
            ->select('id', 'title', 'barcode', 'stock')
            ->orderBy('title')
            ->get();

        return Inertia::render('InventoryAdjustment/Create', [
            'products' => $products,
            'types' => [
                InventoryAdjustment::TYPE_IN => 'Stock In',
                InventoryAdjustment::TYPE_OUT => 'Stock Out',
                InventoryAdjustment::TYPE_ADJUSTMENT => 'Adjustment',
                InventoryAdjustment::TYPE_DAMAGE => 'Damage',
                InventoryAdjustment::TYPE_CORRECTION => 'Correction',
            ],
        ]);
    }

    /**
     * Store a newly created adjustment.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'type' => 'required|in:' . implode(',', [
                InventoryAdjustment::TYPE_IN,
                InventoryAdjustment::TYPE_OUT,
                InventoryAdjustment::TYPE_ADJUSTMENT,
                InventoryAdjustment::TYPE_DAMAGE,
                InventoryAdjustment::TYPE_CORRECTION,
            ]),
            'quantity' => 'required|numeric|min:0.01',
            'reason' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        if ($request->type === InventoryAdjustment::TYPE_CORRECTION) {
            // For correction, quantity is the new stock level
            $this->inventoryService->stockCorrection(
                $product,
                $request->quantity,
                $request->reason,
                auth()->id()
            );
        } else {
            $this->inventoryService->manualAdjustment(
                $product,
                $request->quantity,
                $request->type,
                $request->reason,
                auth()->id()
            );
        }

        return redirect()->route('inventory-adjustments.index')
            ->with('success', 'Inventory adjustment created successfully.');
    }

    /**
     * Display the specified adjustment with full details.
     */
    public function show(InventoryAdjustment $inventoryAdjustment)
    {
        $inventoryAdjustment->load([
            'product' => function ($query) {
                $query->with(['category', 'inventory']);
            },
            'user',
        ]);

        // Get related reference if exists
        $reference = null;
        if ($inventoryAdjustment->reference_type && $inventoryAdjustment->reference_id) {
            $reference = $inventoryAdjustment->reference();
            if ($reference) {
                if ($inventoryAdjustment->reference_type === 'purchase') {
                    $reference->load(['items.product', 'user']);
                } elseif ($inventoryAdjustment->reference_type === 'transaction') {
                    $reference->load(['details.product', 'user', 'customer']);
                }
            }
        }

        // Get other adjustments for the same product (recent 10)
        $relatedAdjustments = InventoryAdjustment::forProduct($inventoryAdjustment->product_id)
            ->where('id', '!=', $inventoryAdjustment->id)
            ->with('user')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('InventoryAdjustment/Show', [
            'adjustment' => $inventoryAdjustment,
            'reference' => $reference,
            'relatedAdjustments' => $relatedAdjustments,
            'types' => [
                InventoryAdjustment::TYPE_IN => 'Stock In',
                InventoryAdjustment::TYPE_OUT => 'Stock Out',
                InventoryAdjustment::TYPE_ADJUSTMENT => 'Adjustment',
                InventoryAdjustment::TYPE_PURCHASE => 'Purchase',
                InventoryAdjustment::TYPE_SALE => 'Sale',
                InventoryAdjustment::TYPE_RETURN => 'Return',
                InventoryAdjustment::TYPE_DAMAGE => 'Damage',
                InventoryAdjustment::TYPE_CORRECTION => 'Correction',
            ],
        ]);
    }

    /**
     * Display product inventory detail with all adjustments.
     */
    public function productHistory(Product $product, Request $request)
    {
        $product->load(['category', 'inventory']);

        $query = InventoryAdjustment::forProduct($product->id)
            ->with('user')
            ->orderBy('created_at', 'desc');

        // Filter by date range
        if ($request->filled('from') && $request->filled('to')) {
            $query->dateRange($request->from, $request->to);
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->ofType($request->type);
        }

        $adjustments = $query->paginate(20)->withQueryString();

        // Get summary for this product
        $summary = [
            'total_in' => InventoryAdjustment::forProduct($product->id)
                ->whereIn('type', [
                    InventoryAdjustment::TYPE_IN,
                    InventoryAdjustment::TYPE_PURCHASE,
                    InventoryAdjustment::TYPE_RETURN
                ])
                ->where('quantity_change', '>', 0)
                ->sum('quantity_change'),
            'total_out' => abs(InventoryAdjustment::forProduct($product->id)
                ->whereIn('type', [
                    InventoryAdjustment::TYPE_OUT,
                    InventoryAdjustment::TYPE_SALE,
                    InventoryAdjustment::TYPE_DAMAGE
                ])
                ->where('quantity_change', '<', 0)
                ->sum('quantity_change')),
            'current_stock' => $product->stock,
            'inventory_stock' => optional($product->inventory)->quantity ?? 0,
        ];

        return Inertia::render('InventoryAdjustment/ProductHistory', [
            'product' => $product,
            'adjustments' => $adjustments,
            'summary' => $summary,
            'types' => [
                InventoryAdjustment::TYPE_IN => 'Stock In',
                InventoryAdjustment::TYPE_OUT => 'Stock Out',
                InventoryAdjustment::TYPE_ADJUSTMENT => 'Adjustment',
                InventoryAdjustment::TYPE_PURCHASE => 'Purchase',
                InventoryAdjustment::TYPE_SALE => 'Sale',
                InventoryAdjustment::TYPE_RETURN => 'Return',
                InventoryAdjustment::TYPE_DAMAGE => 'Damage',
                InventoryAdjustment::TYPE_CORRECTION => 'Correction',
            ],
            'filters' => $request->only(['from', 'to', 'type']),
        ]);
    }

    /**
     * Sync inventory with products.
     */
    public function syncInventory()
    {
        $synced = $this->inventoryService->syncInventoryWithProducts();

        return redirect()->back()
            ->with('success', "Successfully synced {$synced} products with inventory.");
    }
}
