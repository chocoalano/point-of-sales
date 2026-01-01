import { Head, Link } from '@inertiajs/react';
import {
    IconShoppingCart,
    IconReportAnalytics,
    IconUsers,
    IconCategory,
    IconReceipt,
    IconChartBar,
    IconDeviceLaptop,
    IconCloudComputing,
    IconShieldCheck,
    IconRocket,
    IconCheck,
    IconBrandGithub,
    IconArrowRight,
    IconBox,
    IconCash,
    IconTruck
} from '@tabler/icons-react';

export default function Landing({ auth }) {
    const features = [
        {
            icon: IconShoppingCart,
            title: 'Transaksi Cepat',
            description: 'Proses penjualan dengan cepat dan mudah. Scan barcode atau pencarian produk instan.',
            color: 'bg-blue-500'
        },
        {
            icon: IconReportAnalytics,
            title: 'Laporan Real-time',
            description: 'Pantau penjualan, keuntungan, dan performa bisnis Anda secara real-time.',
            color: 'bg-green-500'
        },
        {
            icon: IconUsers,
            title: 'Multi User & Role',
            description: 'Kelola tim dengan berbagai level akses: Admin, Manager, dan Kasir.',
            color: 'bg-purple-500'
        },
        {
            icon: IconBox,
            title: 'Manajemen Inventori',
            description: 'Lacak stok produk, pembelian, dan kelola kategori dengan mudah.',
            color: 'bg-orange-500'
        },
        {
            icon: IconReceipt,
            title: 'Cetak Invoice',
            description: 'Cetak struk dan invoice profesional langsung dari aplikasi.',
            color: 'bg-pink-500'
        },
        {
            icon: IconTruck,
            title: 'Manajemen Pembelian',
            description: 'Catat pembelian dari supplier lengkap dengan batch dan kadaluarsa.',
            color: 'bg-teal-500'
        }
    ];

    const stats = [
        { value: '99.9%', label: 'Uptime' },
        { value: '<1s', label: 'Response Time' },
        { value: '24/7', label: 'Support' },
        { value: '∞', label: 'Transaksi' }
    ];

    const techStack = [
        { name: 'Laravel 12', desc: 'Backend Framework' },
        { name: 'React', desc: 'Frontend Library' },
        { name: 'Inertia.js', desc: 'SPA Bridge' },
        { name: 'TailwindCSS', desc: 'Styling' },
        { name: 'MySQL', desc: 'Database' }
    ];

    return (
        <>
            <Head title="Welcome - Aplikasi Point of Sale" />

            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
                {/* NAVBAR */}
                <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                <IconCash className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                POS Pro
                            </span>
                        </div>

                        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                            <a href="#features" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                                Fitur
                            </a>
                            <a href="#tech" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                                Teknologi
                            </a>
                            <a href="#pricing" className="text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-colors">
                                Harga
                            </a>
                        </nav>

                        <div className="flex items-center gap-3">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="px-4 py-2 text-slate-700 dark:text-slate-300 text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    >
                                        Masuk
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                    >
                                        Daftar Gratis
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* HERO */}
                <section className="pt-32 pb-20 px-6">
                    <div className="mx-auto max-w-7xl">
                        <div className="text-center max-w-4xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                                <IconRocket size={16} />
                                <span>Versi 2.0 Telah Rilis!</span>
                            </div>

                            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight">
                                <span className="text-slate-900 dark:text-white">Kelola Bisnis</span>
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                                    Lebih Mudah
                                </span>
                            </h1>

                            <p className="mt-6 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                                Aplikasi Point of Sale modern untuk bisnis Anda.
                                Transaksi cepat, laporan lengkap, dan manajemen inventori dalam satu platform.
                            </p>

                            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/register"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-0.5 transition-all"
                                >
                                    Mulai Gratis
                                    <IconArrowRight size={20} />
                                </Link>
                                <a
                                    href="https://github.com/aryadwiputra/point-of-sales"
                                    target="_blank"
                                    className="inline-flex items-center justify-center gap-2 px-8 py-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-lg font-semibold text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all"
                                >
                                    <IconBrandGithub size={20} />
                                    Source Code
                                </a>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6">
                            {stats.map((stat, i) => (
                                <div key={i} className="text-center p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
                                    <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="mt-1 text-slate-600 dark:text-slate-400 font-medium">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FEATURES */}
                <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                                Fitur Lengkap untuk Bisnis Anda
                            </h2>
                            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Semua yang Anda butuhkan untuk mengelola toko dalam satu aplikasi
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {features.map((feature, i) => (
                                <div
                                    key={i}
                                    className="group p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TECH STACK */}
                <section id="tech" className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                                Teknologi Modern
                            </h2>
                            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Dibangun dengan stack teknologi terbaik untuk performa optimal
                            </p>
                        </div>

                        <div className="flex flex-wrap justify-center gap-6">
                            {techStack.map((tech, i) => (
                                <div
                                    key={i}
                                    className="px-8 py-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center hover:shadow-lg hover:-translate-y-1 transition-all"
                                >
                                    <div className="text-xl font-bold text-slate-900 dark:text-white">
                                        {tech.name}
                                    </div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        {tech.desc}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* PRICING */}
                <section id="pricing" className="py-24 bg-slate-50 dark:bg-slate-900/50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white">
                                Exclusive Price
                            </h2>
                            <p className="mt-4 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                                Open source dan Exclusive Price untuk digunakan. Tidak ada biaya tersembunyi.
                            </p>
                        </div>

                        <div className="max-w-lg mx-auto">
                            <div className="relative p-8 bg-white dark:bg-slate-800 rounded-3xl border-2 border-blue-500 shadow-xl shadow-blue-500/10">
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold rounded-full">
                                    Open Source
                                </div>

                                <div className="text-center mb-8">
                                    <div className="text-5xl font-bold text-slate-900 dark:text-white">
                                        Rp 0
                                    </div>
                                    <div className="text-slate-500 dark:text-slate-400 mt-2">
                                        Gratis selamanya
                                    </div>
                                </div>

                                <ul className="space-y-4 mb-8">
                                    {[
                                        'Transaksi unlimited',
                                        'Multi user & role',
                                        'Laporan lengkap',
                                        'Manajemen inventori',
                                        'Cetak invoice',
                                        'Support komunitas',
                                        'Update gratis',
                                        'Source code lengkap'
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                                            <div className="w-5 h-5 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                <IconCheck size={14} className="text-green-600 dark:text-green-400" />
                                            </div>
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/register"
                                    className="block w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-center font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all"
                                >
                                    Mulai Sekarang
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-24">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-12 md:p-20 text-center">
                            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnY0em0wLTZ2LTRoLTJ2NGgyem0tNiA2aC00djJoNHYtMnptMCAwdi00aC00djRoNHptLTYtNmgtNHYyaDR2LTJ6bTAgMHYtNGgtNHY0aDR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>
                            <div className="relative">
                                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                    Siap Mengembangkan Bisnis Anda?
                                </h2>
                                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                                    Bergabung sekarang dan rasakan kemudahan mengelola bisnis dengan aplikasi POS modern.
                                </p>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                                >
                                    Daftar Gratis Sekarang
                                    <IconArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="py-12 border-t border-slate-200 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <IconCash className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-slate-900 dark:text-white">
                                    POS Pro
                                </span>
                            </div>

                            <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
                                <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Fitur</a>
                                <a href="#tech" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Teknologi</a>
                                <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Harga</a>
                                <a href="https://github.com/aryadwiputra/point-of-sales" target="_blank" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                    GitHub
                                </a>
                            </div>

                            <p className="text-sm text-slate-500 dark:text-slate-500">
                                © {new Date().getFullYear()} POS Pro — Dibuat oleh sitikfatikhah
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
