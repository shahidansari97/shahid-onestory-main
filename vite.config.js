import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    optimizeDeps: {
        include: ['react-hot-toast'],
    },
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) return;

                    // `@ckeditor/ckeditor5-react` depends on React runtime.
                    // Putting it into `vendor-editor` can create a circular chunk
                    // dependency between `vendor-editor` and `vendor-react`,
                    // which can manifest as: "Cannot access 'Ty' before initialization".
                    if (id.includes('@ckeditor/ckeditor5-react')) {
                        return 'vendor-react';
                    }

                    if (id.includes('@ckeditor') || id.includes('@cesdk/cesdk-js')) {
                        return 'vendor-editor';
                    }

                    if (
                        id.includes('@mui/material') ||
                        id.includes('@emotion/react') ||
                        id.includes('@emotion/styled')
                    ) {
                        return 'vendor-ui';
                    }

                    if (
                        id.includes('video.js') ||
                        id.includes('hls.js') ||
                        id.includes('shaka-player') ||
                        id.includes('@videojs/http-streaming')
                    ) {
                        return 'vendor-video';
                    }

                    if (
                        id.includes('react') ||
                        id.includes('react-dom') ||
                        id.includes('@inertiajs/react')
                    ) {
                        return 'vendor-react';
                    }
                },
            },
        },
    },
    plugins: [
        react({
            jsxRuntime: 'automatic',
            fastRefresh: true,
        }),
        laravel({
            input: [
                'resources/js/app.jsx',
                'resources/css/app.css'
            ],
            refresh: [
                'resources/views/**',
            ],
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
            'ziggy-js': path.resolve(__dirname, 'vendor/tightenco/ziggy'),
        },
    },
    server: {
        hmr: {
            overlay: true,
        },
    },
});
