<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    public function update(User $user, Application $application): bool
    {
        if ($user->role === 'company') {
            return $user->company->id === $application->internship->company_id;
        }
        return false;
    }

    public function delete(User $user, Application $application): bool
    {
        // Students can withdraw their own pending applications
        if ($user->role === 'student') {
            return $user->student->id === $application->student_id;
        }
        return false;
    }
}
