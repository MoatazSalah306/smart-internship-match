import type { Role } from "./client";

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  created_at?: string;
};

export type Student = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  university?: string | null;
  phone?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  cv_url?: string | null;
  cv_filename?: string | null;
};

export type Company = {
  id: number;
  user_id: number;
  name: string;
  email: string;
  industry?: string | null;
  website?: string | null;
  description?: string | null;
  logo_url?: string | null;
};

export type Internship = {
  id: number;
  company_id: number;
  company?: Pick<Company, "id" | "name" | "industry" | "logo_url">;
  title: string;
  description: string;
  location?: string | null;
  remote?: boolean;
  duration_months?: number | null;
  stipend?: number | null;
  required_skills?: string[] | null;
  starts_at?: string | null;
  deadline?: string | null;
  is_active?: boolean;
  archived_at?: string | null;
  deleted_at?: string | null;
  applications_count?: number;
  match_score?: number;
  has_applied?: boolean;
  created_at?: string;
};

export type Application = {
  id: number;
  internship_id: number;
  student_id: number;
  status: "pending" | "reviewed" | "accepted" | "rejected";
  cover_letter?: string | null;
  match_score?: number;
  internship?: Internship;
  student?: Student;
  created_at?: string;
};

export type AdminStats = {
  total_students: number;
  total_companies: number;
  total_internships: number;
  active_internships: number;
  total_applications: number;
  applications_by_status: Record<string, number>;
  applications_last_30_days: { date: string; count: number }[];
};

export type Paginated<T> = {
  items: T[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
};

export type AuthResponse = {
  token: string;
  user: User;
  profile?: Student | Company | null;
};
