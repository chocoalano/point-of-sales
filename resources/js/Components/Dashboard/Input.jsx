import React from 'react'

export default function Input({ label, type, className, errors, value, ...props }) {
    return (
        <div className='flex flex-col gap-1.5'>
            {label && (
                <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors
                    bg-white dark:bg-slate-800
                    text-slate-900 dark:text-slate-100
                    placeholder:text-slate-400 dark:placeholder:text-slate-500
                    border-slate-200 dark:border-slate-700
                    hover:border-slate-300 dark:hover:border-slate-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${errors ? 'border-red-500 dark:border-red-500 focus:ring-red-500/20' : ''}
                    ${className}`}
                value={value ?? ''}
                {...props}
            />
            {errors && (
                <small className='text-xs text-red-500 dark:text-red-400'>{errors}</small>
            )}
        </div>
    )
}
