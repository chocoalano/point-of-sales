import React, { useState } from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import Card from '@/Components/Dashboard/Card'
import Button from '@/Components/Dashboard/Button'
import { IconPencilPlus, IconPackage } from '@tabler/icons-react'
import Input from '@/Components/Dashboard/Input'
import Textarea from '@/Components/Dashboard/TextArea'
import InputSelect from '@/Components/Dashboard/InputSelect'
import toast from 'react-hot-toast'

export default function Create({ categories }) {
    const { errors } = usePage().props

    const { data, setData, post, processing, reset } = useForm({
        image: null,
        barcode: '',
        title: '',
        description: '',
        category_id: '',
        buy_price: '',
        sell_price: '',
        stock: '',
    })

    const [selectedCategory, setSelectedCategory] = useState(null)

    const handleSelectCategory = (value) => {
        setSelectedCategory(value)
        setData('category_id', value?.id ?? '')
    }

    const handleImageChange = (e) => {
        setData('image', e.target.files[0])
    }

    const submit = (e) => {
        e.preventDefault()
        post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Produk berhasil disimpan 🎉')
                reset()
                setSelectedCategory(null)
            },
            onError: () => {
                toast.error('Gagal menyimpan produk')
            },
        })
    }

    return (
        <>
            <Head title="Tambah Produk" />

            <Card
                title="Tambah Produk"
                icon={<IconPackage size={20} strokeWidth={1.5} />}
                footer={
                    <Button
                        type="submit"
                        variant="primary"
                        label={processing ? 'Menyimpan...' : 'Simpan'}
                        disabled={processing}
                        icon={<IconPencilPlus size={20} strokeWidth={1.5} />}
                    />
                }
                form={submit}
            >
                <div className="grid grid-cols-12 gap-4">
                    {/* Upload Gambar */}
                    <div className="col-span-12">
                        <Input
                            type="file"
                            label="Gambar Produk"
                            onChange={handleImageChange}
                            errors={errors.image}
                        />
                    </div>

                    {/* Kategori */}
                    <div className="col-span-12">
                        <InputSelect
                            label="Kategori"
                            data={categories ?? []}
                            selected={selectedCategory}
                            setSelected={handleSelectCategory}
                            placeholder="Pilih kategori"
                            displayKey="name"
                            searchable
                            errors={errors.category_id}
                        />
                    </div>

                    {/* Barcode */}
                    <div className="col-span-12">
                        <Input
                            type="text"
                            label="Kode Produk/Barcode"
                            placeholder="Masukkan barcode produk"
                            value={data.barcode}
                            onChange={e => setData('barcode', e.target.value)}
                            errors={errors.barcode}
                        />
                    </div>

                    {/* Nama Produk */}
                    <div className="col-span-12 md:col-span-6">
                        <Input
                            type="text"
                            label="Nama Produk"
                            placeholder="Masukkan nama produk"
                            value={data.title}
                            onChange={e => setData('title', e.target.value)}
                            errors={errors.title}
                        />
                    </div>

                    {/* Stok */}
                    <div className="col-span-12 md:col-span-6">
                        <Input
                            type="number"
                            label="Stok"
                            placeholder="0"
                            min={0}
                            value={data.stock}
                            onChange={e => setData('stock', e.target.value)}
                            errors={errors.stock}
                        />
                    </div>

                    {/* Deskripsi */}
                    <div className="col-span-12">
                        <Textarea
                            label="Deskripsi"
                            placeholder="Deskripsi produk"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            errors={errors.description}
                        />
                    </div>

                    {/* Harga Beli */}
                    <div className="col-span-12 md:col-span-6">
                        <Input
                            type="number"
                            label="Harga Beli"
                            placeholder="0"
                            min={0}
                            value={data.buy_price}
                            onChange={e => setData('buy_price', e.target.value)}
                            errors={errors.buy_price}
                        />
                    </div>

                    {/* Harga Jual */}
                    <div className="col-span-12 md:col-span-6">
                        <Input
                            type="number"
                            label="Harga Jual"
                            placeholder="0"
                            min={0}
                            value={data.sell_price}
                            onChange={e => setData('sell_price', e.target.value)}
                            errors={errors.sell_price}
                        />
                    </div>
                </div>
            </Card>
        </>
    )
}

Create.layout = page => <DashboardLayout>{page}</DashboardLayout>
