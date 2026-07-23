/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  // The app is locked to light mode for now ("userInterfaceStyle": "light"
  // in app.json) — 'class' avoids a react-native-css-interop web crash that
  // 'media' mode triggers when anything calls the manual color-scheme setter.
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Mirrors figma-demo/src/styles/theme.css so the native app reuses
        // the same design language as the web prototype.
        background: '#ffffff',
        foreground: '#0a0a0a',
        card: '#ffffff',
        'card-foreground': '#0a0a0a',
        primary: '#030213',
        'primary-foreground': '#ffffff',
        secondary: '#f1f0f4',
        'secondary-foreground': '#030213',
        muted: '#f5f3f7',
        'muted-foreground': '#717182',
        accent: '#e9ebef',
        'accent-foreground': '#030213',
        destructive: '#d4183d',
        'destructive-foreground': '#ffffff',
        border: 'rgba(0, 0, 0, 0.08)',
        'input-background': '#f9f8fa',
        ring: '#b5b5b5',
        vaykae: {
          pink: '#D701A8',
          purple: '#7700C6',
        },
      },
    },
  },
  plugins: [],
};
