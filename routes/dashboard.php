<?php

use App\Http\Controllers\Dashboard\AdminsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard.welcome');
})->name('home');

Route::group(['prefix' => 'admins', 'controller' => AdminsController::class, 'as' => 'admins.'], function () {
    Route::get('', 'index')->name('index');
    Route::get('/data', 'data')->name('data');
    Route::get('/stats', 'stats')->name('stats');
    Route::get('/chart-data', 'chartData')->name('chart');
    Route::get('/{admin}', 'show')->name('show');
    Route::post('/store', 'store')->name('store');
    Route::put('/{admin}', 'update')->name('update');
    Route::delete('/{admin}', 'destroy')->name('destroy');
});
