export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ` +
                `bg-blue-600 hover:bg-blue-700 text-white ` +
                `dark:bg-blue-500 dark:hover:bg-blue-600 ` +
                `focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ` +
                `disabled:opacity-50 disabled:cursor-not-allowed ` +
                className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
