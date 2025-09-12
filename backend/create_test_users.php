<?php
require_once __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle($request = Illuminate\Http\Request::capture());

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Create test customer
$customer = User::create([
    'name' => 'Test Customer',
    'email' => 'customer@example.com',
    'password' => Hash::make('password123'),
    'role' => 'customer'
]);

echo "Customer created: " . $customer->email . "\n";

// Create test supplier
$supplier = User::create([
    'name' => 'Test Supplier',
    'email' => 'supplier@example.com',
    'password' => Hash::make('password123'),
    'role' => 'supplier'
]);

echo "Supplier created: " . $supplier->email . "\n";

// Create some test products for the supplier
$products = [
    [
        'name' => 'Laptop',
        'description' => 'High-performance laptop for professionals',
        'price' => 999.99,
        'stock' => 10,
        'user_id' => $supplier->id
    ],
    [
        'name' => 'Wireless Mouse',
        'description' => 'Ergonomic wireless mouse with long battery life',
        'price' => 29.99,
        'stock' => 50,
        'user_id' => $supplier->id
    ],
    [
        'name' => 'USB-C Hub',
        'description' => '7-in-1 USB-C hub for connectivity',
        'price' => 49.99,
        'stock' => 25,
        'user_id' => $supplier->id
    ]
];

foreach ($products as $product) {
    \App\Models\Product::create($product);
    echo "Product created: " . $product['name'] . "\n";
}

echo "\nTest data created successfully!\n";
echo "Customer login: customer@example.com / password123\n";
echo "Supplier login: supplier@example.com / password123\n";
