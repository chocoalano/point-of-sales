import React from 'react'

export default function Widget({ title, icon, subtitle, className, total, color }) {
    return (
        <div className={`${className} border border-slate-200 dark:border-slate-800 p-5 rounded-xl bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-shadow`}>
            <div className='flex justify-between items-center gap-4'>
                <div className='flex items-center gap-4'>
                    <div className={`p-3 rounded-xl ${color || 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {icon}
                    </div>
                    <div className='flex flex-col gap-0.5'>
                        <div className='font-semibold text-slate-900 dark:text-slate-100'>{title}</div>
                        <div className='text-xs text-slate-500 dark:text-slate-400'>{subtitle}</div>
                    </div>
                </div>
                <div className='font-bold text-xl font-mono text-slate-900 dark:text-white'>
                    {total}
                </div>
            </div>
        </div>
    )
}
