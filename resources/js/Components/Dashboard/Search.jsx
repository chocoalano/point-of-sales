import { useForm } from '@inertiajs/react';
import { IconSearch } from '@tabler/icons-react';
import React from 'react'
export default function Search({ url, placeholder }) {

    // define use form inertia
    const { data, setData, get } = useForm({
        search: '',
    })

    // define method searchData
    const searchData = (e) => {
        e.preventDefault();

        get(`${url}?search=${data.search}`)
    }

    return (
        <form onSubmit={searchData}>
            <div className='relative'>
                <input
                    type='text'
                    value={data.search}
                    onChange={e => setData('search', e.target.value)}
                    className='py-2.5 px-4 pr-11 block w-full rounded-lg text-sm border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-700 bg-white border-slate-200 focus:border-blue-500 placeholder:text-slate-400 dark:text-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:focus:border-blue-400 dark:placeholder:text-slate-500'
                    placeholder={placeholder} />
                <div className='absolute inset-y-0 right-0 flex items-center pointer-events-none pr-4'>
                    <IconSearch className='text-slate-400 dark:text-slate-500 w-5 h-5' />
                </div>
            </div>
        </form>
    )
}
