# Frontend Patterns

## RTL Support

This project is Persian-first and uses RTL layout.

All UI should support RTL properly.

Avoid assumptions about LTR layouts.

## Fonts

The project uses Kalameh Persian fonts located in:

public/fonts

## Styling

Use Tailwind CSS utilities.

Design tokens are defined in:

design/tokens

## Design System

Prefer existing UI components instead of creating new ones.

Check:

components/ui

before creating new components.

## Animation

Use framer motion utilities from:

components/animations

Examples:

FadeIn  
SlideIn  
MotionSection

## Performance

Prefer:

- Server components
- Streaming
- Suspense
- Lazy loading
