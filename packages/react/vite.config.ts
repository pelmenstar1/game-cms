import { defineConfig } from "vite";

const exports = ['react', 'react-dom', 'react-jsx-runtime'];

export default defineConfig({
  build: {
    manifest: true,
    minify: 'esbuild',
    outDir: './dist/src',
    lib: {
      formats: ['es'],
      entry: Object.fromEntries(exports.map((name) => [`re-${name}`, `./src/re-${name}.ts`]))
    },
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process': 'undefined',
  }
});
