# How to Run Guide

Follow these steps to set up and run the Smart Internship Matching Platform locally.

## Prerequisites
- **PHP** (>= 8.2)
- **Composer**
- **Node.js** (>= 18) & **npm**
- **MySQL** or **PostgreSQL**

---

## 1. Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   composer install
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   ```
   *Edit the `.env` file and set your database credentials:*
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=internship_platform
   DB_USERNAME=root
   DB_PASSWORD=
   ```

4. Generate app key:
   ```bash
   php artisan key:generate
   ```

5. Run migrations & seeders:
   ```bash
   php artisan migrate --seed
   ```

6. Start the backend server:
   ```bash
   php artisan serve
   ```
   *The API will be available at `http://localhost:8000`.*

---

## 2. Frontend Setup (React)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install axios react-router-dom framer-motion lucide-react
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   *The application will be available at `http://localhost:5173`.*

---

## 3. Usage & Testing

- **Public Access**: You can browse internships without logging in.
- **Register**: Create a Student or Company account.
- **Login**: Use your credentials to access the dashboard.
- **Match Score**: Add skills to your profile and apply for internships that require those skills to see your match percentage.
- **Admin**: Login as an admin (seeded user) to view the global dashboard.

---

## Troubleshooting
- **CORS Issues**: Ensure `FRONTEND_URL` in Laravel's `.env` matches your Vite URL (usually `http://localhost:5173`).
- **Database Connection**: Ensure your database service is running before migrating.
- **CV Uploads**: Run `php artisan storage:link` to enable viewing uploaded CVs.
