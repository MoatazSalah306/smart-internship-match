<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\ApplicationResource;
use App\Models\Application;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ApplicationController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $user = Auth::user();
        
        if ($user->role === 'student') {
            $applications = $user->student->applications()->with('internship.company.user')->latest()->get();
        } elseif ($user->role === 'company') {
            $applications = Application::whereHas('internship', function($query) use ($user) {
                $query->where('company_id', $user->company->id);
            })->with('student.user', 'internship')->latest()->get();
        } else {
            $applications = Application::with('student.user', 'internship.company.user')->latest()->get();
        }

        return ApplicationResource::collection($applications);
    }

    public function store(Request $request, $internship_id = null)
    {
        if ($internship_id) {
            $request->merge(['internship_id' => $internship_id]);
        }

        $request->validate([
            'internship_id' => 'required|exists:internships,id',
        ]);

        $student = Auth::user()->student;
        $internship = Internship::with('skills')->findOrFail($request->internship_id);

        if ($student->applications()->where('internship_id', $internship->id)->exists()) {
            return response()->json(['message' => 'You have already applied for this internship'], 422);
        }

        // Match Score Logic
        $internshipSkills = $internship->skills->pluck('id');
        $studentSkills = $student->skills->pluck('id');
        
        $matchCount = $studentSkills->intersect($internshipSkills)->count();
        $totalRequired = $internshipSkills->count();
        
        $matchScore = $totalRequired > 0 ? round(($matchCount / $totalRequired) * 100) : 0;

        $application = $student->applications()->create([
            'internship_id' => $internship->id,
            'match_score' => $matchScore,
            'status' => 'pending'
        ]);

        return new ApplicationResource($application->load('internship', 'student'));
    }

    public function update(Request $request, Application $application)
    {
        $this->authorize('update', $application);

        $request->validate([
            'status' => 'required|in:pending,accepted,rejected',
        ]);

        $application->update(['status' => $request->status]);

        return new ApplicationResource($application);
    }

    public function destroy(Application $application)
    {
        $this->authorize('delete', $application);
        $application->delete();
        return response()->json(['message' => 'Application withdrawn successfully']);
    }
}
