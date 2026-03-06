# Authentication & Authorization Guide

## Overview

This application implements a role-based access control (RBAC) system with three user roles:

### User Roles

1. **VIEWER** (Read-Only)
   - Can view all programs and their details
   - Can search and filter programs
   - Cannot edit program metadata

2. **EDITOR** (Can Edit)
   - All permissions of VIEWER
   - Can edit program metadata (name, phase, therapeutic area, status, description)
   - Cannot manage user roles or delete programs

3. **ADMIN** (Full Access)
   - All permissions of EDITOR
   - Future: manage users and roles
   - Future: delete programs

## Test Credentials

The database is seeded with three test users:

```
Email: viewer@example.com
Password: password123
Role: VIEWER

Email: editor@example.com
Password: password123
Role: EDITOR

Email: admin@example.com
Password: password123
Role: ADMIN
```

## Features

### Authentication

- **JWT-based authentication** using cookies
- **Secure password hashing** with bcryptjs
- **Session management** with 7-day token expiry
- **Protected routes** with middleware redirection to login

### Authorization

- **Role-based access control** for API endpoints
- **UI-based visibility** - Edit button only shows for EDITOR/ADMIN users
- **API validation** - Edit requests are validated for proper role

## Pages & Routes

### Public Routes
- `/login` - User login page
- `/signup` - User registration page (creates VIEWER by default)

### Protected Routes
- `/dashboard` - List all programs with pagination, search, and sort
  - **VIEWER**: Can view and search only
  - **EDITOR/ADMIN**: Can also edit program metadata via modal form
- `/dashboard/[id]` - Detailed view of a specific program

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/logout` - Logout and clear token
- `GET /api/auth/me` - Get current user info

### Programs
- `GET /api/programs` - List all programs
- `GET /api/programs/[id]` - Get program details
- `PATCH /api/programs/[id]` - **[EDITOR/ADMIN only]** Update program metadata

## Implementation Details

### Files Created/Modified

**Authentication & Authorization**
- `lib/auth.ts` - Password hashing and user authentication functions
- `lib/authUtils.ts` - JWT verification and role checking utilities
- `lib/AuthContext.tsx` - React context for global auth state
- `middleware.ts` - Route protection middleware

**API Routes**
- `app/api/auth/login/route.ts` - Login endpoint
- `app/api/auth/signup/route.ts` - Registration endpoint
- `app/api/auth/logout/route.ts` - Logout endpoint
- `app/api/auth/me/route.ts` - Current user endpoint
- `app/api/programs/[id]/route.ts` - Updated with auth checks

**Pages**
- `app/login/page.tsx` - Login form
- `app/signup/page.tsx` - Registration form
- `app/dashboard/page.tsx` - Main dashboard with edit functionality

**Database**
- `prisma/schema.prisma` - Added User model with Role enum
- `prisma/migrations/*` - Migration for User model
- `prisma/seed.ts` - Updated to seed test users

### Middleware

The middleware (`middleware.ts`) protects the following routes:
- `/dashboard` and all subroutes

Unauthenticated users are redirected to `/login` with a redirect parameter.

## Environment Variables

Set these in your `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/drug_dashboard
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

## Security Notes

1. **JWT_SECRET** - Must be changed in production! Use a strong, random value.
2. **HTTPS** - Ensure HTTPS is used in production (cookies are httpOnly and secure in production)
3. **Password Requirements** - Minimum 6 characters (can be strengthened)
4. **Token Expiry** - JWTs expire after 7 days
5. **Cookie Settings** - httpOnly and sameSite=lax for CSRF protection

## How to Test

1. **Start the application**
   ```bash
   npm run dev
   ```

2. **Login with test credentials**
   - Go to http://localhost:3000/login
   - Use viewer@example.com / password123 (to see view-only mode)
   - Use editor@example.com / password123 (to see edit functionality)

3. **Test Edit Functionality** (EDITOR role)
   - Login with editor@example.com
   - Click "Edit" button on any program row
   - Modify program details in the modal
   - Click "Save Changes" to update

4. **Test Permission Check**
   - Login with viewer@example.com
   - Notice the Edit button is NOT visible
   - Try accessing `/api/programs/[id]` with PATCH request - will get 403 error

## Future Enhancements

- [ ] Admin panel for user management
- [ ] Permission templates for easier role management
- [ ] Audit logging for all edits
- [ ] Email verification for signup
- [ ] Password reset functionality
- [ ] Two-factor authentication
