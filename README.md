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
- **Authentication**: NextAuth.js v5 with Supabase provider
- **API Integrations**: Powens (banking data), OpenAI GPT (transaction analysis)
- **Containerization**: Docker

## 📁 Project Structure
The following is the structure of the Unicent project:

```bash
(should update this).. 
unicent/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   └── ...
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── types/
│   └── utils/
├── public/
├── .env
├── .env.local
├── docker-compose.yml
├── Dockerfile
├── next.config.js
├── package.json
└── tsconfig.json
````
## 🔐 Authentication

Authentication is handled using NextAuth.js v5 with the following setup:

- Supabase as the authentication provider
- Custom middleware for route protection
- Prisma adapter for database integration

Key files:
- `src/auth.ts`: Main NextAuth configuration
- `src/middleware.ts`: Custom middleware for route protection

## 🐳 Docker Setup

The project uses Docker for consistent development environments:

- `Dockerfile`: Defines the container for the Next.js application
- `docker-compose.yml`: Orchestrates the app and database services

To start the development environment:

```bash
npm run docker:dev