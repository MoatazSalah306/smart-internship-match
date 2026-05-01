<?php

namespace App\Policies;

use App\Models\Internship;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class InternshipPolicy
{
    public function update(User $user, Internship $internship): Response
    {
        if ($user->role === 'admin') {
            return Response::allow();
        }

        return $user->role === 'company' && $user->company->id === $internship->company_id
            ? Response::allow()
            : Response::deny('You do not own this internship.');
    }

    public function delete(User $user, Internship $internship): Response
    {
        if ($user->role === 'admin') {
            return Response::allow();
        }

        return $user->role === 'company' && $user->company->id === $internship->company_id
            ? Response::allow()
            : Response::deny('You do not own this internship.');
    }
}
