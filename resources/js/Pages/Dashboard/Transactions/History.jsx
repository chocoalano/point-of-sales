import React, { useEffect, useState } from "react";
import { Head, router } from "@inertiajs/react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import Card from "@/Components/Dashboard/Card";
import Input from "@/Components/Dashboard/Input";
import Button from "@/Components/Dashboard/Button";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import {
    IconDatabaseOff,
    IconSearch,
    IconClockHour6,
    IconEye,
} from "@tabler/icons-react";

const defaultFilters = {
    invoice: "",
    start_date: "",
    end_date: "",
};

// Helper to sanitize filter values (convert null/undefined to empty string)
const sanitizeFilters = (filters) => {
    const sanitized = { ...defaultFilters };
    if (filters) {
        Object.keys(defaultFilters).forEach((key) => {
            sanitized[key] = filters[key] ?? "";
        });
    }
    return sanitized;
};

const formatCurrency = (value = 0) =>
    new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);

const History = ({ transactions, filters }) => {
    const [filterData, setFilterData] = useState(() => sanitizeFilters(filters));

    useEffect(() => {
        setFilterData(sanitizeFilters(filters));
    }, [filters]);

    const handleChange = (field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = (event) => {
        event.preventDefault();
        router.get(route("transactions.history"), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route("transactions.history"), defaultFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const rows = transactions?.data ?? [];
    const links = transactions?.links ?? [];
    const currentPage = transactions?.current_page ?? 1;
    const perPage = transactions?.per_page
        ? Number(transactions?.per_page)
        : rows.length || 1;

    return (
        <>
            <Head title="Riwayat Transaksi" />
            <div className="space-y-6">
                <Card
                    title="Filter Riwayat"
                    icon={<IconClockHour6 size={18} />}
                    form={applyFilters}
                    footer={
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                label="Reset"
                                variant="outline"
                                onClick={resetFilters}
                            />
                            <Button
                                type="submit"
                                label="Cari"
                                icon={<IconSearch size={18} />}
                                variant="primary"
                            />
                        </div>
                    }
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Input
                            type="text"
                            label="Nomor Invoice"
                            placeholder="Contoh: TRX-"
                            value={filterData.invoice}
                            onChange={(event) =>
                                handleChange("invoice", event.target.value)
                            }
                        />
                        <Input
                            type="date"
                            label="Tanggal Mulai"
                            value={filterData.start_date}
                            onChange={(event) =>
                                handleChange("start_date", event.target.value)
                            }
                        />
                        <Input
                            type="date"
                            label="Tanggal Selesai"
                            value={filterData.end_date}
                            onChange={(event) =>
                                handleChange("end_date", event.target.value)
                            }
                        />
                    </div>
                </Card>

                <Table.Card title="Riwayat Transaksi">
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className="w-16 text-center">
                                    No
                                </Table.Th>
                                <Table.Th>Invoice</Table.Th>
                                <Table.Th>Tanggal</Table.Th>
                                <Table.Th>Kasir</Table.Th>
                                <Table.Th>Pelanggan</Table.Th>
                                <Table.Th className="text-center">
                                    Item
                                </Table.Th>
                                <Table.Th className="text-right">
                                    Diskon
                                </Table.Th>
                                <Table.Th className="text-right">
                                    Total
                                </Table.Th>
                                <Table.Th className="text-right">
                                    Profit
                                </Table.Th>
                                <Table.Th className="w-24 text-center">
                                    Aksi
                                </Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length ? (
                                rows.map((transaction, index) => (
                                    <tr
                                        key={transaction.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-900"
                                    >
                                        <Table.Td className="text-center">
                                            {index +
                                                1 +
                                                (currentPage - 1) * perPage}
                                        </Table.Td>
                                        <Table.Td className="font-semibold text-gray-900 dark:text-gray-100">
                                            {transaction.invoice}
                                        </Table.Td>
                                        <Table.Td>
                                            {transaction.created_at}
                                        </Table.Td>
                                        <Table.Td>
                                            {transaction.cashier?.name ?? "-"}
                                        </Table.Td>
                                        <Table.Td>
                                            {transaction.customer?.name ?? "-"}
                                        </Table.Td>
                                        <Table.Td className="text-center">
                                            {transaction.total_items ?? 0}
                                        </Table.Td>
                                        <Table.Td className="text-right">
                                            {formatCurrency(
                                                transaction.discount ?? 0
                                            )}
                                        </Table.Td>
                                        <Table.Td className="text-right font-semibold text-gray-900 dark:text-gray-100">
                                            {formatCurrency(
                                                transaction.grand_total ?? 0
                                            )}
                                        </Table.Td>
                                        <Table.Td className="text-right text-emerald-500">
                                            {formatCurrency(
                                                transaction.total_profit ?? 0
                                            )}
                                        </Table.Td>
                                        <Table.Td className="text-center">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                icon={<IconEye size={16} />}
                                                onClick={() =>
                                                    router.get(
                                                        route(
                                                            "transactions.show",
                                                            transaction.invoice
                                                        )
                                                    )
                                                }
                                            />
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty
                                    colSpan={10}
                                    message={
                                        <div className="text-gray-500">
                                            <IconDatabaseOff
                                                size={30}
                                                className="mx-auto mb-2 text-gray-400"
                                            />
                                            Belum ada transaksi sesuai filter.
                                        </div>
                                    }
                                />
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                {links.length > 0 && <Pagination links={links} />}
            </div>
        </>
    );
};

History.layout = (page) => <DashboardLayout children={page} />;

export default History;
