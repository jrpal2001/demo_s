import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from '@svgr/rollup';
import { readFile } from 'fs/promises';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },

  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
      plugins: [
        {
          name: 'load-js-files-as-jsx',
          setup(build) {
            build.onLoad({ filter: /src\\.*\.js$/ }, async (args) => ({
              loader: 'jsx',
              contents: await readFile(args.path, 'utf8'),
            }));
          },
        },
      ],
    },
  },
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:4000', //local url
        // target: 'http://', // server url
        changeOrigin: true,
      },
    },
  },
  plugins: [svgr(), react(), tailwindcss()],
});
