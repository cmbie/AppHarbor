import React from 'react';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import BottomNav from '@/components/BottomNav';
import { ToastProvider } from '@/components/ui/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-background text-foreground">
                <Sidebar />
                <div className="flex-1 min-w-0 flex flex-col">
                    <Topbar />
                    <main className="flex-1 w-full max-w-screen-2xl mx-auto px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-16 py-6 pb-28 md:pb-10">
                        {children}
                    </main>
                </div>
                <BottomNav />
            </div>
        </ToastProvider>
    );
}