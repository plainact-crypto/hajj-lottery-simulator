import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

const stripRemoteFonts = {
  name: 'strip-remote-fonts',
  enforce: 'pre' as const,
  transform(code: string, id: string) {
    if (!id.endsWith('/src/styles/main.css') && !id.endsWith('\\src\\styles\\main.css')) return null;

    const optimized = code
      .replace(/^@import[^\n]*\n\s*/m, '')
      .replace(/'Noto Kufi Arabic',\s*/g, '')
      .replace(/'Noto Naskh Arabic',\s*serif/g, "Tahoma, Arial, sans-serif");

    return { code: optimized, map: null };
  },
};

export default defineConfig({
  plugins: [stripRemoteFonts, react()],
  test: {
    environment: 'jsdom',
  },
});
