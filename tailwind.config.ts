import { heroui } from '@heroui/react';
import { type Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

export default {
    content: [
        './src/**/*.tsx',
        './node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}',
        './node_modules/@heroui/theme/dist/components/navbar.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-poppins)', ...fontFamily.sans],
                mono: ['var(--font-geist-mono)', ...fontFamily.mono],
                header: ['var(--font-inter)'],
                body: ['var(--font-poppins)'],
            },
        },
    },
    plugins: [heroui()],
} satisfies Config;
