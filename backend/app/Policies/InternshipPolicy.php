<?php

namespace App\Policies;

use App\Models\Internship;
use App\Models\User;

class InternshipPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === 'company' || $user->role === 'admin';
    }

    public function create(User $user): bool
    {
        return $user->role === 'company';
    }

    public function update(User $user, Internship $internship): bool
    {
        return $user->role === 'company' && $user->company->id === $internship->company_id;
    }

    public function delete(User $user, Internship $internship): bool
    {
        return $user->role === 'company' && $user->company->id === $internship->company_id;
    }

    public function restore(User $user, Internship $internship): bool
    {
        return $user->role === 'company' && $user->company->id === $internship->company_id;
    }
}
