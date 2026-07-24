/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'media',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                inventory: {
                    bg: '#0f172a',
                    card: '#1e293b',
                    border: '#334155',
                    main: '#f8fafc',
                    muted: '#94a3b8',
                    primary: '#6366f1',
                    'primary-hover': '#4f46e5',
                    danger: '#ef4444',
                    success: '#10b981',
                }
            },
            fontFamily: {
                sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', "'Segoe UI'", 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
            },
            boxShadow: {
                modal: '0 25px 50px -12px rgba(0, 0, 0, 0.6)',
                auth: '0 20px 25px -5px rgba(0, 0, 0, 0.4)',
                table: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }
        },
    },
    plugins: [],
}