import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    IconHome,
    IconShoppingCart,
    IconBox,
    IconReportAnalytics,
    IconMenu2
} from '@tabler/icons-react';

export default function MobileNav() {
    const { url } = usePage();

    const navItems = [
        {
            href: '/dashboard',
            icon: IconHome,
            label: 'Home',
            active: url === '/dashboard'
        },
        {
            href: '/dashboard/transactions',
            icon: IconShoppingCart,
            label: 'Transaksi',
            active: url.startsWith('/dashboard/transactions')
        },
        {
            href: '/dashboard/products',
            icon: IconBox,
            label: 'Produk',
            active: url.startsWith('/dashboard/products')
        },
        {
            href: '/dashboard/reports/sales',
            icon: IconReportAnalytics,
            label: 'Laporan',
            active: url.startsWith('/dashboard/reports')
        },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={`
                            flex flex-col items-center justify-center flex-1 h-full py-2 px-1
                            transition-all duration-200
                            ${item.active
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                            }
                        `}
                    >
                        <div className={`
                            relative p-1.5 rounded-xl transition-all duration-200
                            ${item.active ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                        `}>
                            <item.icon
                                size={22}
                                strokeWidth={item.active ? 2 : 1.5}
                            />
                            {item.active && (
                                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full" />
                            )}
                        </div>
                        <span className={`
                            text-[10px] mt-1 font-medium
                            ${item.active ? 'text-blue-600 dark:text-blue-400' : ''}
                        `}>
                            {item.label}
                        </span>
                    </Link>
                ))}
            </div>

            {/* Safe area for devices with home indicator */}
            <div className="h-safe-area-inset-bottom bg-white dark:bg-slate-950" />
        </nav>
    );
}
