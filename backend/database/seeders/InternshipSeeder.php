<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Company;
use App\Models\Internship;
use App\Models\Skill;
use Illuminate\Support\Facades\Hash;

class InternshipSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Skills
        $skills = [
            ['name' => 'React'],
            ['name' => 'Laravel'],
            ['name' => 'Python'],
            ['name' => 'UI/UX Design'],
            ['name' => 'Node.js'],
            ['name' => 'Marketing'],
            ['name' => 'Data Science'],
        ];

        foreach ($skills as $skill) {
            Skill::firstOrCreate($skill);
        }

        $allSkills = Skill::all();

        // 2. Create Companies
        $companiesData = [
            [
                'name' => 'Tech Corp',
                'email' => 'tech@corp.com',
                'company_name' => 'Tech Corp Systems',
                'description' => 'A leading software development company.',
                'website' => 'https://techcorp.com',
                'industry' => 'Technology'
            ],
            [
                'name' => 'Green Energy',
                'email' => 'jobs@greenenergy.com',
                'company_name' => 'Green Energy Solutions',
                'description' => 'Innovating in the renewable energy sector.',
                'website' => 'https://greenenergy.com',
                'industry' => 'Energy'
            ],
            [
                'name' => 'Creative Agency',
                'email' => 'hello@creative.com',
                'company_name' => 'Creative Minds Agency',
                'description' => 'Digital marketing and creative design studio.',
                'website' => 'https://creativeagency.com',
                'industry' => 'Creative'
            ],
        ];

        // 1.5 Create Admin
        User::firstOrCreate(
            ['email' => 'admin@smartmatch.com'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
                'role' => 'admin'
            ]
        );

        foreach ($companiesData as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name' => $data['name'],
                    'password' => Hash::make('password'),
                    'role' => 'company'
                ]
            );

            Company::firstOrCreate(
                ['user_id' => $user->id],
                [
                    'company_name' => $data['company_name'],
                    'description' => $data['description'],
                    'website' => $data['website'],
                    'industry' => $data['industry']
                ]
            );
        }

        $allCompanies = Company::all();

        // 3. Create Internships
        $internships = [
            [
                'title' => 'Frontend Developer Intern',
                'description' => 'Join our team to build amazing user interfaces with React and Tailwind CSS.',
                'requirements' => 'Basic knowledge of HTML, CSS, and JS. Familiarity with React is a plus.',
                'duration' => '3 Months',
                'stipend' => 500.00,
                'deadline' => now()->addMonths(2),
            ],
            [
                'title' => 'Backend Laravel Developer',
                'description' => 'Work on scalable APIs and backend systems using Laravel.',
                'requirements' => 'PHP knowledge, understanding of MVC architecture.',
                'duration' => '6 Months',
                'stipend' => 600.00,
                'deadline' => now()->addMonths(1),
            ],
            [
                'title' => 'UI/UX Design Intern',
                'description' => 'Help us design the next generation of our mobile app.',
                'requirements' => 'Proficiency in Figma or Adobe XD.',
                'duration' => '3 Months',
                'stipend' => 400.00,
                'deadline' => now()->addWeeks(3),
            ],
            [
                'title' => 'Python Data Analyst',
                'description' => 'Analyze large datasets and provide actionable insights.',
                'requirements' => 'Python, Pandas, and basic SQL.',
                'duration' => '4 Months',
                'stipend' => 700.00,
                'deadline' => now()->addMonths(3),
            ],
            [
                'title' => 'Digital Marketing Assistant',
                'description' => 'Manage social media campaigns and SEO.',
                'requirements' => 'Good communication skills, social media savvy.',
                'duration' => '2 Months',
                'stipend' => 0.00,
                'deadline' => now()->addMonth(),
            ],
            [
                'title' => 'Fullstack Developer',
                'description' => 'Build end-to-end features using Node.js and React.',
                'requirements' => 'JavaScript expertise.',
                'duration' => '6 Months',
                'stipend' => 800.00,
                'deadline' => now()->addMonths(4),
            ],
        ];

        foreach ($internships as $internshipData) {
            $company = $allCompanies->random();
            $internship = Internship::create(array_merge($internshipData, ['company_id' => $company->id]));
            
            // Randomly attach 1-3 skills
            $internship->skills()->attach($allSkills->random(rand(1, 3))->pluck('id'));
        }
    }
}
