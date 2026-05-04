import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import PublicLayout from "@/components/layout/PublicLayout";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import InternshipsList from "./pages/internships/InternshipsList";
import InternshipDetail from "./pages/internships/InternshipDetail";
import StudentDashboard from "./pages/student/StudentDashboard";
import StudentProfile from "./pages/student/StudentProfile";
import StudentApplications from "./pages/student/StudentApplications";
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyInternshipForm from "./pages/company/CompanyInternshipForm";
import CompanyApplicants from "./pages/company/CompanyApplicants";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { LayoutDashboard, FileText, ListChecks, Briefcase, BarChart3 } from "lucide-react";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

const studentNav = [
  { to: "/student", label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
  { to: "/student/profile", label: "Profile & CV", icon: <FileText className="h-4 w-4" /> },
  { to: "/student/applications", label: "Applications", icon: <ListChecks className="h-4 w-4" /> },
];

const companyNav = [
  { to: "/company", label: "Internships", icon: <Briefcase className="h-4 w-4" /> },
  { to: "/company/internships/new", label: "New role", icon: <FileText className="h-4 w-4" /> },
];

const adminNav = [
  { to: "/admin", label: "Overview", icon: <BarChart3 className="h-4 w-4" /> },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/internships" element={<InternshipsList />} />
              <Route path="/internships/:id" element={<InternshipDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Student */}
            <Route
              element={
                <ProtectedRoute roles={["student"]}>
                  <DashboardLayout title="Student" scope="student" nav={studentNav} />
                </ProtectedRoute>
              }
            >
              <Route path="/student" element={<StudentDashboard />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/applications" element={<StudentApplications />} />
            </Route>

            {/* Company */}
            <Route
              element={
                <ProtectedRoute roles={["company"]}>
                  <DashboardLayout title="Company" scope="company" nav={companyNav} />
                </ProtectedRoute>
              }
            >
              <Route path="/company" element={<CompanyDashboard />} />
              <Route path="/company/internships/new" element={<CompanyInternshipForm />} />
              <Route path="/company/internships/:id/edit" element={<CompanyInternshipForm />} />
              <Route path="/company/internships/:id/applicants" element={<CompanyApplicants />} />
            </Route>

            {/* Admin */}
            <Route
              element={
                <ProtectedRoute roles={["admin"]}>
                  <DashboardLayout title="Admin" scope="admin" nav={adminNav} />
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
