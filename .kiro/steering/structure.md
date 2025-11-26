# Project Structure

## Directory Organization

```
src/
├── components/          # Reusable UI components
│   ├── AuditCard.tsx   # Display audit results
│   ├── AuditForm.tsx   # URL input form
│   └── PdfDownloadButton.tsx # PDF export functionality
├── modules/            # SEO analysis modules
│   ├── types.ts        # Shared TypeScript interfaces
│   ├── pageSpeed.ts    # Page speed analysis
│   ├── metaTags.ts     # Meta tag validation
│   ├── headings.ts     # Heading structure analysis
│   ├── imageAlt.ts     # Image alt text validation
│   ├── mobileFriendly.ts # Mobile responsiveness check
│   └── keywordDensity.ts # Keyword density analysis
├── pages/              # Route components
│   └── Home.tsx        # Main application page
├── utils/              # Utility functions
│   ├── fetchHtml.ts    # HTML fetching logic
│   └── parseDom.ts     # DOM parsing utilities
├── App.tsx             # Root component with routing
├── main.tsx            # Application entry point
├── index.css           # Global styles (Tailwind imports)
└── vite-env.d.ts       # Vite type definitions
```

## Architecture Patterns

- **Single Page Application**: Uses React Router for client-side routing
- **Modular Analysis**: Each SEO check is isolated in its own module
- **Component-Based UI**: Reusable components for form, cards, and actions
- **Utility Layer**: Separate utilities for DOM operations and HTTP requests
- **Type Safety**: Centralized type definitions in modules/types.ts

## Naming Conventions

- **Components**: PascalCase with descriptive names (e.g., `AuditCard.tsx`)
- **Modules**: camelCase with feature-based naming (e.g., `pageSpeed.ts`)
- **Utilities**: camelCase with action-based naming (e.g., `fetchHtml.ts`)
- **Types**: Interfaces use PascalCase (e.g., `AuditResult`)

## File Organization Rules

- Components are self-contained with props interfaces
- Modules export analysis functions that return `AuditResult` objects
- Utils provide pure functions for data processing
- All TypeScript files use explicit extensions in imports