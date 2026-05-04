<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InternshipResource extends JsonResource
{
    public function toArray(Request $request): array
    {
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
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'deleted_at' => $this->deleted_at,
        ];
    }
}
