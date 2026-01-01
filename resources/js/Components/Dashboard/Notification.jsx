import React, { useState, useEffect, useRef } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { IconBell, IconDots, IconCircleCheck, IconPackage, IconCashBanknote, IconPhoto, IconCircleCheckFilled, IconMessage } from '@tabler/icons-react'

export default function Notification() {

    const data = [
    ]

    return (
        <Menu className='relative' as="div">
            <Menu.Button className='relative p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                <IconBell strokeWidth={1.5} size={20} />
                {data.length > 0 && (
                    <span className='absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
                        {data.length > 9 ? '9+' : data.length}
                    </span>
                )}
            </Menu.Button>

            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className='absolute right-0 mt-2 w-80 md:w-96 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 z-[100] overflow-hidden'>
                    {/* Header */}
                    <div className='flex justify-between items-center px-4 py-3 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50'>
                        <h3 className='text-sm font-semibold text-slate-800 dark:text-slate-100'>
                            Notifikasi
                        </h3>
                        <button className='p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'>
                            <IconDots size={18} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className='max-h-80 overflow-y-auto'>
                        {data.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-12 px-4'>
                                <div className='w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4'>
                                    <IconBell size={28} className='text-slate-400 dark:text-slate-500' />
                                </div>
                                <p className='text-sm text-slate-500 dark:text-slate-400 text-center'>
                                    Tidak ada notifikasi baru
                                </p>
                            </div>
                        ) : (
                            <div className='divide-y divide-slate-100 dark:divide-slate-800'>
                                {data.map((item, i) => (
                                    <Menu.Item key={i}>
                                        {({ active }) => (
                                            <button className={`w-full flex items-start gap-3 p-4 text-left transition-colors ${
                                                active ? 'bg-slate-50 dark:bg-slate-800/50' : ''
                                            }`}>
                                                <div className='flex-shrink-0'>
                                                    {item.icon}
                                                </div>
                                                <div className='flex-1 min-w-0'>
                                                    <p className='text-sm font-medium text-slate-800 dark:text-slate-100'>
                                                        {item.user}
                                                    </p>
                                                    <p className='text-xs text-slate-500 dark:text-slate-400 mt-0.5'>
                                                        {item.message}
                                                    </p>
                                                    <p className='text-xs text-slate-400 dark:text-slate-500 mt-1'>
                                                        {item.time}
                                                    </p>
                                                </div>
                                            </button>
                                        )}
                                    </Menu.Item>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {data.length > 0 && (
                        <div className='border-t border-slate-200 dark:border-slate-700 p-2'>
                            <button className='w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors'>
                                Lihat Semua Notifikasi
                            </button>
                        </div>
                    )}
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
