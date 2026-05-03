import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import { createHtmlPlugin } from 'vite-plugin-html'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

export default defineConfig(({ mode }) => {
	dotenv.config({ path: `./.env.${mode}` })
	let dossier = '/'
	if (process.env.VITE_FOLDER) {
		dossier = process.env.VITE_FOLDER
	}
	return {
		base: dossier,
		plugins: [
			vue(),
			viteStaticCopy({
				targets: [
					{
						src: path.resolve(__dirname, 'README.md'),
						dest: './',
					},
					{
						src: path.resolve(__dirname, 'LICENSE'),
						dest: './',
					},
					{
						src: path.resolve(__dirname, '.htaccess'),
						dest: './',
					},
					{
						src: path.resolve(__dirname, 'inc') + '/!(*.db)',
						dest: './inc',
					},
					{
						src: path.resolve(__dirname, 'fichiers'),
						dest: './',
					},
					{
						src: path.resolve(__dirname, 'libraries'),
						dest: './',
					},
					{
						src: path.resolve(__dirname, '.env.production'),
						dest: './',
						rename: '.env'
					}
				]
			}),
			createHtmlPlugin({
				minify: true,
				inject: {
					data: {
						dossier: dossier
					}
				}
			})
		],
		resolve: {
			alias: {
				'@': fileURLToPath(new URL('./src', import.meta.url))
			}
		},
		define: {
			'app_version': JSON.stringify(process.env.npm_package_version)
		},
		server: {
			port: 8080,
			historyApiFallback: true,
			proxy: {
				'^/inc': {
					target: 'http://127.0.0.1:8000',
					changeOrigin: true
				}
			}
		},
		build: {
			target: ['es2019'],
			assetsDir: 'static/assets'
		}
	}
})
