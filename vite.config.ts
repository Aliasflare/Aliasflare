import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from "@cloudflare/vite-plugin"
import Icons from 'unplugin-icons/vite'

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		tailwindcss(),
		Icons({ scale: 1.3, compiler: "vue3" }),
		vue(),
		vueDevTools(),
		cloudflare()
	],
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url))
		},
	},
})
