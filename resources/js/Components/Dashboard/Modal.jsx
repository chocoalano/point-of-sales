import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IconX } from '@tabler/icons-react';

export default function Modal({ children, title, show = false, maxWidth = '2xl', closeable = true, onClose = () => { } }) {
    const close = () => {
        if (closeable) {
            onClose();
        }
    };

    const maxWidthClass = {
        sm: 'sm:max-w-sm',
        md: 'sm:max-w-md',
        lg: 'sm:max-w-lg',
        xl: 'sm:max-w-xl',
        '2xl': 'sm:max-w-2xl',
        '3xl': 'sm:max-w-3xl',
        '4xl': 'sm:max-w-4xl',
    }[maxWidth];

    return (
        <Transition show={show} as={Fragment} leave="duration-200">
            <Dialog
                as="div"
                id="modal"
                className="fixed inset-0 flex overflow-y-auto px-4 py-6 sm:px-0 items-center justify-center z-50"
                onClose={close}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
                </Transition.Child>

                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                    <Dialog.Panel
                        className={`relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-2xl shadow-slate-900/20 dark:shadow-black/40 w-full sm:mx-auto border border-slate-200 dark:border-slate-800 ${maxWidthClass}`}
                    >
                        <Dialog.Title className='flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50'>
                            <span className='font-semibold text-base text-slate-800 dark:text-slate-100'>
                                {title}
                            </span>
                            {closeable && (
                                <button
                                    onClick={close}
                                    className='p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors'
                                >
                                    <IconX size={18} />
                                </button>
                            )}
                        </Dialog.Title>
                        <div className='p-5'>
                            {children}
                        </div>
                    </Dialog.Panel>
                </Transition.Child>
            </Dialog>
        </Transition>
    );
}
