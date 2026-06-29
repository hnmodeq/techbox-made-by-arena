# Feature Development Guidelines

This project follows a **feature-based architecture**.
All domain-specific functionality must be organized inside the `features` directory.

The goal is to keep domain logic isolated, reusable, and easy to maintain.

---

# Feature Directory Structure

Every feature should follow this structure when applicable:

features/<feature-name>/

Example:

features/blog  
features/forum  
features/news  
features/tools  

Inside each feature:

features/<feature-name>/
- components/
- hooks/
- actions/
- utils/
- types.ts

Not all folders are required. Only create what is needed.

---

# Components

Feature-specific UI must live inside:

features/<feature-name>/components

Examples from the project:

features/blog/components/BlogGrid.tsx  
features/news/components/NewsList.tsx  
features/tools/components/RaidCalculator.tsx  

Guidelines:

- Components should be small and composable
- Avoid putting global UI components here
- If a component becomes reusable across features, move it to:

components/ui

---

# Hooks

Feature-specific hooks go inside:

features/<feature-name>/hooks

Example:

features/shop/hooks/useCart.tsx

Guidelines:

- Hooks must start with `use`
- Hooks must be typed
- Hooks should encapsulate business logic

---

# Server Actions

Server actions related to a feature should live in:

features/<feature-name>/actions

Example:

features/comment/actions/comments.ts

These may interact with:

- Prisma
- API routes
- external services

---

# Types

Feature-specific types should be defined locally.

Option 1:

features/<feature>/types.ts

Option 2:

types/<feature>.ts

Global shared types should always go to:

types/

---

# Data Flow

Typical feature data flow:

UI Component  
↓  
Feature Hook  
↓  
Server Action / API  
↓  
Prisma  
↓  
Database (Neon)

Agent should follow this pattern when generating new functionality.

---

# When To Create A New Feature

Create a new feature when:

- The functionality represents a domain module
- It contains multiple components
- It has its own business logic
- It interacts with data or APIs

Examples:

blog  
news  
forum  
shop  
tools  

---

# When NOT To Create A Feature

Do NOT create a feature when the code is:

- a reusable UI component
- layout structure
- global utility
- shared design primitive

Instead place them in:

components/ui  
components/layout  
lib  
design  

---

# Naming Conventions

Feature names must be lowercase.

Examples:

blog  
forum  
news  
media  
tools  

Components must use PascalCase.

Example:

BlogGrid.tsx  
ForumList.tsx  
MediaGallery.tsx  

Hooks must use camelCase.

Example:

useCart.ts  
useComments.ts  

---

# Integration With Next.js App Router

Pages are defined in:

app/<route>

Features provide UI logic that pages consume.

Example:

app/blog/page.tsx  
→ imports components from:

features/blog/components

Example pattern:

page.tsx → Feature UI → Hooks → Actions → Prisma

---

# Code Generation Rules For Agents

When generating new code:

1. Identify the domain feature
2. Place domain UI inside `features/<feature>/components`
3. Place business logic in hooks or actions
4. Use existing UI components from `components/ui`
5. Keep pages in `app/` minimal
6. Never place large logic directly inside page.tsx

---

# Reusability Rule

Before creating new components, check:

components/ui  
components/layout  

If the component can be reused across features, place it there instead of inside a feature.

---

# Maintainability Principles

Follow these principles:

- separation of concerns
- composable UI
- strict typing
- minimal page logic
- domain isolation

Agent must always respect this architecture when suggesting code.
