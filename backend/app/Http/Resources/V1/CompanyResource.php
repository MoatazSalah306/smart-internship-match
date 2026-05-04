<?php

namespace App\Http\Resources\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CompanyResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->name ?? null,
            'company_name' => $this->company_name,
            'email' => $this->user->email ?? null,
            'description' => $this->description,
            'website' => $this->website,
            'logo_url' => $this->logo ? asset('storage/' . $this->logo) : null,
        ];
    }
}
