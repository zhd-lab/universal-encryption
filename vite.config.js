import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    base: '/ton-repo/',
    plugins: [svelte()],
    server: {
        historyApiFallback: true, // Permet de rediriger toutes les routes vers l'index
    },
});


