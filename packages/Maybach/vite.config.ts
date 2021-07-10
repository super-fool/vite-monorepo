import { defineConfig } from 'vite'
// import vue from '@vitejs/plugin-vue'
import { createVuePlugin } from "vite-plugin-vue2";
// import { test } from "../../config";

// test();
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // vue(),
    createVuePlugin()
  ],
  build: {
    minify: 'terser',
  }
})
