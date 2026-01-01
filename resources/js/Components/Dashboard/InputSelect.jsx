import React, { useState, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { IconChevronDown, IconCheck, IconSearch } from '@tabler/icons-react'

export default function InputSelect({ selected, data = [], setSelected, label, errors, placeholder, multiple = false, searchable = false, displayKey = 'name', getOptionLabel, getOptionValue, }) {
    const [search, setSearch] = useState('')

    const items = Array.isArray(data) ? data : []

    const resolveLabel = (item) => {
        if (getOptionLabel) return getOptionLabel(item)
        if (typeof item !== 'object') return String(item)
        return item?.[displayKey] ?? ''
    }

    const resolveValue = (item) => {
        if (getOptionValue) return getOptionValue(item)
        if (typeof item !== 'object') return item
        return item?.id ?? item?.value
    }

    const filteredData = useMemo(() => {
        if (!searchable || !search) return items

        return items.filter(item =>
            String(item?.[displayKey] ?? '')
                .toLowerCase()
                .includes(search.toLowerCase())
        )
    }, [items, search, searchable, displayKey])

    const isSelected = (item) => {
        const val = resolveValue(item)

        if (multiple) {
            return Array.isArray(selected)
                ? selected.some(
                      (s) => resolveValue(s) === val
                  )
                : false
        }

        return selected
            ? resolveValue(selected) === val
            : false
    }

     const displaySelected = () => {
        if (multiple) {
            if (!Array.isArray(selected) || selected.length === 0)
                return <span className='text-slate-400 dark:text-slate-500'>{placeholder}</span>

            return selected.map(resolveLabel).join(', ')
        }

        return selected ? resolveLabel(selected) : <span className='text-slate-400 dark:text-slate-500'>{placeholder}</span>
    }

    return (
        <div className='flex flex-col gap-1.5 relative'>
            {label && (
                <label className='text-sm font-medium text-slate-700 dark:text-slate-300'>{label}</label>
            )}
            <Listbox value={selected} onChange={setSelected} multiple={multiple} by="id">
                <Listbox.Button className={`w-full px-3.5 py-2.5 text-sm rounded-lg border transition-colors flex justify-between items-center gap-2
                    bg-white dark:bg-slate-800
                    text-slate-900 dark:text-slate-100
                    border-slate-200 dark:border-slate-700
                    hover:border-slate-300 dark:hover:border-slate-600
                    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400
                    ${errors ? 'border-red-500 dark:border-red-500' : ''}`}>
                    <span className="truncate flex-1 text-left">
                        {displaySelected()}
                    </span>
                    <IconChevronDown size={18} strokeWidth={1.5} className='text-slate-400 dark:text-slate-500 flex-shrink-0' />
                </Listbox.Button>

                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Listbox.Options className='absolute w-full z-20 mt-1 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 max-h-60 overflow-y-auto'>
                        {searchable && (
                            <div className='px-2 pb-2 mb-2 border-b border-slate-200 dark:border-slate-700'>
                                <div className='relative'>
                                    <IconSearch size={16} className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400' />
                                    <input
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Cari..."
                                        className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400"
                                    />
                                </div>
                            </div>
                        )}
                        {filteredData.length === 0 ? (
                            <div className='px-3 py-2 text-sm text-slate-400 dark:text-slate-500 text-center'>Tidak ada data</div>
                        ) : (
                            filteredData.map((item, idx) => (
                                <Listbox.Option
                                    key={resolveValue(item) ?? idx}
                                    value={item}
                                >
                                    {({ active }) => (
                                        <div className={`flex items-center justify-between gap-2 px-3 py-2 mx-2 text-sm cursor-pointer rounded-lg transition-colors
                                            ${active ? 'bg-slate-100 dark:bg-slate-800' : ''}
                                            ${isSelected(item) ? 'text-blue-600 dark:text-blue-400' : 'text-slate-700 dark:text-slate-300'}`}>
                                            <span className="truncate">
                                                {resolveLabel(item)}
                                            </span>
                                            {isSelected(item) && (
                                                <IconCheck size={16} className='text-blue-500 flex-shrink-0' />
                                            )}
                                        </div>
                                    )}
                                </Listbox.Option>
                            ))
                        )}
                    </Listbox.Options>
                </Transition>
            </Listbox>
            {errors && (
                <small className='text-xs text-red-500 dark:text-red-400'>{errors}</small>
            )}
        </div>
    )
}
