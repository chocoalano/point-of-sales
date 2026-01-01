<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_adjustments', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->enum('type', ['in', 'out', 'adjustment', 'purchase', 'sale', 'return', 'damage', 'correction'])
                ->default('adjustment');

            $table->decimal('quantity_before', 15, 2)->default(0);
            $table->decimal('quantity_change', 15, 2)->default(0);
            $table->decimal('quantity_after', 15, 2)->default(0);

            $table->string('reference_type')->nullable(); // purchase, transaction, manual
            $table->unsignedBigInteger('reference_id')->nullable();

            $table->text('reason')->nullable();
            $table->text('notes')->nullable();

            $table->timestamps();

            $table->index(['product_id', 'created_at']);
            $table->index(['reference_type', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_adjustments');
    }
};
