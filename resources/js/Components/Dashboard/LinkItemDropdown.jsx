import React, { useState, useEffect } from 'react'
import { Link, usePage } from '@inertiajs/react'
import { IconChevronDown, IconChevronRight, IconCircle } from '@tabler/icons-react'

export default function LinkItemDropdown({ icon, title, data, access, sidebarOpen, ...props }) {
    // destruct url from usepage
    const { url } = usePage();

    // destruct auth from usepage props
    const { auth } = usePage().props;

    // Check if any child is active
    const hasActiveChild = data.some(item => url === item.href || url.startsWith(item.href));

    // define state - auto open if child is active
    const [isOpen, setIsOpen] = useState(hasActiveChild);

    // Update isOpen when route changes
    useEffect(() => {
        if (hasActiveChild) setIsOpen(true);
    }, [url, hasActiveChild]);

    const hasAccess = auth.super === true || access === true;

    if (!hasAccess) return null;

    const baseButtonClasses = "group flex items-center gap-3 rounded-xl transition-all duration-200 w-full";
    const activeButtonClasses = hasActiveChild
        ? "bg-slate-100 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100"
        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100";

    if (sidebarOpen) {
        return (
            <div className="mb-1">
                <button
                    className={`${baseButtonClasses} ${activeButtonClasses} px-3 py-2.5 text-sm justify-between`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <div className="flex items-center gap-3">
                        <span className={`flex-shrink-0 ${hasActiveChild ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                            {icon}
                        </span>
                        <span className="capitalize truncate font-medium">{title}</span>
                    </div>
                    <IconChevronDown
                        size={16}
                        strokeWidth={2}
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                </button>

                {/* Dropdown Items */}
                <div className={`overflow-hidden transition-all duration-200 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <div className="ml-4 pl-3 border-l-2 border-slate-200 dark:border-slate-700 mt-1 space-y-1">
                        {data.map((item, i) => (
                            item.permissions === true && (
                                <Link
                                    key={i}
                                    href={item.href}
                                    className={`
                                        flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-all duration-200
                                        ${url === item.href || url.startsWith(item.href)
                                            ? 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 dark:text-blue-400 font-semibold'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100'
                                        }
                                    `}
                                    {...props}
                                >
                                    <IconCircle
                                        size={6}
                                        fill={url === item.href || url.startsWith(item.href) ? 'currentColor' : 'transparent'}
                                        className={url === item.href || url.startsWith(item.href) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}
                                    />
                                    <span className="capitalize truncate">{item.title}</span>
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Collapsed sidebar view
    return (
        <div className="relative mb-1">
            <button
                className={`${baseButtonClasses} ${activeButtonClasses} p-3 justify-center`}
                onClick={() => setIsOpen(!isOpen)}
                title={title}
            >
                <span className={hasActiveChild ? 'text-blue-600 dark:text-blue-400' : ''}>
                    {icon}
                </span>
                {hasActiveChild && (
                    <span className="absolute right-1 top-1/2 -translate-y-1/2 w-1 h-4 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
            </button>

            {/* Collapsed dropdown - shows as popup */}
            {isOpen && (
                <div className="absolute left-full top-0 ml-2 w-48 py-2 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 border-b border-slate-200 dark:border-slate-700">
                        {title}
                    </div>
                    {data.map((item, i) => (
                        item.permissions === true && (
                            <Link
                                key={i}
                                href={item.href}
                                className={`
                                    flex items-center gap-2 px-3 py-2 text-sm transition-colors
                                    ${url === item.href || url.startsWith(item.href)
                                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }
                                `}
                                {...props}
                            >
                                {item.icon}
                                <span className="capitalize truncate">{item.title}</span>
                            </Link>
                        )
                    ))}
                </div>
            )}
        </div>
    );
}
