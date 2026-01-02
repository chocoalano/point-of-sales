<?php

namespace App\Http\Controllers\Apps;

use Inertia\Inertia;
use Inertia\Response;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        // Get per_page from request, default to 10
        $perPage = $request->input('per_page', 10);

        // Validate per_page value
        $perPage = in_array($perPage, [5, 10, 25, 50, 100]) ? $perPage : 10;

        // Get categories with search filter
        $categories = Category::when($request->search, function ($query, $search) {
            $query->where('name', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
        })->latest()->paginate($perPage)->withQueryString();

        // Return inertia with filters
        return Inertia::render('Dashboard/Categories/Index', [
            'categories' => $categories,
            'filters' => [
                'search' => $request->search ?? '',
                'per_page' => (string) $perPage,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Dashboard/Categories/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        /**
         * validate
         */
        $request->validate([
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:2048',
            'name' => 'required',
            'description' => 'required'
        ]);

        $imageName = null;

        //upload image
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $image->storeAs('public/category', $image->hashName());
            $imageName = $image->hashName();
        }

        //create category
        Category::create([
            'image' => $imageName,
            'name' => $request->name,
            'description' => $request->description
        ]);

        //redirect
        return to_route('categories.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Category $category): Response
    {
        return Inertia::render('Dashboard/Categories/Edit', [
            'category' => $category,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Category $category): RedirectResponse
    {
        /**
         * validate
         */
        $request->validate([
            'name' => 'required',
            'description' => 'required'
        ]);

        //check image update
        if ($request->file('image')) {

            //remove old image
            Storage::disk('local')->delete('public/category/' . basename($category->image));

            //upload new image
            $image = $request->file('image');
            $image->storeAs('public/category', $image->hashName());

            //update category with new image
            $category->update([
                'image' => $image->hashName(),
                'name' => $request->name,
                'description' => $request->description
            ]);
        }

        //update category without image
        $category->update([
            'name' => $request->name,
            'description' => $request->description
        ]);

        //redirect
        return to_route('categories.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): RedirectResponse
    {
        //find by ID
        $category = Category::findOrFail($id);

        //remove image
        Storage::disk('local')->delete('public/category/' . basename($category->image));

        //delete
        $category->delete();

        //redirect
        return to_route('categories.index');
    }
}
