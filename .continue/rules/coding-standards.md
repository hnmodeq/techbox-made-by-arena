# Coding Standards

## Language

- All code must use **TypeScript**
- Never use `any`
- Use proper types and interfaces

## Package Manager

Use **pnpm**.

Never assume npm or yarn.

## React

Use modern React patterns:

- Functional components
- React hooks
- Server Components when possible
- Client components only when required

## File Naming

Use PascalCase for components.

Example:

Button.tsx  
Card.tsx  
ContentCard.tsx  

Hooks use camelCase:

useCart.ts

## Imports

Prefer absolute imports from project root.

Example:

import { Button } from "@/components/ui/Button"

## Clean Code Rules

- Avoid large components
- Extract reusable logic
- Keep components focused
- Prefer composition over prop drilling

## Type Safety

Always type:

- props
- API responses
- hooks
- database results

Use shared types from `/types`.
