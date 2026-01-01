import React from 'react'
import { Link } from '@inertiajs/react';
import { IconChevronRight, IconChevronLeft } from '@tabler/icons-react';
export default function Pagination({ meta }) {
     if (!meta || !meta.links || meta.links.length <= 1) {
        return null;
    }


    const style = 'p-1.5 text-sm border rounded-lg bg-white text-slate-500 hover:bg-slate-100 transition-colors dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:border-slate-700'

    return (
        <>
            <ul className="mt-4 lg:mt-6 justify-end flex items-center gap-1">
                {meta.links.map((item, i) => {
                    return item.url != null ? (
                        item.label.includes('Previous') ? (
                            <Link className={style} key={i} href={item.url}>
                                <IconChevronLeft size={'20'} strokeWidth={'1.5'} />
                            </Link>
                        ) : item.label.includes('Next') ? (
                            <Link className={style} key={i} href={item.url}>
                                <IconChevronRight size={'20'} strokeWidth={'1.5'} />
                            </Link>
                        ) : (
                            <Link className={`px-3 py-1.5 text-sm border rounded-lg transition-colors dark:border-slate-700 ${
                                item.active
                                    ? 'bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800'
                            }`} key={i} href={item.url}>
                                {item.label}
                            </Link>
                        )
                    ) : null;
                })}
            </ul>
        </>
    )
}
