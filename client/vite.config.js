import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// export default defineConfig({
//     plugins: [react()],
//     server: {
//         port: 4000,
//         proxy: {
//             '/api': {
//                 target: 'http://localhost:3000',
//                 changeOrigin: true,
//             },
//         },
//     },
// })

export default defineConfig({
    plugins: [react()],
    server: {
        watch: {
            usePolling: true,
        },
        host: true,
        strictPort: true,
        port: 5000,
    },
})
