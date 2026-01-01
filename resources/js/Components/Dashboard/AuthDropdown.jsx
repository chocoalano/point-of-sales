import React, { useState, useRef, useEffect } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { Link, usePage } from '@inertiajs/react'
import { IconLogout, IconUserCog, IconChevronDown } from '@tabler/icons-react'
import { useForm } from '@inertiajs/react'

export default function AuthDropdown({ auth, isMobile }) {

    // define usefrom
    const { post } = useForm();
    // define url from usepage
    const { url } = usePage();

    // define function logout
    const logout = async (e) => {
        e.preventDefault();
        post(route('logout'));
    }

    return (
        <Menu className='relative' as="div">
            <Menu.Button className='flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
                <img
                    src={auth.user.avatar ? auth.user.avatar : `https://ui-avatars.com/api/?name=${auth.user.name}&background=3b82f6&color=fff`}
                    alt={auth.user.name}
                    className='w-9 h-9 rounded-xl ring-2 ring-white dark:ring-slate-800 shadow-sm'
                />
                <div className='hidden md:flex flex-col items-start'>
                    <span className='text-sm font-medium text-slate-700 dark:text-slate-200 capitalize max-w-[120px] truncate'>
                        {auth.user.name}
                    </span>
                </div>
                <IconChevronDown size={16} className='text-slate-400 hidden md:block' />
            </Menu.Button>

            <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
            >
                <Menu.Items className='absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 py-2 z-[100]'>
                    {/* User Info */}
                    <div className='px-4 py-3 border-b border-slate-200 dark:border-slate-700'>
                        <div className='flex items-center gap-3'>
                            <img
                                src={auth.user.avatar ? auth.user.avatar : `https://ui-avatars.com/api/?name=${auth.user.name}&background=3b82f6&color=fff`}
                                alt={auth.user.name}
                                className='w-10 h-10 rounded-xl'
                            />
                            <div className='flex-1 min-w-0'>
                                <div className='text-sm font-semibold text-slate-800 dark:text-slate-100 capitalize truncate'>
                                    {auth.user.name}
                                </div>
                                <div className='text-xs text-slate-500 dark:text-slate-400 truncate'>
                                    {auth.user.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className='py-2'>
                        {/* <Menu.Item>
                            {({ active }) => (
                                <Link
                                    href="/dashboard/profile"
                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm ${
                                        active
                                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                                            : 'text-slate-600 dark:text-slate-400'
                                    } transition-colors`}
                                >
                                    <IconUserCog size={18} strokeWidth={1.5} />
                                    Profile Settings
                                </Link>
                            )}
                        </Menu.Item> */}
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    onClick={logout}
                                    className={`flex items-center gap-3 px-4 py-2.5 text-sm w-full ${
                                        active
                                            ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                                            : 'text-slate-600 dark:text-slate-400'
                                    } transition-colors`}
                                >
                                    <IconLogout size={18} strokeWidth={1.5} />
                                    Logout
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    )
}
