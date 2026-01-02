import { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => reset("password", "password_confirmation");
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route("register"));
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white text-gray-900 dark:bg-neutral-900 dark:text-gray-100">
                {/* Left: Form */}
                <div className="flex items-center justify-center p-8">
                    <div className="w-full max-w-md">
                        <div className="mb-8">
                            <ApplicationLogo className="w-16 h-16 mb-4" />
                            <h1 className="text-3xl font-bold">
                                Aplikasi Kasir
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Buat akun baru
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <InputLabel htmlFor="name" value="Nama Lengkap" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    placeholder="Masukkan nama lengkap"
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    placeholder="Masukkan email"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    placeholder="Masukkan password"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Konfirmasi Password"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Konfirmasi password"
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <div className="flex items-center justify-between">
                                <Link
                                    href={route("login")}
                                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline"
                                >
                                    Sudah punya akun?
                                </Link>

                                <PrimaryButton disabled={processing}>
                                    Daftar
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right: Image */}
                <div className="hidden lg:block">
                    <div
                        className="h-full w-full bg-cover bg-center"
                        style={{
                            backgroundImage: `url('/assets/photo/auth.jpg')`,
                        }}
                    />
                </div>
            </div>
        </>
    );
}
