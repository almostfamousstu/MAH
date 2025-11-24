# Getting Started

Welcome to the Micro Automation Hub (MAH). This guide will help you set up the application locally.

## Prerequisites

- Node.js (v18 or later recommended)
- Docker (for the database)
- Git

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/almostfamousstu/MAH.git
   cd MAH
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

## Database Setup

The application uses PostgreSQL managed by Prisma.

1. **Start the database container:**

   ```bash
   docker compose up -d db
   ```

2. **Apply migrations and seed data:**

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

3. **Generate Prisma Client:**

   If you make changes to the schema, regenerate the client:

   ```bash
   npm run db:generate
   ```

## Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

Create a `.env` file in the root directory. You can use `.env.example` as a template.

```bash
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
```
