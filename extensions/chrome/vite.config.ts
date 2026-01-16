import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, rmSync } from 'fs';

// Plugin to copy static files and fix paths after build
function copyStaticFiles() {
  return {
    name: 'copy-static-files',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist');

      // Copy manifest.json
      copyFileSync(
        resolve(__dirname, 'manifest.json'),
        resolve(distDir, 'manifest.json')
      );

      // Ensure icons directory exists
      const iconsDir = resolve(distDir, 'icons');
      if (!existsSync(iconsDir)) {
        mkdirSync(iconsDir, { recursive: true });
      }

      // Copy icons
      ['icon-16.png', 'icon-48.png', 'icon-128.png'].forEach((icon) => {
        copyFileSync(
          resolve(__dirname, 'public/icons', icon),
          resolve(iconsDir, icon)
        );
      });

      // Move HTML from src/popup to popup (Vite puts it in wrong place)
      const srcPopupDir = resolve(distDir, 'src/popup');
      const popupDir = resolve(distDir, 'popup');
      if (existsSync(resolve(srcPopupDir, 'index.html'))) {
        copyFileSync(
          resolve(srcPopupDir, 'index.html'),
          resolve(popupDir, 'index.html')
        );
        // Clean up src folder
        rmSync(resolve(distDir, 'src'), { recursive: true, force: true });
      }

      console.log('Static files copied and paths fixed in dist/');
    },
  };
}

export default defineConfig({
  plugins: [react(), copyStaticFiles()],
  build: {
    outDir: 'dist',
    emptyDirFirst: true,
    rollupOptions: {
      input: {
        'popup/index': resolve(__dirname, 'src/popup/index.html'),
        'background/service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        'content/content-script': resolve(__dirname, 'src/content/content-script.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'popup/chunks/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'popup/[name][extname]';
          }
          return 'popup/[name][extname]';
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@devtools-hub/core': resolve(__dirname, '../core/src/index.ts'),
    },
  },
});
