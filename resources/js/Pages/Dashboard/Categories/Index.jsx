import React, { useState, useEffect } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, usePage, router } from '@inertiajs/react'
import Button from '@/Components/Dashboard/Button'
import Input from '@/Components/Dashboard/Input'
import Card from '@/Components/Dashboard/Card'
import {
    IconCirclePlus,
    IconDatabaseOff,
    IconPencilCog,
    IconTrash,
    IconSearch,
    IconFilter,
    IconFilterOff,
    IconCategory,
    IconEye,
} from '@tabler/icons-react'
import Table from '@/Components/Dashboard/Table'
import Pagination from '@/Components/Dashboard/Pagination'

const defaultFilters = {
    search: '',
    per_page: '10',
};

// Helper to sanitize filter values
const sanitizeFilters = (filters) => {
    const sanitized = { ...defaultFilters };
    if (filters) {
        Object.keys(defaultFilters).forEach((key) => {
            sanitized[key] = filters[key] ?? defaultFilters[key];
        });
    }
    return sanitized;
};

export default function Index({ categories, filters }) {
    const { roles, permissions, errors } = usePage().props;
    const [filterData, setFilterData] = useState(() => sanitizeFilters(filters));
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        setFilterData(sanitizeFilters(filters));
    }, [filters]);

    const handleFilterChange = (field, value) => {
        setFilterData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = (e) => {
        e?.preventDefault();
        router.get(route('categories.index'), filterData, {
            preserveScroll: true,
            preserveState: true,
        });
    };

    const resetFilters = () => {
        setFilterData(defaultFilters);
        router.get(route('categories.index'), defaultFilters, {
            preserveScroll: true,
            preserveState: true,
            replace: true,
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            applyFilters();
        }
    };

    const hasActiveFilters = filterData.search !== '';

    const rows = categories?.data ?? [];
    const links = categories?.links ?? [];
    const currentPage = categories?.current_page ?? 1;
    const perPage = categories?.per_page ? Number(categories.per_page) : 10;
    const total = categories?.total ?? 0;
    const from = categories?.from ?? 0;
    const to = categories?.to ?? 0;

    return (
        <>
            <Head title='Kategori' />
            <div className='space-y-4'>
                {/* Filter Section */}
                <Card
                    title="Filter Data Kategori"
                    icon={<IconFilter size={18} />}
                    form={applyFilters}
                    footer={
                        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {total > 0 ? (
                                    <>Menampilkan {from} - {to} dari {total} data</>
                                ) : (
                                    <>Tidak ada data</>
                                )}
                            </div>
                            <div className="flex flex-col gap-2 sm:flex-row">
                                {hasActiveFilters && (
                                    <Button
                                        type="button"
                                        label="Reset Filter"
                                        variant="outline"
                                        icon={<IconFilterOff size={18} />}
                                        onClick={resetFilters}
                                    />
                                )}
                                <Button
                                    type="submit"
                                    label="Cari"
                                    icon={<IconSearch size={18} />}
                                    variant="primary"
                                />
                            </div>
                        </div>
                    }
                >
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="lg:col-span-2">
                            <Input
                                type="text"
                                label="Cari Kategori"
                                placeholder="Masukkan nama kategori..."
                                value={filterData.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Data per Halaman
                            </label>
                            <select
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500 transition-colors"
                                value={filterData.per_page}
                                onChange={(e) => handleFilterChange('per_page', e.target.value)}
                            >
                                <option value="5">5</option>
                                <option value="10">10</option>
                                <option value="25">25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div className="flex items-end">
                            <Button
                                type="link"
                                icon={<IconCirclePlus size={20} strokeWidth={1.5} />}
                                variant="primary"
                                label="Tambah Kategori"
                                href={route('categories.create')}
                                className="w-full"
                            />
                        </div>
                    </div>
                </Card>

                {/* Table Section */}
                <Table.Card title="Data Kategori" icon={<IconCategory size={18} />}>
                    <Table>
                        <Table.Thead>
                            <tr>
                                <Table.Th className='w-16 text-center'>No</Table.Th>
                                <Table.Th className='w-24'>Gambar</Table.Th>
                                <Table.Th>Nama Kategori</Table.Th>
                                <Table.Th>Deskripsi</Table.Th>
                                <Table.Th className='w-32 text-center'>Aksi</Table.Th>
                            </tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {rows.length ? (
                                rows.map((category, index) => (
                                    <tr className='hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors' key={category.id}>
                                        <Table.Td className='text-center font-medium'>
                                            {index + 1 + (currentPage - 1) * perPage}
                                        </Table.Td>
                                        <Table.Td>
                                            {category.image ? (
                                                <img
                                                    src={category.image}
                                                    alt={category.name}
                                                    className='w-14 h-14 object-cover rounded-lg border border-gray-200 dark:border-gray-700'
                                                />
                                            ) : (
                                                <div className='w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600'>
                                                    <IconCategory size={24} className='text-gray-400 dark:text-gray-500' />
                                                </div>
                                            )}
                                        </Table.Td>
                                        <Table.Td className='font-semibold text-gray-900 dark:text-gray-100'>
                                            {category.name}
                                        </Table.Td>
                                        <Table.Td className='text-gray-600 dark:text-gray-400'>
                                            {category.description || (
                                                <span className='text-gray-400 dark:text-gray-500 italic'>Tidak ada deskripsi</span>
                                            )}
                                        </Table.Td>
                                        <Table.Td>
                                            <div className='flex justify-center gap-2'>
                                                <Button
                                                    type="link"
                                                    icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                                                    variant="warning"
                                                    href={route('categories.edit', category.id)}
                                                    title="Edit"
                                                />
                                                <Button
                                                    type="delete"
                                                    icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                    variant="danger"
                                                    url={route('categories.destroy', category.id)}
                                                    title="Hapus"
                                                />
                                            </div>
                                        </Table.Td>
                                    </tr>
                                ))
                            ) : (
                                <Table.Empty
                                    colSpan={5}
                                    message={
                                        <div className='flex flex-col items-center justify-center py-8'>
                                            <IconDatabaseOff size={48} strokeWidth={1.5} className='text-gray-300 dark:text-gray-600 mb-3' />
                                            <p className='text-gray-500 dark:text-gray-400 font-medium mb-1'>
                                                Data Kategori Tidak Ditemukan
                                            </p>
                                            <p className='text-gray-400 dark:text-gray-500 text-sm'>
                                                {hasActiveFilters
                                                    ? 'Coba ubah filter pencarian Anda'
                                                    : 'Belum ada data kategori. Silakan tambah kategori baru.'}
                                            </p>
                                            {hasActiveFilters && (
                                                <Button
                                                    type="button"
                                                    label="Reset Filter"
                                                    variant="outline"
                                                    icon={<IconFilterOff size={16} />}
                                                    onClick={resetFilters}
                                                    className="mt-3"
                                                />
                                            )}
                                        </div>
                                    }
                                />
                            )}
                        </Table.Tbody>
                    </Table>
                </Table.Card>

                {/* Pagination */}
                {links.length > 3 && <Pagination links={links} />}
            </div>
        </>
    )
}

Index.layout = page => <DashboardLayout children={page} />
