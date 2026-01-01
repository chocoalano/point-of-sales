import React from 'react'

export default function Card({ icon, title, children, footer, className, onSubmit, form }) {
    const handleSubmit = form || onSubmit;
    const Wrapper = handleSubmit ? 'form' : 'section';

    return (
        <Wrapper
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
        >
            {title && (
                <div className={`px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-t-xl ${className || ''}`}>
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
                <div className={`px-5 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl ${className || ''}`}>
                    {footer}
                </div>
            )}
        </Wrapper>
    )
}
