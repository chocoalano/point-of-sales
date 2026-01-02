import { useEffect } from "react";
import { Head, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => reset("password");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("login"));
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100">
                {/* Left - Form */}
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <ApplicationLogo className="w-16 h-16 mb-4" />
                            <h1 className="text-3xl font-bold">
                                Aplikasi Kasir
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400">
                                Masuk ke Dashboard
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 font-medium text-sm text-emerald-600 dark:text-emerald-400">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Masukkan email"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 dark:text-red-400 mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password"
                                    className="w-full px-4 py-2.5 text-sm rounded-lg border transition-colors bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400"
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500 dark:text-red-400 mt-1.5">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                        className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 focus:ring-blue-500 dark:bg-slate-800 dark:checked:bg-blue-600"
                                    />
                                    <span className="text-sm text-slate-600 dark:text-slate-400">Ingat saya</span>
                                </label>

                                {canResetPassword && (
                                    <a
                                        href={route("password.request")}
                                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline"
                                    >
                                        Lupa Password?
                                    </a>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? "Memproses..." : "Masuk"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right - Image */}
                <div className="hidden lg:block">
                    <div
                        className="h-full w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('/assets/photo/pos2.jpg')`,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
