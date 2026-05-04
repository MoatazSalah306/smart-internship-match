<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Application;
use App\Models\Internship;
use App\Models\Student;
use App\Models\Company;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    public function stats()
    {
        return response()->json([
            'total_students' => Student::count(),
            'total_companies' => Company::count(),
            'active_internships' => Internship::count(),
            'total_applications' => Application::count(),
            'applications_status' => [
                'pending' => Application::where('status', 'pending')->count(),
                'accepted' => Application::where('status', 'accepted')->count(),
                'rejected' => Application::where('status', 'rejected')->count(),
            ]
        ]);
    }

    public function students(Request $request)
    {
        $query = Student::with('user');
        if ($request->has('search')) {
            $query->whereHas('user', function($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            });
        }
        return \App\Http\Resources\V1\StudentResource::collection($query->latest()->paginate(10));
    }

    public function companies(Request $request)
    {
        $query = Company::with('user');
        if ($request->has('search')) {
            $query->where('company_name', 'like', "%{$request->search}%")
                  ->orWhereHas('user', function($q) use ($request) {
                      $q->where('email', 'like', "%{$request->search}%");
                  });
        }
        return \App\Http\Resources\V1\CompanyResource::collection($query->latest()->paginate(10));
    }

    public function internships(Request $request)
    {
        $query = Internship::with('company.user', 'skills')->withTrashed();
        if ($request->has('search')) {
            $query->where('title', 'like', "%{$request->search}%");
        }
        return \App\Http\Resources\V1\InternshipResource::collection($query->latest()->paginate(10));
    }
}
