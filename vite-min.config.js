
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({

    root: './root',

    build: {
        emptyOutDir: true,
        outDir: "../build",
        rollupOptions: {
            output: {
                entryFileNames: `assets/[name].[hash].js`,
                chunkFileNames: `assets/[name].[hash].js`,
                assetFileNames: `assets/[name].[hash].[ext]`,
                manualChunks(id) {
                    if (id.includes('src2/stepHook')) {
                        return 'stepHook';
                    }
                    if (id.includes('src/index')) {
                        return 'guide';
                    }
                }
            }
        }
    },

    server: {

        port: 1226,
        strictPort: true,
        https: true
    },

    plugins: [
        mkcert(),
        visualizer(),
    ],

    resolve: {
        alias: {
            $fonts: path.resolve(__dirname, 'root/src/modules/fonts'),
        }
    },

    css: {
        preprocessorOptions: {
            scss: {
                charset: false,
            }
        }
    }
});
