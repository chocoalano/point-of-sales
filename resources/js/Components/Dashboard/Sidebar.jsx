import React from "react";
import { usePage } from "@inertiajs/react";
import { IconCash, IconX } from "@tabler/icons-react";
import LinkItem from "@/Components/Dashboard/LinkItem";
import LinkItemDropdown from "@/Components/Dashboard/LinkItemDropdown";
import Menu from "@/Utils/Menu";

export default function Sidebar({ sidebarOpen, isMobile = false, onClose }) {
    const { auth } = usePage().props;
    const menuNavigation = Menu();

    return (
        <div className={`
            ${isMobile ? 'w-72 h-full' : sidebarOpen ? 'w-[260px]' : 'w-[100px]'}
            ${isMobile ? '' : 'hidden md:block fixed left-0 top-0 h-screen'}
            overflow-y-auto border-r transition-all duration-300
            bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800
            scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700
        `}>
            {/* Header */}
            <div className={`
                flex items-center h-16 border-b border-slate-200 dark:border-slate-800
                ${sidebarOpen ? 'justify-between px-5' : 'justify-center px-3'}
            `}>
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <IconCash className="w-5 h-5 text-white" />
                    </div>
                    {sidebarOpen && (
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            POS Pro
                        </span>
                    )}
                </div>
                {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                        <IconX size={20} />
                    </button>
                )}
            </div>

            {/* User Profile */}
            <div className={`
                border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50
                ${sidebarOpen ? 'p-4' : 'p-3 flex justify-center'}
            `}>
                {sidebarOpen ? (
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={auth.user.avatar ? auth.user.avatar : `https://ui-avatars.com/api/?name=${auth.user.name}&background=3b82f6&color=fff`}
                                className="w-11 h-11 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                                alt={auth.user.name}
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">
                                {auth.user.name}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                                {auth.user.email}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <img
                            src={auth.user.avatar ? auth.user.avatar : `https://ui-avatars.com/api/?name=${auth.user.name}&background=3b82f6&color=fff`}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md"
                            alt={auth.user.name}
                        />
                        <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col py-4 overflow-y-auto">
                {menuNavigation.map((item, index) => (
                    item.details.some(detail => detail.permissions === true) && (
                        <div key={index} className="mb-2">
                            {sidebarOpen && (
                                <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    {item.title}
                                </div>
                            )}
                            <div className={sidebarOpen ? 'px-2' : 'px-2 flex flex-col items-center'}>
                                {item.details.map((detail, indexDetail) => (
                                    detail.permissions === true && (
                                        detail.hasOwnProperty('subdetails') ? (
                                            <LinkItemDropdown
                                                key={indexDetail}
                                                title={detail.title}
                                                icon={detail.icon}
                                                data={detail.subdetails}
                                                access={detail.permissions}
                                                sidebarOpen={sidebarOpen}
                                            />
                                        ) : (
                                            <LinkItem
                                                key={indexDetail}
                                                title={detail.title}
                                                icon={detail.icon}
                                                href={detail.href}
                                                access={detail.permissions}
                                                sidebarOpen={sidebarOpen}
                                            />
                                        )
                                    )
                                ))}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Footer */}
            {sidebarOpen && (
                <div className="mt-auto p-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="text-[10px] text-center text-slate-400 dark:text-slate-500">
                        v2.0.0 • © {new Date().getFullYear()}
                    </div>
                </div>
            )}
        </div>
    );
}
