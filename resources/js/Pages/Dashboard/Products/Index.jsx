import React from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, usePage } from '@inertiajs/react'
import Button from '@/Components/Dashboard/Button'
import { IconCirclePlus, IconDatabaseOff, IconPencilCog, IconTrash } from '@tabler/icons-react'
import Search from '@/Components/Dashboard/Search'
import Table from '@/Components/Dashboard/Table'
import Pagination from '@/Components/Dashboard/Pagination'
import Barcode from '@/Components/Dashboard/Barcode'

export default function Index({ products }) {
    const { roles, permissions, errors, } = usePage().props;

    return (
        <>
            <Head title='Produk' />
            <div className='mb-4'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                    <Button
                        type={'link'}
                        icon={<IconCirclePlus size={20} strokeWidth={1.5} />}
                        variant='primary'
                        label={'Tambah Data Produk'}
                        href={route('products.create')}
                    />
                    <div className='w-full sm:w-80'>
                        <Search
                            url={route('products.index')}
                            placeholder='Cari data berdasarkan nama produk...'
                        />
                    </div>
                </div>
            </div>
            <Table.Card title={'Data Produk'}>
                <Table>
                    <Table.Thead>
                        <tr>
                            <Table.Th className='w-10'>No</Table.Th>
                            <Table.Th>Kode</Table.Th>
                            <Table.Th>Kategori</Table.Th>
                            <Table.Th>Nama</Table.Th>
                            <Table.Th>Harga Beli</Table.Th>
                            <Table.Th>Harga Jual</Table.Th>
                            <Table.Th>Stok</Table.Th>
                            <Table.Th className='w-24'>Aksi</Table.Th>
                        </tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {products.data.length ?
                            products.data.map((product, i) => (
                                <tr className='hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors' key={i}>
                                    <Table.Td className='text-center'>
                                        {++i + (products.current_page - 1) * products.per_page}
                                    </Table.Td>
                                    <Table.Td>
                                        <Barcode
                                            value={product.barcode}
                                            format={'CODE39'}
                                            width={2}
                                            height={20}
                                            lineColor={'#000'}
                                        />
                                    </Table.Td>
                                    <Table.Td>{product.category.name}</Table.Td>
                                    <Table.Td>{product.description}</Table.Td>
                                    <Table.Td>{product.buy_price}</Table.Td>
                                    <Table.Td>{product.sell_price}</Table.Td>
                                    <Table.Td>{product.stock}</Table.Td>
                                    <Table.Td>
                                        <div className='flex gap-2'>
                                            <Button
                                                type={'edit'}
                                                icon={<IconPencilCog size={16} strokeWidth={1.5} />}
                                                variant='warning'
                                                size='sm'
                                                href={route('products.edit', product.id)}
                                            />
                                            <Button
                                                type={'delete'}
                                                icon={<IconTrash size={16} strokeWidth={1.5} />}
                                                variant='danger'
                                                size='sm'
                                                url={route('products.destroy', product.id)}
                                            />
                                        </div>
                                    </Table.Td>
                                </tr>
                            )) :
                            <Table.Empty colSpan={8} message={
                                <span className='text-slate-500 dark:text-slate-400'>
                                    Data Produk <span className='text-rose-500 font-medium'>tidak ditemukan.</span>
                                </span>
                            }>
                                <IconDatabaseOff size={28} strokeWidth={1.5} className='text-slate-400 dark:text-slate-500' />
                            </Table.Empty>
                        }
                    </Table.Tbody>
                </Table>
            </Table.Card>
            {products.last_page !== 1 && (<Pagination links={products.links} />)}
        </>
    )
}

Index.layout = page => <DashboardLayout children={page} />
