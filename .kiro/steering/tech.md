# Technology Stack

## Core Technologies

- **Frontend Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.2 with React plugin
- **Styling**: Tailwind CSS 3.4.1 with PostCSS and Autoprefixer
- **Routing**: React Router DOM 7.9.3
- **Icons**: Lucide React 0.344.0
- **PDF Generation**: jsPDF 3.0.3
- **Backend Services**: Supabase 2.57.4

## Development Tools

- **Linting**: ESLint 9.9.1 with TypeScript ESLint and React plugins
- **Type Checking**: TypeScript 5.5.3 with strict configuration
- **Package Manager**: npm (package-lock.json present)

## Common Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript type checking
```

## Configuration Notes

- Uses ES modules (`"type": "module"` in package.json)
- Vite optimizes dependencies, excludes lucide-react from optimization
- ESLint configured for React hooks and refresh patterns
- Tailwind scans all HTML and React files in src directory