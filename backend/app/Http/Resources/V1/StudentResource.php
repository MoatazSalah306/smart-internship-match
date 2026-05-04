<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name ?? null,
            'email' => $this->user->email ?? null,
            'bio' => $this->bio,
            'university' => $this->university,
            'phone' => $this->phone,
            'cv_url' => $this->cv_path ? asset('storage/' . $this->cv_path) : null,
            'cv_filename' => $this->cv_path ? basename($this->cv_path) : null,
            'skills' => $this->whenLoaded('skills', function () {
                return $this->skills->pluck('name');
            }),
        ];
    }
}
