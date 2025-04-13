import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

function pathResolve(dir: string) {
  return path.resolve(__dirname, '.', dir);
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    test: {
      environment: 'jsdom',
      globals: true,
      setupFiles: './src/setupTests.ts',
    },
    resolve: {
      alias: {
        '@': pathResolve('src'),
        stream: 'stream-browserify',
      },
    },
    server: {
      host: 'localhost',
      port: parseInt(env.PORT),
    },
  };
});
