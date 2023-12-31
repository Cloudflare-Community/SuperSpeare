import type { Config } from "tailwindcss";
export default <Config>{
	content: ["./src/**/*.{html,js,svelte,ts}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Caveat", "sans-serif"]
			}
		},
	},
	plugins: [],
};