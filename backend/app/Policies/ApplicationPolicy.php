<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ApplicationPolicy
{
    public function view(User $user, Application $application): Response
    {
        if ($user->role === 'admin') {
            return Response::allow();
        }

        if ($user->role === 'student' && $user->student->id === $application->student_id) {
            return Response::allow();
        }

        if ($user->role === 'company' && $user->company->id === $application->internship->company_id) {
            return Response::allow();
        }

        return Response::deny('You are not authorized to view this application.');
    }

    public function update(User $user, Application $application): Response
    {
        if ($user->role === 'admin') {
            return Response::allow();
        }

        // Students can't update application status, only companies can.
        if ($user->role === 'company' && $user->company->id === $application->internship->company_id) {
            return Response::allow();
        }

        return Response::deny('You are not authorized to update this application.');
    }
}
