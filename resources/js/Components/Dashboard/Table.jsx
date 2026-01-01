import React from 'react'

const Card = ({ icon, title, className, children }) => {
    return (
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
            {title && (
                <div className={`px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 ${className}`}>
                    <div className='flex items-center gap-2 font-semibold text-sm text-slate-800 dark:text-slate-100'>
                        {icon}
                        {title}
                    </div>
                </div>
            )}
            <div className='bg-white dark:bg-slate-900'>
                {children}
            </div>
        </div>
    )
}

const Table = ({ children }) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
                {children}
            </table>
        </div>
    );
};

const Thead = ({ className, children }) => {
    return (
        <thead className={`${className} border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50`}>
            {children}
        </thead>
    );
};

const Tbody = ({ className, children }) => {
    return (
        <tbody className={`${className} divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900`}>
            {children}
        </tbody>
    );
};

const Td = ({ className, children }) => {
    return (
        <td className={`${className} whitespace-nowrap px-4 py-3 align-middle text-slate-700 dark:text-slate-300`}>
            {children}
        </td>
    );
};

const Th = ({ className, children }) => {
    return (
        <th
            scope="col"
            className={`${className} h-12 px-4 text-left align-middle font-semibold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400`}
        >
            {children}
        </th>
    );
};

const Empty = ({ colSpan, message, children }) => {
    return (
        <tr>
            <td colSpan={colSpan}>
                <div className="flex items-center justify-center py-16">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                            {children}
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            {message}
                        </p>
                    </div>
                </div>
            </td>
        </tr>
    )
}

Table.Card = Card;
Table.Thead = Thead;
Table.Tbody = Tbody;
Table.Td = Td;
Table.Th = Th;
Table.Empty = Empty;

export default Table;
