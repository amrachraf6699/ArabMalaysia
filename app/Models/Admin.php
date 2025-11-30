<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Admin extends Authenticatable
{
    use Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'profile_picture'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // public function getProfilePictureAttribute()
    // {
    //     return $this->profile_picture ? asset('storage/' . $this->profile_picture) : "https://ui-avatars.com/api/?name={$this->name}&color=7F9CF5&background=EBF4FF&format=svg";
    // }
}
