import { defineConfig, type Plugin } from 'vite';
import tailwindcss from '@tailwindcss/vite';

const PROD_CSP =
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: neurodesk-media:; media-src 'self' blob: neurodesk-media:; font-src 'self' data:; connect-src 'self' neurodesk-media:; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'";

const DEV_CSP = `${PROD_CSP.replace(
    "connect-src 'self' neurodesk-media:",
    "connect-src 'self' neurodesk-media: ws://localhost:* ws://127.0.0.1:*",
)}`;

function cspPlugin(): Plugin {
    let isDev = false;

    return {
        name: 'neurodesk-csp',
        configResolved(config) {
            isDev = config.command === 'serve';
        },
        transformIndexHtml() {
            return [
                {
                    tag: 'meta',
                    injectTo: 'head-prepend',
                    attrs: {
                        'http-equiv': 'Content-Security-Policy',
                        content: isDev ? DEV_CSP : PROD_CSP,
                    },
                },
            ];
        },
    };
}

// https://vitejs.dev/config
export default defineConfig({
    plugins: [tailwindcss(), cspPlugin()],
});
