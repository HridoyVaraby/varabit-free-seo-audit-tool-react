# Varabit SEO Audit Tool

## Project Overview

This is a web-based SEO audit tool built with React, Vite, TypeScript, and Tailwind CSS. The tool allows users to enter a URL and receive a basic SEO audit report. The report includes information about page speed, meta tags, headings, image alt attributes, mobile-friendliness, and keyword density.

The project is structured as a standard Vite-based React application. The main application logic is in the `src/pages/Home.tsx` file. The SEO audit functionality is broken down into several modules in the `src/modules` directory.

The application has the following key dependencies:

-   **React**: For building the user interface.
-   **Vite**: As the build tool and development server.
-   **TypeScript**: For static typing.
-   **Tailwind CSS**: For styling.
-   **react-router-dom**: For routing.
-   **jspdf**: For generating PDF reports.
-   **@supabase/supabase-js**: Likely for future integration with a Supabase backend (not currently used in the core audit functionality).

## Building and Running

To get the project up and running, you'll need to have Node.js and npm installed.

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run the development server:**

    ```bash
    npm run dev
    ```

    This will start the Vite development server and you can view the application at `http://localhost:5173`.

3.  **Build for production:**

    ```bash
    npm run build
    ```

    This will create a `dist` directory with the production-ready files.

4.  **Linting and Type Checking:**

    The project uses ESLint for linting and TypeScript for type checking.

    -   To run the linter:
        ```bash
        npm run lint
        ```
    -   To run the type checker:
        ```bash
        npm run typecheck
        ```

## Development Conventions

-   **Styling**: The project uses Tailwind CSS for all styling.
-   **Component Structure**: Components are located in the `src/components` directory.
-   **Pages**: The main pages of the application are in the `src/pages` directory.
-   **Modules**: The core SEO audit logic is organized into modules in the `src/modules` directory. Each module is responsible for a specific aspect of the audit.
-   **Utilities**: Utility functions are located in the `src/utils` directory.
-   **Typing**: The project uses TypeScript. All new code should be typed.
-   **Linting**: The project uses ESLint. All code should adhere to the linting rules.
