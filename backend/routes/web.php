<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API / JSON Routes
|--------------------------------------------------------------------------
| Keep your existing root JSON endpoint if you still want it,
| but move it under /api to avoid colliding with React frontend.
*/

Route::get('/api', function () {
    return ['Laravel' => app()->version()];
});

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';

/*
|--------------------------------------------------------------------------
| React Frontend Catch-All
|--------------------------------------------------------------------------
| Any route that is not /api or auth will return React's index.html
| so React Router can handle navigation on the client.
*/

Route::get('/{any}', function () {
    $indexPath = public_path('index.html');
    if (!file_exists($indexPath)) {
        abort(404, 'React build not found');
    }
    return file_get_contents($indexPath);
})->where('any', '.*');