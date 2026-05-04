<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CompanyProfileController extends Controller
{
    public function show()
    {
        $company = Auth::user()->company;
        return response()->json(['data' => $company->load('user')]);
    }

    public function update(Request $request)
    {
        $company = Auth::user()->company;

        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'industry' => 'nullable|string|max:255',
            'website' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        $company->update($validated);

        return response()->json(['data' => $company->load('user')]);
    }
}
