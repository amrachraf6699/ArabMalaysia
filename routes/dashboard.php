<?php

use App\Http\Controllers\Dashboard\AdminsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard.welcome');
})->name('home');

Route::get('/admins', [AdminsController::class, 'index'])->name('admins.index');
Route::get('/admins/data', [AdminsController::class, 'data'])->name('admins.data');
Route::get('/admins/stats', [AdminsController::class, 'stats'])->name('admins.stats');
Route::get('/admins/chart-data', [AdminsController::class, 'chartData'])->name('admins.chart');
Route::get('/admins/{admin}', [AdminsController::class, 'show'])->name('admins.show');
Route::post('/admins/store', [AdminsController::class, 'store'])->name('admins.store');
Route::put('/admins/{admin}', [AdminsController::class, 'update'])->name('admins.update');
Route::delete('/admins/{admin}', [AdminsController::class, 'destroy'])->name('admins.destroy');
