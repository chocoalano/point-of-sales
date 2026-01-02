import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextInput({ type = 'text', className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={
                'w-full px-4 py-2.5 text-sm rounded-lg border transition-colors ' +
                'bg-white dark:bg-slate-800 ' +
                'text-slate-900 dark:text-slate-100 ' +
                'placeholder:text-slate-400 dark:placeholder:text-slate-500 ' +
                'border-slate-300 dark:border-slate-600 ' +
                'hover:border-slate-400 dark:hover:border-slate-500 ' +
                'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 ' +
                'disabled:opacity-50 disabled:cursor-not-allowed ' +
                className
            }
            ref={input}
        />
    );
});
