<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * Order controller - handles customer orders and checkout
 */
class OrderController extends Controller
{
    /**
     * Display a listing of the customer's orders.
     */
    public function index(Request $request)
    {
        if (!$request->user()->isCustomer()) {
            return response()->json(['message' => 'Unauthorized. Only customers can view orders.'], 403);
        }

        $orders = $request->user()
            ->orders()
            ->with(['orderItems.product:id,name,price,image_url'])
            ->latest()
            ->get();

        return response()->json($orders);
    }

    /**
     * Create a new order (checkout)
     */
    public function checkout(Request $request)
    {
        if (!$request->user()->isCustomer()) {
            return response()->json(['message' => 'Unauthorized. Only customers can place orders.'], 403);
        }

        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            $order = DB::transaction(function () use ($request, $validated) {
                $totalAmount = 0;
                $orderItems = [];

                // Validate stock and prepare order items
                foreach ($validated['items'] as $item) {
                    $product = Product::find($item['product_id']);

                    // Check stock availability
                    if ($product->stock_quantity < $item['quantity']) {
                        throw new \Exception("Product '{$product->name}' has insufficient stock. Available: {$product->stock_quantity}");
                    }

                    $subtotal = $product->price * $item['quantity'];
                    $totalAmount += $subtotal;

                    $orderItems[] = [
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                        'subtotal' => $subtotal,
                    ];
                }

                // Create order
                $order = $request->user()->orders()->create([
                    'total_amount' => $totalAmount,
                    'status' => 'pending',
                ]);

                // Create order items
                foreach ($orderItems as $orderItem) {
                    $order->orderItems()->create($orderItem);
                    
                    // Decrease product stock
                    $product = Product::find($orderItem['product_id']);
                    $product->decreaseStock($orderItem['quantity']);
                }

                // Simulate payment (in real app, integrate payment gateway here)
                $order->markAsPaid();

                return $order;
            });

            $order->load('orderItems.product:id,name,image_url');

            return response()->json([
                'message' => 'Order placed successfully',
                'order' => $order,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Order failed',
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified order.
     */
    public function show(Request $request, Order $order)
    {
        // Check if user owns this order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only view your own orders.'], 403);
        }

        $order->load('orderItems.product:id,name,price,image_url');

        return response()->json($order);
    }

    /**
     * Cancel an order (only if pending)
     */
    public function cancel(Request $request, Order $order)
    {
        // Check if user owns this order
        if ($order->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized. You can only cancel your own orders.'], 403);
        }

        if (!$order->isPending()) {
            return response()->json(['message' => 'Only pending orders can be cancelled.'], 400);
        }

        DB::transaction(function () use ($order) {
            // Restore stock for each item
            foreach ($order->orderItems as $item) {
                $item->product->increaseStock($item->quantity);
            }

            $order->markAsCancelled();
        });

        return response()->json(['message' => 'Order cancelled successfully']);
    }
}

