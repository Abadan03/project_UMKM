import './bootstrap';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.jsx`,
            import.meta.glob(['./Pages/**/*.jsx', './Pages/**/*.tsx'])
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
}).then(() => console.log('Inertia app mounted successfully'));

// createInertiaApp({
//     pages: {
//         path: './Pages',
//         extension: '.tsx',
//         lazy: true,
//         transform: (name, page) => name.replace('/', '-'),
//     },
// })

// createInertiaApp({
//     id: 'my-app',
//      pages: './Pages',
//      extension: '.jsx'
// })