# Architecture Overview

The Micro Automation Hub is built with a modern web stack designed for performance and scalability.

## Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Containerization:** [Docker](https://www.docker.com/)

## Project Structure

The codebase is organized as follows:

### `app/`
Contains the Next.js App Router pages and API routes.
- `(app)/`: Authenticated workspace routes (automations, insights, etc.).
- `api/`: Backend API endpoints (Next.js Route Handlers).
- `globals.css`: Global styles and Tailwind directives.
- `layout.tsx`: Root layout component.
- `page.tsx`: Public landing page.

### `components/`
Reusable UI components.
- `navigation/`: Sidebar and top navigation components.
- `app-shell.tsx`: The main layout wrapper for the application.
- `*.tsx`: Specific feature components (e.g., `project-card.tsx`, `vote-button.tsx`).

### `lib/`
Utility functions and shared logic.
- `prisma.ts`: Instantiates the global Prisma client.
- `project-types.ts`: TypeScript definitions for project data structures.
- `readme-parser.ts`: Utilities for parsing markdown content.

### `prisma/`
Database configuration.
- `schema.prisma`: The database schema definition.
- `seed.ts`: Script to populate the database with initial data.
- `migrations/`: SQL migration files.

## Key Components

### Database Schema
The data model is defined in `prisma/schema.prisma`. Key models include:
- **Automation:** Represents a micro-automation workflow.
- **InsightKpi / InsightAdoption / InsightIncident:** Stores telemetry data for the Insights dashboard.

### Navigation
The navigation logic is centralized in `components/navigation/sidebar.tsx`. It defines the primary and secondary navigation links used throughout the app.

### Styling
The application uses a custom Tailwind theme defined in `tailwind.config.ts`, featuring a dark, neon-accented aesthetic suitable for a "cyber" or "futuristic" interface.
