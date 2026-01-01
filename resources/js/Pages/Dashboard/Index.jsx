import Widget from "@/Components/Dashboard/Widget";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useMemo, useRef } from "react";
import Chart from "chart.js/auto";
import {
    IconBox,
    IconCategory,
    IconMoneybag,
    IconUsers,
    IconCoin,
    IconReceipt,
} from "@tabler/icons-react";

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

export default function Dashboard({
    totalCategories,
    totalProducts,
    totalTransactions,
    totalUsers,
    revenueTrend,
    totalRevenue,
    totalProfit,
    averageOrder,
    todayTransactions,
    topProducts = [],
    recentTransactions = [],
    topCustomers = [],
}) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    const chartData = useMemo(() => revenueTrend ?? [], [revenueTrend]);

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartInstance.current) {
            chartInstance.current.destroy();
            chartInstance.current = null;
        }

        if (!chartData.length) {
            return;
        }

        const labels = chartData.map((item) => item.label);
        const totals = chartData.map((item) => item.total);

        chartInstance.current = new Chart(chartRef.current, {
            type: "line",
            data: {
                labels,
                datasets: [
                    {
                        label: "Pendapatan",
                        data: totals,
                        borderColor: "#4f46e5",
                        backgroundColor: "rgba(79,70,229,0.2)",
                        borderWidth: 2,
                        fill: true,
                        tension: 0.35,
                        pointRadius: 3,
                        pointBackgroundColor: "#4f46e5",
                    },
                ],
            },
            options: {
                plugins: {
                    legend: {
                        display: false,
                    },
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) =>
                                new Intl.NumberFormat("id-ID", {
                                    style: "currency",
                                    currency: "IDR",
                                    maximumFractionDigits: 0,
                                }).format(value),
                        },
                        grid: {
                            color: "rgba(148, 163, 184, 0.2)",
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                },
            },
        });

        return () => {
            chartInstance.current?.destroy();
        };
    }, [chartData]);

    return (
        <>
            <Head title="Dashboard" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <Widget
                    title="Kategori"
                    subtitle="Total Kategori"
                    color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    icon={<IconCategory size={22} strokeWidth={1.5} />}
                    total={totalCategories}
                />

                <Widget
                    title="Produk"
                    subtitle="Total Produk"
                    color="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
                    icon={<IconBox size={22} strokeWidth={1.5} />}
                    total={totalProducts}
                />

                <Widget
                    title="Transaksi"
                    subtitle="Total Transaksi"
                    color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
                    icon={<IconMoneybag size={22} strokeWidth={1.5} />}
                    total={totalTransactions}
                />

                <Widget
                    title="Pengguna"
                    subtitle="Total Pengguna"
                    color="bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400"
                    icon={<IconUsers size={22} strokeWidth={1.5} />}
                    total={totalUsers}
                />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Pendapatan</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(totalRevenue)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-2">
                        <IconCoin size={16} /> Akumulasi seluruh transaksi
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Total Profit</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(totalProfit)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-2">
                        <IconMoneybag size={16} /> Profit bersih tercatat
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Rata-Rata Order</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {formatCurrency(averageOrder)}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-2">
                        <IconReceipt size={16} /> Per transaksi
                    </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <p className="text-sm text-slate-500 dark:text-slate-400">Transaksi Hari Ini</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
                        {todayTransactions}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 mt-2">
                        <IconUsers size={16} /> Update harian
                    </p>
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                Tren Pendapatan
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                12 data transaksi terakhir
                            </p>
                        </div>
                    </div>
                    <div className="mt-4">
                        {chartData.length ? (
                            <canvas ref={chartRef} height={200}></canvas>
                        ) : (
                            <div className="flex h-40 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                                Belum ada data pendapatan untuk ditampilkan.
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Top Produk Terlaris
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Berdasarkan total penjualan sepanjang waktu
                    </p>
                    {topProducts.length ? (
                        <ul className="space-y-3">
                            {topProducts.map((product, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {product.quantity} item
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        {formatCurrency(product.total)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada data produk.
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Transaksi Terbaru
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        5 transaksi terakhir
                    </p>
                    {recentTransactions.length ? (
                        <div className="space-y-3">
                            {recentTransactions.map((trx, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {trx.invoice}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {trx.date} • {trx.customer}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Kasir: {trx.cashier}
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        {formatCurrency(trx.total)}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada transaksi.
                        </div>
                    )}
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        Pelanggan Terbaik
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                        Berdasarkan nilai pembelian
                    </p>
                    {topCustomers.length ? (
                        <ul className="space-y-3">
                            {topCustomers.map((customer, index) => (
                                <li
                                    key={index}
                                    className="flex items-center justify-between text-sm p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                                >
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">
                                            {customer.name}
                                        </p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            {customer.orders} transaksi
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                        {formatCurrency(customer.total)}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex h-40 items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                            Belum ada data pelanggan.
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = (page) => <DashboardLayout children={page} />;
