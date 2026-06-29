# Project Architecture

Project name: TechBox

This project is a Next.js 16 application using the App Router.

The architecture follows a **feature-based structure** where domain logic is grouped by feature rather than technical layer.

## Core Directories

### app/

Next.js App Router pages and API routes.

Examples:

- /app/blog
- /app/news
- /app/forum
- /app/tools
- /app/download
- /app/review
- /app/media
- /app/shop

Dynamic routes use `[slug]`.

Example:

/app/blog/[slug]/page.tsx

### app/api

Server endpoints implemented with Next.js Route Handlers.

Examples:

- auth
- comments
- like
- posts
- payment (zarinpal)

### components/

Reusable UI and layout components.

Structure:

components/ui → reusable design system components  
components/layout → layout primitives  
components/animations → framer motion utilities

### features/

Feature-based modules.

Each feature contains its own components and logic.

Examples:

features/blog  
features/comment  
features/chat  
features/forum  
features/media  
features/shop  
features/tools  

### design/

Design system tokens and foundations.

Contains:

- typography
- colors
- motion
- shadows
- radius
- blur
- interaction presets

### lib/

Core utilities and services.

Examples:

- auth
- database access
- content helpers
- modules config

### providers/

React context providers.

Examples:

- auth provider
- cart provider
- theme provider
- query provider

### stores/

Global state stores.

### types/

Centralized TypeScript types.

### prisma/

Database schema and seed.

Uses Prisma ORM with Neon database.

---

## Feature-Based Development Rules

When adding new functionality:

1. If it belongs to a domain → create inside `features/<domain>`
2. Shared UI → `components/ui`
3. Layout logic → `components/layout`
4. Server logic → `app/api`
5. Types → `types/`
6. Utilities → `lib/`

Agent should always follow this structure when generating code.
