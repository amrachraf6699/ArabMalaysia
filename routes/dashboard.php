<?php

use App\Http\Controllers\Dashboard\AdminsController;
use App\Http\Controllers\Dashboard\UsersController;
use App\Http\Controllers\Dashboard\RolesController;
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

Route::group(['prefix' => 'users', 'controller' => UsersController::class, 'as' => 'users.'], function () {
    Route::get('', 'index')->name('index');
    Route::get('/data', 'data')->name('data');
    Route::get('/stats', 'stats')->name('stats');
    Route::get('/chart-data', 'chartData')->name('chart');
    Route::get('/{user}', 'show')->name('show');
    Route::post('/store', 'store')->name('store');
    Route::put('/{user}', 'update')->name('update');
    Route::delete('/{user}', 'destroy')->name('destroy');
});

Route::group(['prefix' => 'roles', 'controller' => RolesController::class, 'as' => 'roles.'], function () {
    Route::get('', 'index')->name('index');
    Route::get('/data', 'data')->name('data');
    Route::get('/stats', 'stats')->name('stats');
    Route::get('/chart-data', 'chartData')->name('chart');
    Route::get('/{role}', 'show')->name('show');
    Route::post('/store', 'store')->name('store');
    Route::put('/{role}', 'update')->name('update');
    Route::delete('/{role}', 'destroy')->name('destroy');
});
