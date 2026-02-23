# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root of the `frontend/smartnote` directory with the following variables:

- `VITE_API_URL`: The base URL for the backend API (e.g., `https://api.example.com/api`).

Example `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file.
3. Start the development server:
   ```bash
   npm run dev
   ```

