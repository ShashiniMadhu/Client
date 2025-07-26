
# React + Vite + Tailwind CSS


This project is set up with React, Vite, and Tailwind CSS. Tailwind is fully configured and ready to use. You can start using Tailwind utility classes in your React components right away.

## Tailwind CSS Setup

- Tailwind CSS, PostCSS, and Autoprefixer are installed as dev dependencies.
- `tailwind.config.js` and `postcss.config.js` are configured for Vite + React.
- Tailwind directives are included at the top of `src/index.css`.

To start the development server:

```bash
npm run dev
```

You can now build modern UIs with Tailwind CSS and React!

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
