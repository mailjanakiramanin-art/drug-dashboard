# Drug Development Dashboard

A modern web application for managing and visualizing drug development programs, built with Next.js, Prisma, and PostgreSQL. Features a dashboard to view programs and detailed pages for individual programs including studies and milestones.

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**
- **PostgreSQL** database (local installation or Docker)
- **Docker** (optional, for running PostgreSQL in a container)

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd drug-dashboard
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Database Setup

You need a PostgreSQL database running. You can use Docker Compose (recommended) or a local PostgreSQL installation.

### Option 1: Using Docker Compose (Recommended)

1. **Start PostgreSQL with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   This starts a PostgreSQL container on port 5432.

2. **Update the `.env` file** to match the Docker Compose credentials:
   ```env
   DATABASE_URL="postgresql://postgres:mypassword@localhost:5432/mydatabase"
   ```
   (The default `.env` has different credentials; update it to match the Docker setup.)

### Option 2: Using Local PostgreSQL

If you have PostgreSQL installed locally, ensure it's running and create a database. The current `.env` expects:
- User: `admin`
- Password: `admin`
- Database: `drug_dashboard`
- Host: `localhost:5432`

If your setup differs, update the `DATABASE_URL` in `.env` accordingly.

## Prisma Setup

1. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```
   This applies the schema to your database.

2. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```
   This generates the Prisma client based on your schema.

## Seeding the Database

1. **Run the seed script to populate initial data:**
   ```bash
   npm run prisma:seed
   ```
   or
   ```bash
   npx prisma db seed
   ```

## Generating Synthetic Data (Optional)

To generate additional synthetic data for testing:

```bash
npx tsx scripts/generateSyntheticData.ts
```

This script creates more sample programs, studies, and milestones.

## Running the Project

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000).

3. **Access the dashboard** at `/dashboard` to view the list of programs.

4. **Click on a program name** to view its details, including studies and milestones.

## Project Structure

- `app/` - Next.js app directory with pages and API routes
- `prisma/` - Database schema and migrations
- `repositories/` - Data access layer
- `services/` - Business logic layer
- `scripts/` - Utility scripts for seeding and data generation

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

## Technologies Used

- **Next.js** - React framework
- **Prisma** - ORM and database toolkit
- **PostgreSQL** - Database
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety

## Troubleshooting

- **Database connection issues:** Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` is correct.
- **Prisma errors:** Run `npx prisma generate` after schema changes.
- **Port conflicts:** If port 3000 is in use, Next.js will prompt for an alternative port.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.
