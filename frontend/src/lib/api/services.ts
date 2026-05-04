import { api, type Role } from "./client";
import type {
  AdminStats,
  Application,
  AuthResponse,
  Company,
  Internship,
  Paginated,
  Student,
  User,
} from "./types";

/** Auth — multi-guard endpoints. Backend issues Sanctum tokens with scopes. */
export const AuthApi = {
  login: (role: Role, payload: { email: string; password: string }) =>
    api.post<AuthResponse>(`/auth/${role}/login`, payload),

  registerStudent: (payload: { name: string; email: string; password: string; password_confirmation: string }) =>
    api.post<AuthResponse>("/auth/student/register", payload),

  registerCompany: (payload: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    industry?: string;
    website?: string;
  }) => api.post<AuthResponse>("/auth/company/register", payload),

  me: () => api.get<{ user: User; profile?: Student | Company | null }>("/auth/me"),
  logout: () => api.post<{ ok: boolean }>("/auth/logout"),
};

/** Internships — public listing + company-scoped CRUD with soft delete & archive. */
export const InternshipsApi = {
  list: (query?: {
    search?: string;
    location?: string;
    remote?: boolean;
    skill?: string;
    page?: number;
  }) => api.get<Paginated<Internship>>("/internships", query),

  show: (id: number | string) => api.get<Internship>(`/internships/${id}`),

  // Company scope
  myList: (query?: { archived?: boolean; page?: number }) =>
    api.get<Paginated<Internship>>("/company/internships", query),
  myArchived: () => api.get<Paginated<Internship>>("/company/internships", { archived: true }),

  create: (payload: Partial<Internship>) => api.post<Internship>("/company/internships", payload),
  update: (id: number, payload: Partial<Internship>) =>
    api.put<Internship>(`/company/internships/${id}`, payload),
  remove: (id: number) => api.del<{ ok: boolean }>(`/company/internships/${id}`),
  archive: (id: number) => api.post<Internship>(`/company/internships/${id}/archive`),
  restore: (id: number) => api.post<Internship>(`/company/internships/${id}/restore`),

  applicants: (id: number) => api.get<Application[]>(`/company/internships/${id}/applications`),
};

/** Applications — student + company actions. */
export const ApplicationsApi = {
  apply: (internshipId: number, payload: { cover_letter?: string }) =>
    api.post<Application>(`/internships/${internshipId}/apply`, payload),

  myApplications: () => api.get<Application[]>("/student/applications"),
  withdraw: (id: number) => api.del<{ ok: boolean }>(`/student/applications/${id}`),

  updateStatus: (id: number, status: Application["status"]) =>
    api.patch<Application>(`/company/applications/${id}`, { status }),
};

/** Student profile — including CV upload (multipart). */
export const StudentApi = {
  getProfile: () => api.get<Student>("/student/profile"),
  updateProfile: (payload: Partial<Student>) => api.put<Student>("/student/profile", payload),
  uploadCv: (file: File) => {
    const fd = new FormData();
    fd.append("cv", file);
    return api.upload<Student>("/student/profile/cv", fd);
  },
  deleteCv: () => api.del<Student>("/student/profile/cv"),
};

/** Company profile. */
export const CompanyApi = {
  getProfile: () => api.get<Company>("/company/profile"),
  updateProfile: (payload: Partial<Company>) => api.put<Company>("/company/profile", payload),
};

/** Admin — aggregated stats & moderation. */
export const AdminApi = {
  stats: () => api.get<AdminStats>("/admin/stats"),
  students: (query?: { search?: string; page?: number }) =>
    api.get<Paginated<Student>>("/admin/students", query),
  companies: (query?: { search?: string; page?: number }) =>
    api.get<Paginated<Company>>("/admin/companies", query),
  internships: (query?: { search?: string; page?: number }) =>
    api.get<Paginated<Internship>>("/admin/internships", query),
};
