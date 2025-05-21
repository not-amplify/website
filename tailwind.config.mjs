/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
    theme: {
      extend: {
        colors: {
          rosepine: {
            base: "#232136",
            surface: "#2a273f",
            overlay: "#393552",
            muted: "#6e6a86",
            subtle: "#908caa",
            text: "#e0def4",
            love: "#eb6f92",
            gold: "#f6c177",
            rose: "#ea9a97",
            pine: "#3e8fb0",
            foam: "#9ccfd8",
            iris: "#c4a7e7",
            highlightLow: "#2a283e",
            highlightMed: "#44415a",
            highlightHigh: "#56526e",
          },
        },
        keyframes: {
          'blink-caret': {
            '0%, 100%': { borderColor: 'transparent' },
            '50%': { borderColor: '#00ff00' },
          },
        },
        animation: {
          'blink-caret': 'blink-caret 0.75s step-end infinite',
        },
      },
    },
    plugins: [],
  };
  