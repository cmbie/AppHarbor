import React from 'react';
import type { Metadata, Viewport } from 'next';
import { DM_Sans } from 'next/font/google';
import "@/styles/tailwind.css";
import { ThemeProvider } from '@/components/ThemeProvider';

const dmSans = DM_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-dm-sans',
    display: 'swap',
});

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    title: 'AppHarbor — Discover and Download Real Apps and Games',
    description:
        'AppHarbor is an owner-curated app marketplace with honest download status, versions and local reviews. Not affiliated with Apple.',
    icons: {
        icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={dmSans.variable} suppressHydrationWarning>
            <body className={dmSans.className}>
                <ThemeProvider>{children}</ThemeProvider>

                <script type="module" async src="https://static.rocket.new/rocket-web.js?_cfg=https%3A%2F%2Fappharbor6425back.builtwithrocket.new&_be=https%3A%2F%2Fappanalytics.rocket.new&_v=0.1.21" />
                <script type="module" defer src="https://static.rocket.new/rocket-shot.js?v=0.0.3" /></body>
        </html>
    );
}