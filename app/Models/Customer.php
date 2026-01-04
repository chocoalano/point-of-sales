<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    /**
     * fillable
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'no_telp',
        'address'
    ];

    /**
     * Get all transactions for the customer
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
