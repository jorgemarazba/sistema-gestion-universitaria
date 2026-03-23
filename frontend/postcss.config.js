// Tailwind v4 se integra con Vite vía @tailwindcss/vite (vite.config.ts).
// No uses `tailwindcss` aquí como plugin de PostCSS (en v4 cambió a @tailwindcss/postcss).
export default {
  plugins: {
    autoprefixer: {},
  },
}
