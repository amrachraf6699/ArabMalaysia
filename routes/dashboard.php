<?php

use App\Http\Controllers\Dashboard\AdminsController;
use App\Http\Controllers\Dashboard\UsersController;
use App\Http\Controllers\Dashboard\RolesController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('dashboard.welcome');
})->name('home');

Route::group(['prefix' => 'admins', 'controller' => AdminsController::class, 'as' => 'admins.'], function () {
    Route::get('', 'index')->name('index')->middleware('can:admins_read');
    Route::get('/data', 'data')->name('data')->middleware('can:admins_read');
    Route::get('/stats', 'stats')->name('stats')->middleware('can:admins_read');
    Route::get('/chart-data', 'chartData')->name('chart')->middleware('can:admins_read');
    Route::get('/{admin}', 'show')->name('show')->middleware('can:admins_read');
    Route::post('/store', 'store')->name('store')->middleware('can:admins_create');
    Route::put('/{admin}', 'update')->name('update')->middleware('can:admins_update');
    Route::delete('/{admin}', 'destroy')->name('destroy')->middleware('can:admins_delete');
});

Route::group(['prefix' => 'users', 'controller' => UsersController::class, 'as' => 'users.'], function () {
    Route::get('', 'index')->name('index')->middleware('can:users_read');
    Route::get('/data', 'data')->name('data')->middleware('can:users_read');
    Route::get('/stats', 'stats')->name('stats')->middleware('can:users_read');
    Route::get('/chart-data', 'chartData')->name('chart')->middleware('can:users_read');
    Route::get('/{user}', 'show')->name('show')->middleware('can:users_read');
    Route::post('/store', 'store')->name('store')->middleware('can:users_create');
    Route::put('/{user}', 'update')->name('update')->middleware('can:users_update');
    Route::delete('/{user}', 'destroy')->name('destroy')->middleware('can:users_delete');
});

Route::group(['prefix' => 'roles', 'controller' => RolesController::class, 'as' => 'roles.'], function () {
    Route::get('', 'index')->name('index')->middleware('can:roles_read');
    Route::get('/data', 'data')->name('data')->middleware('can:roles_read');
    Route::get('/stats', 'stats')->name('stats')->middleware('can:roles_read');
    Route::get('/chart-data', 'chartData')->name('chart')->middleware('can:roles_read');
    Route::get('/{role}', 'show')->name('show')->middleware('can:roles_read');
    Route::post('/store', 'store')->name('store')->middleware('can:roles_create');
    Route::put('/{role}', 'update')->name('update')->middleware('can:roles_update');
    Route::delete('/{role}', 'destroy')->name('destroy')->middleware('can:roles_delete');
});
