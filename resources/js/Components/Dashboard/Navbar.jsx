import React, { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react';
import { IconAlignLeft, IconMoon, IconSun, IconMenu2, IconSearch, IconBell } from '@tabler/icons-react'
import AuthDropdown from '@/Components/Dashboard/AuthDropdown';
import Menu from '@/Utils/Menu';
import Notification from '@/Components/Dashboard/Notification';

export default function Navbar({ toggleSidebar, toggleMobileMenu, themeSwitcher, darkMode }) {
    // destruct auth from props
    const { auth } = usePage().props;

    // get menu from utils
    const menuNavigation = Menu();

    // recreate array from menu navigations
    const links = menuNavigation.flatMap((item) => item.details);
    const filter_sublinks = links.filter((item) => item.hasOwnProperty('subdetails'));
    const sublinks = filter_sublinks.flatMap((item) => item.subdetails);

    // define state isMobile
    const [isMobile, setIsMobile] = useState(false);

    // define useEffect
    useEffect(() => {
        // define handle resize window
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        // define event listener
        window.addEventListener('resize', handleResize);

        // call handle resize window
        handleResize();

        // remove event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    })

    // Get current page title
    const getCurrentPageTitle = () => {
        for (const link of links) {
            if (link.hasOwnProperty('subdetails')) {
                for (const sublink of sublinks) {
                    if (sublink.active) return sublink.title;
                }
            } else if (link.active) {
                return link.title;
            }
        }
        return 'Dashboard';
    };

    return (
        <header className='sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-colors duration-300'>
            <div className='flex items-center justify-between h-16 px-4 md:px-6'>
                {/* Left Section */}
                <div className='flex items-center gap-4'>
                    {/* Mobile Menu Button */}
                    <button
                        className='md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        onClick={toggleMobileMenu}
                    >
                        <IconMenu2 size={20} strokeWidth={1.5} />
                    </button>

                    {/* Desktop Sidebar Toggle */}
                    <button
                        className='hidden md:flex p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        onClick={toggleSidebar}
                    >
                        <IconAlignLeft size={20} strokeWidth={1.5} />
                    </button>

                    {/* Page Title / Breadcrumb */}
                    <div className='hidden sm:flex items-center gap-2'>
                        <div className='w-px h-6 bg-slate-200 dark:bg-slate-700 hidden md:block' />
                        <nav className='flex items-center gap-2 md:ml-2'>
                            <span className='text-sm font-semibold text-slate-800 dark:text-slate-200'>
                                {getCurrentPageTitle()}
                            </span>
                        </nav>
                    </div>
                </div>

                {/* Right Section */}
                <div className='flex items-center gap-2'>
                    {/* Search Button - Optional */}
                    {/* <button className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                        <IconSearch size={20} strokeWidth={1.5} />
                    </button> */}

                    {/* Theme Switcher */}
                    <button
                        className='p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'
                        onClick={themeSwitcher}
                        title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {darkMode ? (
                            <IconSun size={20} strokeWidth={1.5} className="text-amber-500" />
                        ) : (
                            <IconMoon size={20} strokeWidth={1.5} />
                        )}
                    </button>

                    {/* Notifications */}
                    <Notification />

                    {/* Divider */}
                    <div className='w-px h-8 bg-slate-200 dark:bg-slate-700 mx-1' />

                    {/* User Dropdown */}
                    <AuthDropdown auth={auth} isMobile={isMobile} />
                </div>
            </div>
        </header>
    )
}
