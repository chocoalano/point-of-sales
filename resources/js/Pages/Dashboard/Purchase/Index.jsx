import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { Head, router } from "@inertiajs/react";
import Button from "@/Components/Dashboard/Button";
import {
    IconDatabaseOff,
    IconFilter,
    IconFilterOff,
    IconSearch,
    IconX,
    IconPlus,
    IconPencil,
    IconTrash,
    IconEye,
} from "@tabler/icons-react";
import Table from "@/Components/Dashboard/Table";
import Pagination from "@/Components/Dashboard/Pagination";
import Modal from "@/Components/Dashboard/Modal";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

export default function Index({ purchases, filters }) {
    const [showFilters, setShowFilters] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    const [filterData, setFilterData] = useState({
        search: filters?.search || "",
        supplier: filters?.supplier || "",
        status: filters?.status || "",
        date_from: filters?.date_from || "",
        date_to: filters?.date_to || "",
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilterData((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = () => {
        router.get(route("purchase.index"), filterData, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const resetFilters = () => {
        const emptyFilters = {
            search: "",
            supplier: "",
            status: "",
            date_from: "",
            date_to: "",
        };
        setFilterData(emptyFilters);
        router.get(
            route("purchase.index"),
            {},
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            applyFilters();
        }
    };

    const statusOptions = [
        { value: "", label: "Semua Status" },
        { value: "pending", label: "Pending" },
        { value: "paid", label: "Paid" },
        { value: "received", label: "Received" },
    ];

    const hasActiveFilters = Object.values(filterData).some((v) => v !== "");

    // Format currency
    const formatCurrency = (value) => {
        const num = Number(value);
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(isNaN(num) ? 0 : num);
    };

    // Handle delete
    const handleDelete = (purchase) => {
        Swal.fire({
            title: "Apakah Anda yakin?",
            text: `Hapus pembelian dari supplier "${
                purchase.supplier_name || "Unknown"
            }"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            customClass: {
                popup: "dark:bg-slate-900 dark:text-slate-100",
                title: "dark:text-slate-100",
                htmlContainer: "dark:text-slate-400",
            },
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route("purchase.destroy", purchase.id), {
                    onSuccess: () => {
                        toast.success("Data pembelian berhasil dihapus!");
                    },
                    onError: () => {
                        toast.error("Gagal menghapus data pembelian");
                    },
                });
            }
        });
    };

    // Handle view detail
    const handleViewDetail = (purchase) => {
        setSelectedPurchase(purchase);
        setShowDetailModal(true);
    };

    // Get status badge
    const getStatusBadge = (status) => {
        const statusConfig = {
            received:
                "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
            paid: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
            pending:
                "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        };
        return statusConfig[status] || statusConfig.pending;
    };

    // Calculate total for purchase
    const calculatePurchaseTotal = (purchase) => {
        if (!purchase?.items || purchase.items.length === 0) return 0;
        return purchase.items.reduce(
            (sum, item) => sum + (Number(item.total_price) || 0),
            0
        );
    };

    return (
        <>
            <Head title="Pembelian" />

            <div className="mb-4 space-y-4">
                {/* Header dengan tombol dan search */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <Button
                        type="link"
                        href={route("purchase.create")}
                        variant="primary"
                        icon={<IconPlus size={18} />}
                        label="Tambah Pembelian"
                    />
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1 md:w-80">
                            <input
                                type="text"
                                name="search"
                                value={filterData.search}
                                onChange={handleFilterChange}
                                onKeyDown={handleKeyDown}
                                placeholder="Cari invoice atau supplier..."
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 placeholder-slate-400 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 dark:placeholder-slate-500 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-200"
                            />
                            <IconSearch
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
                            />
                            {filterData.search && (
                                <button
                                    onClick={() => {
                                        setFilterData((prev) => ({
                                            ...prev,
                                            search: "",
                                        }));
                                    }}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                                >
                                    <IconX size={16} />
                                </button>
                            )}
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border transition-colors duration-200 ${
                                showFilters || hasActiveFilters
                                    ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-400"
                                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700"
                            }`}
                        >
                            <IconFilter size={18} />
                            <span className="hidden sm:inline">Filter</span>
                            {hasActiveFilters && (
                                <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-500 text-white rounded-full">
                                    {
                                        Object.values(filterData).filter(
                                            (v) => v !== ""
                                        ).length
                                    }
                                </span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="p-4 rounded-lg border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Supplier Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Supplier
                                </label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={filterData.supplier}
                                    onChange={handleFilterChange}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Nama supplier..."
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={filterData.status}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                >
                                    {statusOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Date From */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Dari Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="date_from"
                                    value={filterData.date_from}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>

                            {/* Date To */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                    Sampai Tanggal
                                </label>
                                <input
                                    type="date"
                                    name="date_to"
                                    value={filterData.date_to}
                                    onChange={handleFilterChange}
                                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white text-slate-900 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors duration-200"
                                />
                            </div>
                        </div>

                        {/* Filter Actions */}
                        <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={resetFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors duration-200"
                            >
                                <IconFilterOff size={16} />
                                Reset
                            </button>
                            <button
                                onClick={applyFilters}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-200"
                            >
                                <IconSearch size={16} />
                                Terapkan
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Table */}
            <Table.Card title="Data Pembelian">
                <Table>
                    <Table.Thead>
                        <tr>
                            <Table.Th className="w-10 text-center">No</Table.Th>
                            <Table.Th className="min-w-[120px]">
                                Reference
                            </Table.Th>
                            <Table.Th className="min-w-[150px]">
                                Supplier
                            </Table.Th>
                            <Table.Th className="text-center">Tanggal</Table.Th>
                            <Table.Th className="text-center">Items</Table.Th>
                            <Table.Th className="text-right">Total</Table.Th>
                            <Table.Th className="text-center">Status</Table.Th>
                            <Table.Th className="text-center">PPN</Table.Th>
                            <Table.Th className="text-center w-32">
                                Aksi
                            </Table.Th>
                        </tr>
                    </Table.Thead>

                    <Table.Tbody>
                        {purchases?.data?.length ? (
                            purchases.data.map((purchase, i) => (
                                <tr
                                    key={purchase.id}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors duration-150"
                                >
                                    <Table.Td className="text-center">
                                        {i +
                                            1 +
                                            (purchases.current_page - 1) *
                                                purchases.per_page}
                                    </Table.Td>
                                    <Table.Td className="font-mono text-sm">
                                        {purchase.reference || "-"}
                                    </Table.Td>
                                    <Table.Td>
                                        {purchase.supplier_name || "-"}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        {purchase.purchase_date || "-"}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300">
                                            {purchase.items?.length || 0} item
                                        </span>
                                    </Table.Td>
                                    <Table.Td className="text-right font-medium">
                                        {formatCurrency(
                                            calculatePurchaseTotal(purchase)
                                        )}
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <span
                                            className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                                                purchase.status
                                            )}`}
                                        >
                                            {purchase.status || "pending"}
                                        </span>
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                purchase.tax_included
                                                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                                                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400"
                                            }`}
                                        >
                                            {purchase.tax_included
                                                ? "Ya"
                                                : "Tidak"}
                                        </span>
                                    </Table.Td>
                                    <Table.Td className="text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <button
                                                onClick={() =>
                                                    handleViewDetail(purchase)
                                                }
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:text-slate-400 dark:hover:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <IconEye size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    router.visit(
                                                        route(
                                                            "purchase.edit",
                                                            purchase.id
                                                        )
                                                    )
                                                }
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:text-slate-400 dark:hover:text-amber-400 dark:hover:bg-amber-900/30 transition-colors"
                                                title="Edit"
                                            >
                                                <IconPencil size={18} />
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleDelete(purchase)
                                                }
                                                className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-900/30 transition-colors"
                                                title="Hapus"
                                            >
                                                <IconTrash size={18} />
                                            </button>
                                        </div>
                                    </Table.Td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <Table.Td
                                    colSpan={9}
                                    className="text-center py-12"
                                >
                                    <IconDatabaseOff
                                        size={48}
                                        className="mx-auto text-slate-300 dark:text-slate-600"
                                    />
                                    <p className="text-slate-500 dark:text-slate-400 mt-3">
                                        Tidak ada data pembelian
                                    </p>
                                    {hasActiveFilters && (
                                        <button
                                            onClick={resetFilters}
                                            className="mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                        >
                                            Reset filter
                                        </button>
                                    )}
                                </Table.Td>
                            </tr>
                        )}
                    </Table.Tbody>
                </Table>
                <div className="px-4 pb-4">
                    <Pagination meta={purchases} />
                </div>
            </Table.Card>

            {/* Detail Modal */}
            <Modal
                show={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedPurchase(null);
                }}
                title="Detail Pembelian"
                maxWidth="4xl"
            >
                {selectedPurchase && (
                    <div className="space-y-6">
                        {/* Purchase Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Reference
                                </p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {selectedPurchase.reference || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Supplier
                                </p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {selectedPurchase.supplier_name || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Tanggal
                                </p>
                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                    {selectedPurchase.purchase_date || "-"}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Status
                                </p>
                                <span
                                    className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadge(
                                        selectedPurchase.status
                                    )}`}
                                >
                                    {selectedPurchase.status || "pending"}
                                </span>
                            </div>
                        </div>

                        {/* Notes */}
                        {selectedPurchase.notes && (
                            <div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Catatan
                                </p>
                                <p className="text-slate-900 dark:text-slate-100">
                                    {selectedPurchase.notes}
                                </p>
                            </div>
                        )}

                        {/* Items Table */}
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                                Detail Item (
                                {selectedPurchase.items?.length || 0} item)
                            </h4>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-700">
                                            <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Barcode
                                            </th>
                                            <th className="text-left py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Produk
                                            </th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Qty
                                            </th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Harga
                                            </th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Diskon
                                            </th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                PPN
                                            </th>
                                            <th className="text-right py-2 px-3 font-medium text-slate-700 dark:text-slate-300">
                                                Total
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedPurchase.items?.map(
                                            (item, idx) => (
                                                <tr
                                                    key={idx}
                                                    className="border-b border-slate-100 dark:border-slate-800"
                                                >
                                                    <td className="py-2 px-3 font-mono text-slate-900 dark:text-slate-100">
                                                        {item.barcode || "-"}
                                                    </td>
                                                    <td className="py-2 px-3 text-slate-900 dark:text-slate-100">
                                                        {item.product
                                                            ?.description ||
                                                            item.description ||
                                                            "-"}
                                                    </td>
                                                    <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                                                        {Number(item.quantity) || 0}
                                                    </td>
                                                    <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(
                                                            Number(item.purchase_price) || 0
                                                        )}
                                                    </td>
                                                    <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                                                        {Number(item.discount_percent) || 0}%
                                                    </td>
                                                    <td className="py-2 px-3 text-right text-slate-900 dark:text-slate-100">
                                                        {Number(item.tax_percent) || 0}%
                                                    </td>
                                                    <td className="py-2 px-3 text-right font-medium text-slate-900 dark:text-slate-100">
                                                        {formatCurrency(
                                                            Number(item.total_price) || 0
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                    <tfoot>
                                        <tr className="border-t-2 border-slate-200 dark:border-slate-700">
                                            <td
                                                colSpan={6}
                                                className="py-3 px-3 text-right font-semibold text-slate-700 dark:text-slate-300"
                                            >
                                                Grand Total:
                                            </td>
                                            <td className="py-3 px-3 text-right font-bold text-lg text-slate-900 dark:text-slate-100">
                                                {formatCurrency(
                                                    calculatePurchaseTotal(
                                                        selectedPurchase
                                                    )
                                                )}
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    setSelectedPurchase(null);
                                }}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={() => {
                                    setShowDetailModal(false);
                                    router.visit(
                                        route(
                                            "purchase.edit",
                                            selectedPurchase.id
                                        )
                                    );
                                }}
                                className="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            >
                                Edit Pembelian
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}

Index.layout = (page) => <DashboardLayout>{page}</DashboardLayout>;
Index.permissions = ["purchase-access"];
Index.roles = ["Admin", "Manager"];
