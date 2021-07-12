import { createVuePlugin } from "vite-plugin-vue2";
/**
 * Build configuration for the application
 */
export default {
	plugins: [createVuePlugin()],
	build: {
		minify: "eslint",
	}
};
