# Smart Internship Matching Platform - Technical Documentation

## Overview
The Smart Internship Matching Platform is a full-stack web application designed to connect students with internship opportunities. It features a robust Laravel backend and a modern React frontend with a premium design system.

---

## Backend Architecture (Laravel)

### 1. API Versioning
The backend follows RESTful principles with versioned routes under `api/v1`. This ensures backward compatibility and organized API management.

### 2. Multi-Guard Authentication
Implemented using **Laravel Sanctum**. The platform supports three distinct roles:
- **Students**: Can view internships, apply, and manage their profiles.
- **Companies**: Can post internships, manage applications, and view archived listings.
- **Admins**: Have access to global statistics and platform management.

Tokens are scoped based on the user's role to ensure secure access to specific endpoints.

### 3. Role-Based Access Control (RBAC)
RBAC is enforced using **Laravel Policies & Gates**. 
- `InternshipPolicy`: Restricts internship management to the company that created them.
- `ApplicationPolicy`: Ensures companies can only update the status of applications for their own internships.

### 4. Database Schema & Soft Deletes
- **Internships**: Includes soft deletes (`deleted_at`) to allow companies to archive and restore listings.
- **Applications**: Stores the relationship between students and internships, including a `match_score` and status.
- **Skills**: A many-to-many relationship with both students and internships to facilitate matching.

### 5. Match Score Logic
The match score is calculated during the application process:
- **Logic**: `(Number of shared skills between student and internship) / (Total skills required for internship) * 100`.
- This provides an immediate percentage-based compatibility metric for companies.

---

## Frontend Architecture (React)

### 1. Design System
Built with **Vanilla CSS** and **Framer Motion** for a premium, high-performance user experience.
- **Typography**: Outfit (Google Fonts).
- **Aesthetics**: Glassmorphism, smooth gradients, and micro-animations.
- **Responsiveness**: Fully responsive grid system.

### 2. State Management
- **AuthContext**: Manages user authentication state, tokens, and role-based routing.
- **Axios Interceptors**: Automatically attaches Bearer tokens to every outgoing request.

### 3. Key Components
- **Navbar**: Dynamic navigation based on the user's role.
- **Internship Listing**: Feature-rich cards with search functionality.
- **Dashboards**: Role-specific dashboards for Students (Applications), Companies (Management), and Admins (Stats).

---

## Technical Stack
- **Backend**: Laravel 11, Sanctum, Eloquent API Resources.
- **Frontend**: React 19, Vite, Axios, Framer Motion, Lucide React.
- **Database**: MySQL/PostgreSQL (supports both).
- **Styling**: Vanilla CSS with Modern Web Standards.
