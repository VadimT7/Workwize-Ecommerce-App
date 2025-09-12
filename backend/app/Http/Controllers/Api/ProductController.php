<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

/**
 * Product controller - handles supplier product management
 */
class ProductController extends Controller
{
    /**
     * Display a listing of the supplier's products.
     */
    public function index(Request $request)
    {
        // Get products for the authenticated supplier
        $products = $request->user()->products()->latest()->get();

        return response()->json($products);
    }

    /**
     * Display all products (for customers to browse)
     */
    public function allProducts(Request $request)
    {
        $query = Product::with('supplier:id,name');

        // Optional search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Only show products in stock if requested
        if ($request->get('in_stock')) {
            $query->where('stock_quantity', '>', 0);
        }

        $products = $query->latest()->get();

        return response()->json($products);
    }

    /**
     * Store a newly created product.
     */
    public function store(Request $request)
    {
        // Check if user is a supplier
        if (!$request->user()->isSupplier()) {
            return response()->json(['message' => 'Unauthorized. Only suppliers can add products.'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'image_url' => 'nullable|url',
        ]);

        $product = $request->user()->products()->create($validated);

        return response()->json($product, 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product)
    {
        $product->load('supplier:id,name');
        return response()->json($product);
    }

    /**
     * Update the specified product.
     */
    public function update(Request $request, Product $product)
    {
        // Check if user owns this product
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only edit your own products.'], 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock_quantity' => 'sometimes|required|integer|min:0',
            'image_url' => 'nullable|url',
        ]);

        $product->update($validated);

        return response()->json($product);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Request $request, Product $product)
    {
        // Check if user owns this product
        if ($product->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only delete your own products.'], 403);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully']);
    }

    /**
     * Get purchase history for supplier's products
     */
    public function purchases(Request $request)
    {
        if (!$request->user()->isSupplier()) {
            return response()->json(['message' => 'Unauthorized. Only suppliers can view purchases.'], 403);
        }

        $purchases = $request->user()
            ->products()
            ->join('order_items', 'products.id', '=', 'order_items.product_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('users', 'orders.user_id', '=', 'users.id')
            ->where('orders.status', 'paid')
            ->select(
                'users.email as customer_email',
                'products.name as product_name',
                'order_items.quantity',
                'order_items.price',
                'order_items.subtotal',
                'orders.created_at as purchased_at'
            )
            ->orderBy('orders.created_at', 'desc')
            ->get();

        return response()->json($purchases);
    }
}

