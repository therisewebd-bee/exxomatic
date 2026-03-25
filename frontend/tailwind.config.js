/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                brand: {
                    purple: '#7C3AED',
                    'purple-light': '#8B5CF6',
                    'purple-dark': '#6D28D9',
                },
                sidebar: {
                    bg: '#1a1a2e',
                    hover: '#252547',
                    active: '#2d2d5e',
                    text: '#a0a0c0',
                    'text-active': '#ffffff',
                },
                status: {
                    moving: '#22C55E',
                    stopped: '#EF4444',
                    idle: '#F59E0B',
                },
            },
        },
    },
    plugins: [],
}
