module.exports = {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: { 
        extend: {
            colors: {
                primary: {
                    50: '#eff6ff',
                    500: '#3b82f6',
                    600: '#2563eb',
                    700: '#1d4ed8',
                }
            }
        } 
    },
    plugins: [],
    corePlugins: {
        preflight: false, // Disable Tailwind's base styles to avoid conflicts
    },
    future: {
        hoverOnlyWhenSupported: true,
    },
};
