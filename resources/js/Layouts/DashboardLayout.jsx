import React, { useEffect, useState } from 'react'
import Sidebar from '@/Components/Dashboard/Sidebar'
import Navbar from '@/Components/Dashboard/Navbar'
import MobileNav from '@/Components/Dashboard/MobileNav'
import { Toaster } from 'react-hot-toast';
import { useTheme } from '@/Context/ThemeSwitcherContext';

export default function AppLayout({ children }) {

    // destruct darkMode and themeSwitcher from context
    const { darkMode, themeSwitcher } = useTheme();

    // define state sidebarOpen
    const [sidebarOpen, setSidebarOpen] = useState(
        localStorage.getItem('sidebarOpen') === 'true'
    );

    // Mobile sidebar state
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // define react hooks
    useEffect(() => {
        localStorage.setItem('sidebarOpen', sidebarOpen);
    }, [sidebarOpen])

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // define function toggleSidebar
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className='min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300'>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Desktop Sidebar */}
            <Sidebar sidebarOpen={sidebarOpen} />

            {/* Mobile Sidebar */}
            <div className={`
                fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:hidden
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <Sidebar sidebarOpen={true} isMobile={true} onClose={() => setMobileMenuOpen(false)} />
            </div>

            {/* Main Content Area */}
            <div className={`
                flex flex-col min-h-screen transition-all duration-300
                ${sidebarOpen ? 'md:ml-[260px]' : 'md:ml-[100px]'}
            `}>
                {/* Navbar */}
                <Navbar
                    toggleSidebar={toggleSidebar}
                    toggleMobileMenu={toggleMobileMenu}
                    themeSwitcher={themeSwitcher}
                    darkMode={darkMode}
                />

                {/* Main Content */}
                <main className='flex-1 w-full'>
                    <div className='p-4 md:p-6 lg:p-8 pb-24 md:pb-8'>
                        <div className='max-w-full'>
                            {children}
                        </div>
                    </div>
                </main>

                {/* Footer - Desktop Only */}
                <footer className='hidden md:block py-4 px-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 transition-colors duration-300'>
                    <div className='flex flex-col md:flex-row justify-between items-center gap-2 text-sm text-slate-500 dark:text-slate-400'>
                        <span>© {new Date().getFullYear()} POS Pro. All rights reserved.</span>
                        <span>Made with ❤️ by sitikfatikhah</span>
                    </div>
                </footer>
            </div>

            {/* Mobile Bottom Navigation */}
            <MobileNav />

            {/* Toast Notifications */}
            <Toaster
                position='top-right'
                toastOptions={{
                    className: '',
                    style: {
                        background: darkMode ? '#1e293b' : '#fff',
                        color: darkMode ? '#f1f5f9' : '#1e293b',
                        border: darkMode ? '1px solid #334155' : '1px solid #e2e8f0',
                    },
                    success: {
                        iconTheme: {
                            primary: '#22c55e',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#fff',
                        },
                    },
                }}
            />
        </div>
    )
}
