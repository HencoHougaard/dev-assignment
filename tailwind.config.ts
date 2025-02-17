/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './app.vue',
        './error.vue'
    ],
    theme: {
        extend: {
            colors: {
                primary: '#223030',
                secondary: '#959D90',
                accent: '#EFEFE9',
            },
            keyframes: {
                slideIn: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateX(-10px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                shake: {
                    '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-3px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(3px, 0, 0)' },
                }
            },
            animation: {
                'slide-in': 'slideIn 0.4s ease-out',
                'fade-in': 'fadeIn 0.3s ease-out forwards',
                'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
            }
        }
    }
}
