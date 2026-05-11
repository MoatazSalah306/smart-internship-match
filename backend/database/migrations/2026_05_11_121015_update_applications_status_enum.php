<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // We use a raw statement because changing enum values in migrations 
        // can be tricky depending on the database driver (e.g., SQLite doesn't support it directly)
        if (config('database.default') === 'mysql') {
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('pending', 'reviewed', 'accepted', 'rejected') DEFAULT 'pending'");
        }
        // For other drivers, we rely on the application-level validation for now
    }

    public function down(): void
    {
        if (config('database.default') === 'mysql') {
            DB::statement("ALTER TABLE applications MODIFY COLUMN status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending'");
        }
    }
};
