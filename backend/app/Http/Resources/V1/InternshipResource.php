<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Auth;

class InternshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $user = Auth::guard('sanctum')->user();
        $student = ($user && $user->role === 'student') ? $user->student : null;

        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'requirements' => $this->requirements,
            'duration' => $this->duration,
            'stipend' => $this->stipend,
            'deadline' => $this->deadline,
            'company' => new CompanyResource($this->whenLoaded('company')),
            'required_skills' => $this->whenLoaded('skills', function () {
                return $this->skills->pluck('name');
            }),
            'match_score' => $student ? $this->calculateMatchScore($student) : null,
            'has_applied' => $student ? $this->applications()->where('student_id', $student->id)->exists() : false,
            'applications_count' => $this->applications_count ?? 0,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }

    private function calculateMatchScore($student): int
    {
        $internshipSkills = $this->skills->pluck('id');
        if ($internshipSkills->isEmpty()) return 100;
        
        $studentSkills = $student->skills->pluck('id');
        $matchCount = $studentSkills->intersect($internshipSkills)->count();
        
        return (int) round(($matchCount / $internshipSkills->count()) * 100);
    }
}
