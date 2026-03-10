# Drug Development Dashboard - Architecture & System Design

## Overview

The Drug Development Dashboard is a web application built with Next.js that provides a user interface for managing and visualizing drug development programs. It allows users to view a list of programs on a dashboard and drill down into individual program details, including associated studies and milestones.

The application follows a modern full-stack architecture using TypeScript, with a clear separation of concerns between frontend, backend, and data layers.

## System Architecture

### High-Level Architecture
![Architecture Diagram](./architecture-diagram.svg)

### Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS
- **Development Tools**: ESLint, TypeScript, Prisma CLI

## Application Structure

### Directory Structure
![Architecture Diagram](./architecture-layer-diagram.png)
```
drug-dashboard/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── programs/             # Programs API
│   │   │   ├── route.ts          # GET /api/programs
│   │   │   └── [id]/
│   │   │       └── route.ts      # GET/PATCH /api/programs/[id]
│   ├── dashboard/                # Dashboard pages
│   │   ├── page.tsx              # Programs list
│   │   └── [id]/
│   │       └── page.tsx          # Program details
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── lib/
│       └── prisma.ts             # Prisma client singleton
├── prisma/                       # Database configuration
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Database seeding
│   └── migrations/               # Database migrations
├── repositories/                 # Data access layer
│   ├── ProgramRepository.ts      # Program data operations
│   └── StudyRepository.ts        # Study data operations (placeholder)
├── services/                     # Business logic layer
│   ├── ProgramService.ts         # Program business logic
│   ├── StudyService.ts           # Study business logic (placeholder)
│   └── MilestoreService.ts       # Milestone service (placeholder)
├── scripts/                      # Utility scripts
│   ├── generateSyntheticData.ts  # Data generation
│   └── seed.ts                   # Seeding script
├── docs/                         # Documentation
├── public/                       # Static assets
└── package.json                  # Dependencies and scripts
```

## Data Model

### Entity Relationship Diagram
![Entity Relationship Diagram](./er-diagram.png)

### Database Schema

The application uses Prisma as the ORM with PostgreSQL. The schema defines three main entities:

- **Program**: Represents a drug development program
- **Study**: Clinical studies associated with a program
- **Milestone**: Key milestones in the program's lifecycle

Relationships:
- A Program can have multiple Studies
- A Program can have multiple Milestones
- Studies and Milestones are cascade deleted when their parent Program is deleted

## API Design

### RESTful API Endpoints

#### Programs List
- **Endpoint**: `GET /api/programs`
- **Query Parameters**:
  - `phase` (optional): Filter by program phase
  - `area` (optional): Filter by therapeutic area
  - `page` (optional): Pagination page number
  - `limit` (optional): Items per page (default: 20)
- **Response**: Array of Program objects with included studies

#### Program Details
- **Endpoint**: `GET /api/programs/[id]`
- **Parameters**: `id` (UUID) - Program ID
- **Response**: Single Program object with included studies and milestones

#### Update Program
- **Endpoint**: `PATCH /api/programs/[id]`
- **Parameters**: `id` (UUID) - Program ID
- **Body**: Partial Program object for updates
- **Response**: Updated Program object

### API Response Format

```json
{
  "id": "uuid",
  "name": "Program Name",
  "therapeuticArea": "Cardiology",
  "phase": "Phase I",
  "status": "Active",
  "description": "Program description",
  "studies": [
    {
      "id": "uuid",
      "name": "Study Name",
      "phase": "Phase I",
      "targetEnrollment": 100,
      "currentEnrollment": 50
    }
  ],
  "milestones": [
    {
      "id": "uuid",
      "title": "Milestone Title",
      "status": "Completed",
      "targetDate": "2026-12-31T00:00:00.000Z",
      "completedDate": "2026-03-01T00:00:00.000Z"
    }
  ]
}
```

## Frontend Architecture

### Component Structure

#### Dashboard Page (`/dashboard`)
- **Purpose**: Display list of all programs
- **Features**:
  - Table view with program information
  - Clickable program names linking to detail pages
  - Responsive design with Tailwind CSS
  - Loading states and error handling

#### Program Detail Page (`/dashboard/[id]`)
- **Purpose**: Display detailed information for a single program
- **Features**:
  - Program overview with key details
  - Tables for studies and milestones
  - Navigation back to dashboard
  - Responsive card-based layout

### State Management

- **Client-side State**: React `useState` hooks for local component state
- **Data Fetching**: Native `fetch` API with async/await
- **Error Handling**: Try/catch blocks with user-friendly error messages

### Styling

- **Framework**: Tailwind CSS
- **Design System**:
  - Light gray background (`bg-gray-50`)
  - White cards with shadows (`bg-white shadow-md`)
  - Consistent spacing and typography
  - Hover effects and transitions
  - Responsive grid layouts

## Backend Architecture

### API Routes

Built using Next.js API routes with the following patterns:

- **Route Handlers**: Async functions handling HTTP requests
- **Parameter Extraction**: Dynamic route parameters with proper awaiting
- **Error Handling**: Try/catch with logging and structured error responses
- **Response Formatting**: JSON responses with appropriate HTTP status codes

### Service Layer

The service layer provides business logic abstraction:

- **ProgramService**: Handles program-related operations
  - `listPrograms(filters)`: Retrieve filtered programs
  - `getProgramDetails(id)`: Get program with relations
  - `updateProgramMetadata(id, data)`: Update program data

### Repository Layer

Data access layer using Prisma ORM:

- **ProgramRepository**: Database operations for programs
  - `getPrograms(filters)`: Query programs with optional filters
  - `getProgramById(id)`: Fetch program with studies and milestones
  - `updateProgram(id, data)`: Update program record

### Database Connection

- **Prisma Client**: Singleton instance managed in `app/lib/prisma.ts`
- **Connection Pooling**: Uses `pg` library with connection string from environment
- **Environment Configuration**: `DATABASE_URL` in `.env` file

## Data Flow

### Program List Flow

1. User visits `/dashboard`
2. Component calls `fetch("/api/programs")`
3. API route calls `ProgramService.listPrograms()`
4. Service calls `ProgramRepository.getPrograms()`
5. Repository queries database via Prisma
6. Data flows back through layers to component
7. Component renders program table

### Program Detail Flow

1. User clicks program link or visits `/dashboard/[id]`
2. Component extracts ID from URL params
3. Calls `fetch("/api/programs/${id}")`
4. API route calls `ProgramService.getProgramDetails(id)`
5. Service calls `ProgramRepository.getProgramById(id)`
6. Repository queries database with relations
7. Data returned and displayed in detail view

## Security Considerations

### Input Validation
- TypeScript provides compile-time type checking
- Prisma validates data against schema constraints
- API routes should implement additional runtime validation

### Environment Variables
- Database credentials stored in `.env`
- Sensitive data not committed to version control
- Environment-specific configuration

### Error Handling
- Database errors logged but not exposed to client
- User-friendly error messages
- Graceful degradation for failed requests

## Performance Considerations

### Database Optimization
- Prisma generates optimized SQL queries
- Connection pooling with `pg` library
- Indexes on frequently queried fields (ID, foreign keys)

### Frontend Optimization
- Next.js automatic code splitting
- Client-side caching with React state
- Responsive images and lazy loading where applicable

### API Optimization
- Pagination for large datasets
- Selective field inclusion with Prisma `include`
- Efficient database queries with proper joins

## Deployment & DevOps

### Development Environment
- Local PostgreSQL via Docker Compose
- Hot reload with Next.js dev server
- TypeScript compilation and linting

### Production Deployment
- Build with `npm run build`
- Static generation where possible
- Environment variable configuration
- Database migration on deployment

### Monitoring & Logging
- Console logging for API errors
- Database query monitoring via Prisma
- Client-side error tracking (to be implemented)

## Future Enhancements

### Planned Features
- User authentication and authorization
- Advanced filtering and search
- Data visualization charts
- Real-time updates with WebSockets
- API rate limiting and caching

### Architecture Improvements
- GraphQL API for flexible queries
- Redis caching layer
- Microservices separation
- Comprehensive testing suite

## Conclusion

The Drug Development Dashboard demonstrates a well-structured full-stack application with clear separation of concerns, modern technologies, and scalable architecture. The layered approach (Frontend → API → Service → Repository → Database) ensures maintainability and testability while providing a solid foundation for future enhancements.