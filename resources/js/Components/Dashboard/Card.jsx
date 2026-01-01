import React from 'react'

export default function Card({ icon, title, children, footer, className, onSubmit }) {
    return (
        <section onSubmit={onSubmit} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {title && (
                <div className={`px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ${className}`}>
                    <div className='flex items-center gap-2 font-semibold text-sm text-slate-800 dark:text-slate-100'>
                        {icon}
                        {title}
                    </div>
                </div>
            )}
            <div className='p-5'>
                {children}
            </div>
            {footer && (
                <div className={`px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ${className}`}>
                    {footer}
                </div>
            )}
        </section>
    )
}
