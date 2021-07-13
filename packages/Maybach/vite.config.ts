import { resolve } from 'path'
import { defineConfig } from "vite";
import { createVuePlugin } from "vite-plugin-vue2";
export default defineConfig({
	plugins: [createVuePlugin()],
	build: {
		minify: "terser",
	},
	resolve: {
		alias: {
			"@components": resolve(__dirname, '/src/components'),
			"@style": resolve(__dirname, '/src/style')
		}
	}
});
