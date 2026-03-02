/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                saffron: {
                    50: '#FFF8F0',
                    100: '#FFECCC',
                    200: '#FFDA99',
                    300: '#FFC866',
                    400: '#FFB533',
                    500: '#FF9933',
                    600: '#E07B1B',
                    700: '#B85E0D',
                    800: '#8F4300',
                    900: '#662E00',
                },
                'india-green': {
                    50: '#E8F5E3',
                    100: '#C8E6C0',
                    200: '#93D17E',
                    300: '#5FBC3C',
                    400: '#2DA420',
                    500: '#138808',
                    600: '#0F6E06',
                    700: '#0A5504',
                    800: '#063C03',
                    900: '#032301',
                },
                'navy-blue': {
                    50: '#E0E0FF',
                    100: '#B3B3FF',
                    200: '#8080FF',
                    300: '#4D4DFF',
                    400: '#1A1AFF',
                    500: '#000080',
                    600: '#000066',
                    700: '#00004D',
                    800: '#000033',
                    900: '#00001A',
                },
                'chakra-blue': '#06038D',
            },
            fontFamily: {
                sans: ['Inter', 'Noto Sans Devanagari', 'system-ui', 'sans-serif'],
            },
            animation: {
                'slide-up': 'slideUp 0.3s ease-out',
                'fade-in': 'fadeIn 0.4s ease-out',
                'pulse-soft': 'pulseSoft 2s infinite',
                'bounce-in': 'bounceIn 0.5s ease-out',
            },
            keyframes: {
                slideUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '60%': { transform: 'scale(1.02)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
};
