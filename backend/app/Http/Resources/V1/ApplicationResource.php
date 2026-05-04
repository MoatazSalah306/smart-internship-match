<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ApplicationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'internship' => new InternshipResource($this->whenLoaded('internship')),
            'student' => new StudentResource($this->whenLoaded('student')),
            'status' => $this->status,
            'match_score' => $this->match_score,
            'created_at' => $this->created_at,
        ];
    }
}
