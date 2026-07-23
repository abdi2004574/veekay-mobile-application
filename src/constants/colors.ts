// Mirrors tailwind.config.js and figma-demo/src/styles/theme.css so native
// screens (LinearGradient, icon colors) match the same design tokens Tailwind
// classes use.
export const colors = {
  background: '#ffffff',
  foreground: '#0a0a0a',
  mutedForeground: '#717182',
  border: 'rgba(0, 0, 0, 0.08)',
  inputBackground: '#f9f8fa',
  destructive: '#d4183d',
  disabledBackground: '#e4e4e7',
  success: '#16a34a',
  vaykaePink: '#D701A8',
  vaykaePurple: '#7700C6',
} as const;

export const vaykaeGradient = [colors.vaykaePink, colors.vaykaePurple] as const;

export const screenBackgroundGradient = [
  'rgba(255,255,255,0.4)',
  'rgba(141,41,206,0.1)',
  'rgba(216,1,167,0.1)',
] as const;

// Agency screens use a lighter, flatter tint of the same brand gradient.
export const agencyBackgroundGradient = [
  'rgba(215,1,168,0.05)',
  'rgba(119,0,198,0.05)',
] as const;
