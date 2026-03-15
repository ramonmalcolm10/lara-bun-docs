<?php

use Illuminate\Support\Facades\Route;

// Routes are now file-based via resources/js/rsc/app/

// Error page testing
Route::get('/test-403', fn () => abort(403));
Route::get('/test-500', fn () => throw new \RuntimeException('Test error'));
