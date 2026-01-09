import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: ['node_modules', 'dist'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/test/**',
        'src/**/*.d.ts',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.spec.{ts,tsx}',
        // Exclude pages/tools components - covered by E2E tests
        'src/pages/**',
        'src/components/layout/**',
        'src/components/layouts/**',
        'src/components/ui/**',
        'src/components/shared/**',
        'src/components/liquid/**',
        'src/components/ios/**',
        'src/data/**',
        'src/App.tsx',
        'src/types/**',
        'src/hooks/index.ts',
        'src/hooks/useToolTracking.ts',
        // Exclude visual/browser-specific hooks - covered by E2E tests
        'src/hooks/useMousePosition.ts',
        'src/hooks/use3DTilt.ts',
        'src/hooks/useParallax.ts',
        'src/utils/seo.tsx',
        // Exclude visual/animation utilities - configuration only
        'src/utils/motion.ts',
        'src/utils/toolColors.ts',
        'src/utils/iosColors.ts',
      ],
      thresholds: {
        // Thresholds for utils, hooks, store, and lib
        // Pages/tools are excluded and covered by E2E tests
        lines: 80,
        functions: 80,
        branches: 60,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
