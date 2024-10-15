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

```bash
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
```
## 🔐 Authentication

Authentication is handled using **NextAuth.js v5** with the following setup:

- **Supabase** as the authentication provider
- **Custom middleware** for route protection
- **Prisma adapter** for database integration

### Key files:

- `src/auth.ts`: Main NextAuth configuration
- `src/middleware.ts`: Custom middleware for route protection

## 🐳 Docker Setup

The project uses Docker for consistent development environments:

- `Dockerfile`: Defines the container for the Next.js application
- `docker-compose.yml`: Orchestrates the app and database services

To start the development environment:

```bash
npm run docker:dev
## 🚀 Getting Started

1. Clone the repository.
   
2. Copy `.env.example` to `.env.local` and fill in the required environment variables.
   
3. Run `npm install` to install the dependencies.
   
4. Start the Docker environment:

   ```bash
   npm run docker:dev
````
Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

## 📚 API Documentation

- `/api/auth/*`: NextAuth.js authentication routes
- `/api/powens/connect-bank`: Connect a new bank account
- `/api/powens/fetch-transactions`: Fetch transactions for connected accounts
- `/api/gpt/analyze-transactions`: Analyze transactions using GPT

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for more information on how to get started.

## 📝 License

This project is [MIT licensed](LICENSE).

---

This structure improves readability and makes it easier to follow the instructions for getting started, using the API, contributing, and understanding the licensing.
