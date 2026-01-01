import React from 'react'
import { Link, usePage } from '@inertiajs/react'

export default function LinkItem({ href, icon, link, access, title, sidebarOpen, ...props }) {
    // destruct url from usepage
    const { url } = usePage();

    // destruct auth from usepage props
    const { auth } = usePage().props;

    const isActive = url.startsWith(href);
    const hasAccess = auth.super === true || access === true;

    if (!hasAccess) return null;

    const baseClasses = "group flex items-center gap-3 rounded-xl transition-all duration-200";

    const activeClasses = isActive
        ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-semibold shadow-sm"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100";

    if (sidebarOpen) {
        return (
            <Link
                href={href}
                className={`${baseClasses} ${activeClasses} px-3 py-2.5 text-sm mb-1`}
                {...props}
            >
                <span className={`flex-shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                    {icon}
                </span>
                <span className="capitalize truncate">{title}</span>
                {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
            </Link>
        );
    }

    return (
        <Link
            href={href}
            className={`${baseClasses} ${activeClasses} p-3 mb-1 justify-center relative`}
            title={title}
            {...props}
        >
            <span className={isActive ? 'text-blue-600 dark:text-blue-400' : ''}>
                {icon}
            </span>
            {isActive && (
                <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-blue-600 dark:bg-blue-400" />
            )}
        </Link>
    );
}
