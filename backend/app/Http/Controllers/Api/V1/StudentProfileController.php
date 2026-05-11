<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class StudentProfileController extends Controller
{
    public function show()
    {
        $student = Auth::user()->student;
        return new StudentResource($student->load('user', 'skills'));
    }

    public function update(Request $request)
    {
        $student = Auth::user()->student;

        $validated = $request->validate([
            'bio' => 'nullable|string',
            'phone' => 'nullable|string|regex:/^[0-9]{11}$/',
            'university' => 'nullable|string|max:255',
            'skills' => 'array',
            'skills.*' => 'string',
        ]);

        $student->update($validated);

        if ($request->has('skills')) {
            $skillIds = [];
            foreach ($request->skills as $skillName) {
                $skill = \App\Models\Skill::firstOrCreate(['name' => strtolower(trim($skillName))]);
                $skillIds[] = $skill->id;
            }
            $student->skills()->sync($skillIds);
        }

        return new StudentResource($student->load('user', 'skills'));
    }

    public function uploadCv(Request $request)
    {
        $request->validate([
            'cv' => 'required|file|mimes:pdf|max:2048',
        ]);

        $student = Auth::user()->student;

        if ($student->cv_path) {
            Storage::disk('public')->delete($student->cv_path);
        }

        $path = $request->file('cv')->store('cvs', 'public');
        $student->update(['cv_path' => $path]);

        return new StudentResource($student->load('user', 'skills'));
    }

    public function deleteCv()
    {
        $student = Auth::user()->student;

        if ($student->cv_path) {
            Storage::disk('public')->delete($student->cv_path);
            $student->update(['cv_path' => null]);
        }

        return new StudentResource($student->load('user', 'skills'));
    }
}
