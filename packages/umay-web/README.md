# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

## Server Configuration for Client-Side Routing

For proper client-side routing to work (to fix the 404 errors for direct access to routes like `/demos`), use the appropriate configuration for your hosting provider:

### Netlify

The `_redirects` file in the `public` directory will handle client-side routing on Netlify.

### Vercel

The `vercel.json` file in the project root will handle client-side routing on Vercel.

### Other Hosting Providers

- For Apache servers, a `.htaccess` file should be added.
- For IIS servers, the `web.config` file in the `public` directory will handle routing.

## Sitemap

The sitemap is automatically generated during the build process using the `vite-plugin-sitemap` package. It will create:

1. `sitemap.xml` - Lists all routes of the application for search engines
2. `robots.txt` - Tells search engines how to crawl the site

To submit the sitemap to Google:

1. Go to [Google Search Console](https://search.console.google.com/)
2. Add your site if not already added
3. Navigate to Sitemaps and add `https://www.umayrender.com/sitemap.xml`

Additionally, make sure your `robots.txt` file is properly set up to allow crawling.
