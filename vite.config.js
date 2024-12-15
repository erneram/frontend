import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { ViteS3 } from '@froxz/vite-plugin-s3'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        plugins: [
            vue(),
            VueDevTools(),
            ViteS3(env.VITE_UPLOAD_ENABLED, {
                basePath: '/',
                clientConfig: {
                    credentials: {
                        accessKeyId: env.VITE_AWS_ACCESS_KEY,
                        secretAccessKey: env.VITE_AWS_ACCESS_PASSWORD,
                    },
                    region: 'us-west-1'
                },
                uploadOptions: {
                    Bucket: 'publicnote.tech'
                }
            })
        ],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url))
            }
        },
        optimizeDeps: {
            include: ['pdfjs-dist']
        },
        build: {
            rollupOptions: {
                output: {
                    manualChunks: {
                        'pdf': ['pdfjs-dist'], // Separa pdfjs-dist en un chunk
                    },
                },
            },
            assetsInclude: ['**/*.mjs'], // Incluye archivos .mjs como assets
        },
        base: './', // Asegura rutas relativas en producción
        server: {
            port: 5173, // Puerto del servidor de desarrollo
            open: true, // Abre el navegador al iniciar el servidor
        },
    }
})
