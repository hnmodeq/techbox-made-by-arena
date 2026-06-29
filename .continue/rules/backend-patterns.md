# Backend Patterns

Backend logic is implemented using Next.js Route Handlers.

Location:

app/api

## Database

Use Prisma for database access.

Schema location:

prisma/schema.prisma

## Authentication

Auth helpers exist in:

lib/auth.ts  
lib/auth-server.ts

## Data Flow

Frontend → API Route → Prisma → Neon Database

## API Guidelines

- Always validate input
- Return typed responses
- Avoid exposing internal errors

## Payments

Payment gateway used:

Zarinpal

Routes located in:

app/api/pay/zarinpal
