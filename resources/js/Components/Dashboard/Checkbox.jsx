export default function Checkbox({ label, errors, id, ...props }) {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className="flex flex-col gap-1">
            <div className="flex flex-row items-center gap-2.5">
                <input
                    {...props}
                    id={checkboxId}
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-800 dark:checked:bg-blue-600 dark:focus:ring-blue-400 cursor-pointer transition-colors"
                />
                <label
                    htmlFor={checkboxId}
                    className="text-sm text-slate-700 dark:text-slate-300 cursor-pointer select-none"
                >
                    {label}
                </label>
            </div>
            {errors && (
                <small className='text-xs text-red-500 dark:text-red-400 ml-6'>{errors}</small>
            )}
        </div>
    );
}
