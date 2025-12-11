import react from '@vitejs/plugin-react';
import { NodePackageImporter } from 'sass-embedded';
import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  plugins: [react()],
});
