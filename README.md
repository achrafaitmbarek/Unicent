# Unicent 🦄

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=white)
![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

Unicent is a financial management application that integrates bank data analysis with AI-powered insights.

## 🚀 Features

- User authentication with NextAuth v5
- Bank account integration using Powens API
- Transaction analysis with GPT API
- Responsive dashboard for financial overview
- Docker-based development environment

## 🛠️ Tech Stack

- **Frontend**: Next.js 13+ with App Router
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with Prisma provider
- **API Integrations**: Powens (banking data), OpenAI GPT (transaction analysis)
- **Containerization**: Docker (Local development)
  
## 🎨 Design

You can view the wireframes and design on Figma [here](https://www.figma.com/design/t3U6biDnxSgbhiWyM1NzZi/PFE-WIREFRAMES%2FDESIGN?node-id=0-1&t=m0IwU8JKGkDuLG3v-1).

## 🌐 Online Demo

Or simply if you want to test the app online, go to this link: [https://unicent.vercel.app/dashboard](https://unicent.vercel.app/dashboard)



## 📁 Project Structure(in progress)

```bash
unicent/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/               # API routes
│   │   ├── auth/              # Authentication module
│   │   ├── dashboard/         # Dashboard interface and components
│   │   ├── fonts/             # Custom font assets
│   │   ├── favicon.ico        # Favicon file
│   │   ├── globals.css        # Global CSS styles
│   │   ├── layout.tsx         # Layout component
│   │   └── page.tsx           # Main page component
│   ├── assets/                # Static assets like images, icons, etc.
│   ├── components/            # Reusable UI components
│   ├── data/                  # Mock data or static data files
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility libraries or helpers
│   ├── schemas/               # Data schemas, validations
│   ├── services/              # External services, API calls, etc.
│   ├── types/                 # TypeScript types and interfaces
│   └── utils/                 # General utility functions
├── public/                    # Public assets accessible in build
├── .env                       # Environment variables
├── .env.local                 # Local environment variables``
├── .env.example               # Example environment variables
├── docker-compose.yml         # Docker Compose configuration
├── Dockerfile                 # Dockerfile for containerizing the app
├── next.config.js             # Next.js configuration
├── package.json               # Project dependencies and scripts
├── postcss.config.js          # PostCSS configuration for styling
├── README.md                  # Project README
├── tailwind.config.js         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```
## 🔐 Authentication

Authentication is handled using **NextAuth.js v5** with the following setup:

- **Prisma** as the authentication provider
- **Custom middleware** for route protection
- **Prisma adapter** for database integration

### Key files:

- `src/auth.ts`: Main NextAuth configuration
- `src/middleware.ts`: Custom middleware for route protection

## 🐳 Docker Setup

The project uses Docker for consistent development environments:

- `Dockerfile`: Defines the container for the Next.js application
- `docker-compose.yml`: Orchestrates the app, database, and Adminer services

### Services:

1. **PostgreSQL Database**:
   - Image: `postgres:13`
   - Exposed port: 5432
   - Configurable via environment variables

2. **Adminer**:
   - Web-based database management tool
   - Accessible at `http://localhost:8080`
   - Uses custom theme: pepa-linha

3. **Next.js Application**:
   - Custom build from `Dockerfile`
   - Exposed ports: 3000 (Next.js app) and 5555 (Prisma Studio)

### Environment Variables:

Create a `.env` file in the project root with the following variables:

```bash 
#.env:example:

# Copy this file to .env and fill in the values for your environment.
POSTGRES_PASSWORD=unicentpassword
POSTGRES_DB=unicent
POSTGRES_SCHEMA=public
POSTGRES_PORT=5432
POSTGRES_USER=unicent

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}?schema=${POSTGRES_SCHEMA}"




AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=
AUTH_SECRET= # Generate it using `npx auth`. Read more: https://cli.authjs.dev

AUTH_RESEND_FROM=
REDIS_URL="redis://localhost:6379" # or your Redis provider URL (e.g., Upstash, Redis Labs) for caching
powens_client_id= # Your Powens client ID or any other banking client ID data provider
powens_client_secret= # Your Powens client secret or any other banking client secret data provider


````

### Starting the Development Environment:

1. Ensure Docker and Docker Compose are installed on your system.

2. Build and start the containers:
   ```bash
   docker-compose up --build
### Access the services:

- Next.js app: `http://localhost:3000`
- Prisma Studio: `http://localhost:5555`
- Adminer: `http://localhost:8080`

### To stop the containers:

```bash
docker-compose down
```
### Database Management with Adminer:

1. Open `http://localhost:8080` in your browser
2. Log in with the following details:
   - System: PostgreSQL
   - Server: db
   - Username: [POSTGRES_USER from .env]
   - Password: [POSTGRES_PASSWORD from .env]
   - Database: [POSTGRES_DB from .env]

### Notes:

- The PostgreSQL data is persisted in a named volume `postgres_data`
- The application code is mounted as a volume, allowing for live reloading during development
- Prisma Studio is available for direct database manipulation and visualization

This setup provides a complete development environment with database, admin tools, and the Next.js application, all containerized for consistency across different development machines.
```bash
You can now use this section for your documentation as needed.

