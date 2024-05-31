import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, path.join(process.cwd(), '..'), ''); // env file

  return {
    plugins: [react()],
    define: {
      'global': 'globalThis',
      'process.env': env,
    },
    server: {
      hmr: {
        host: 'localhost',
        port: env['FRONTEND_PORT'],
      },
      port: env['FRONTEND_PORT'],
      proxy: {
        '/api': {
          target: `${env['BACKEND_HOST']}:${env['BACKEND_PORT']}`,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },
  };
});
