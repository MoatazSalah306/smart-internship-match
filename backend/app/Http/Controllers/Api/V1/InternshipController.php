<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\InternshipResource;
use App\Models\Internship;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class InternshipController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = Internship::with('company.user', 'skills');

        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('company', function($cq) use ($search) {
                      $cq->where('company_name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('skills', function($sq) use ($search) {
                      $sq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $internships = $query->latest()->paginate(10);
        return InternshipResource::collection($internships);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Internship::class);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'requirements' => 'nullable|string',
            'duration' => 'nullable|string',
            'stipend' => 'nullable|numeric',
            'deadline' => 'nullable|date',
            'required_skills' => 'array',
            'required_skills.*' => 'string',
        ]);

        $company = Auth::user()->company;
        $internship = $company->internships()->create($validated);

        if ($request->has('required_skills')) {
            $skillIds = [];
            foreach ($request->required_skills as $skillName) {
                $skill = \App\Models\Skill::firstOrCreate(['name' => strtolower(trim($skillName))]);
                $skillIds[] = $skill->id;
            }
            $internship->skills()->sync($skillIds);
        }

        return new InternshipResource($internship->load('skills'));
    }

    public function show(Internship $internship)
    {
        return new InternshipResource($internship->load('company.user', 'skills'));
    }

    public function update(Request $request, Internship $internship)
    {
        $this->authorize('update', $internship);

        $validated = $request->validate([
            'title' => 'string|max:255',
            'description' => 'string',
            'requirements' => 'nullable|string',
            'duration' => 'nullable|string',
            'stipend' => 'nullable|numeric',
            'deadline' => 'nullable|date',
            'required_skills' => 'array',
            'required_skills.*' => 'string',
        ]);

        $internship->update($validated);

        if ($request->has('required_skills')) {
            $skillIds = [];
            foreach ($request->required_skills as $skillName) {
                $skill = \App\Models\Skill::firstOrCreate(['name' => strtolower(trim($skillName))]);
                $skillIds[] = $skill->id;
            }
            $internship->skills()->sync($skillIds);
        }

        return new InternshipResource($internship->load('skills'));
    }

    public function destroy(Internship $internship)
    {
        $this->authorize('delete', $internship);
        $internship->delete();
        return response()->json(['message' => 'Internship deleted successfully']);
    }

    public function archived()
    {
        $this->authorize('viewAny', Internship::class);
        $company = Auth::user()->company;
        $internships = $company->internships()->onlyTrashed()->with('skills')->get();
        return InternshipResource::collection($internships);
    }

    public function restore($id)
    {
        $internship = Internship::onlyTrashed()->findOrFail($id);
        $this->authorize('restore', $internship);
        $internship->restore();
        return new InternshipResource($internship);
    }

    public function myInternships(Request $request)
    {
        $this->authorize('viewAny', Internship::class);
        $company = Auth::user()->company;
        $query = $company->internships()->with('skills');
        if ($request->has('archived') && $request->boolean('archived')) {
            $query->onlyTrashed();
        }
        $internships = $query->latest()->paginate(10);
        return InternshipResource::collection($internships);
    }

    public function applicants($id)
    {
        $internship = Internship::findOrFail($id);
        $this->authorize('update', $internship);
        $applications = $internship->applications()->with('student.user')->latest()->get();
        return \App\Http\Resources\V1\ApplicationResource::collection($applications);
    }
}
