import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
                Lupa password Anda? Tidak masalah. Masukkan alamat email Anda dan kami akan mengirimkan link reset password.
            </div>

            {status && <div className="mb-4 font-medium text-sm text-emerald-600 dark:text-emerald-400">{status}</div>}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="Masukkan email Anda"
                    />

                    <InputError message={errors.email} />
                </div>

                <div className="flex items-center justify-end mt-6">
                    <PrimaryButton disabled={processing}>
                        Kirim Link Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
