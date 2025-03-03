import { ReactNode } from 'react';
import { type Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import Providers from '../providers/providers';

import '~/styles/globals.css';

export const metadata: Metadata = {
    title: 'GroceryOptimizer',
    description:
        'GroceryOptimizer is a web application that helps you optimize your grocery shopping by suggesting the best deals and saving money.',
    icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const poppins = Poppins({
    subsets: ['latin'],
    variable: '--font-poppins',
    weight: ['400', '500', '600', '700'],
});

type Props = {
    children: ReactNode;
};

export default function RootLayout({ children }: Readonly<Props>) {
    return (
        <html lang="en" className={`${poppins.variable} ${inter.variable}`}>
            <body>
                <Providers>{children}</Providers>
            </body>
        </html>
    );
}
