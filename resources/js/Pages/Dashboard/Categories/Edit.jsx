import React from 'react'
import DashboardLayout from '@/Layouts/DashboardLayout'
import { Head, useForm, usePage } from '@inertiajs/react'
import Card from '@/Components/Dashboard/Card'
import Button from '@/Components/Dashboard/Button'
import { IconPencilPlus, IconUsersPlus } from '@tabler/icons-react'
import Input from '@/Components/Dashboard/Input'
import Textarea from '@/Components/Dashboard/TextArea'
import toast from 'react-hot-toast'

export default function Create({ category }) {

    const { errors } = usePage().props

    const { data, setData, post, processing } = useForm({
        id: category.id,
        name: category.name,
        description: category.description,
        image: '',
        _method: 'PUT',
    })

    const handleImageChange = (e) => {
        const image = e.target.files[0]
        setData('image', image)
    }

    const submit = (e) => {
        e.preventDefault()
        post(route('categories.update', category.id), {
            onSuccess: () => {
                if (Object.keys(errors).length === 0) {
                    toast('Data berhasil diubah', {
                        icon: '👏',
                        style: {
                            borderRadius: '10px',
                            background: '#1C1F29',
                            color: '#fff',
                        },
                    })
                }
            },
            onError: () => {
                toast('Terjadi kesalahan dalam penyimpanan data', {
                    style: {
                        borderRadius: '10px',
                        background: '#FF0000',
                        color: '#fff',
                    },
                })
            },
        })
    }

    return (
        <>
            <Head title='Edit Data Kategori' />
            <Card
                title={'Edit Kategori'}
                icon={<IconUsersPlus size={20} strokeWidth={1.5} />}
                footer={
                    <Button
                        type={'submit'}
                        label={'Simpan'}
                        variant={'primary'}
                        icon={<IconPencilPlus size={20} strokeWidth={1.5} />}
                        disabled={processing}
                    />
                }
                form={submit}
            >
                <div className='grid grid-cols-12 gap-4'>
                    <div className='col-span-12'>
                        <Input
                            name='image'
                            label={'Gambar'}
                            type={'file'}
                            errors={errors.image}
                            onChange={handleImageChange}
                        />
                    </div>
                    <div className='col-span-12'>
                        <Input
                            name='name'
                            label={'Nama Kategori'}
                            type={'text'}
                            placeholder={'Masukkan nama kategori'}
                            errors={errors.name}
                            onChange={e => setData('name', e.target.value)}
                            value={data.name}
                        />
                    </div>
                    <div className='col-span-12'>
                        <Textarea
                            name='description'
                            label={'Deskripsi'}
                            placeholder={'Deskripsi kategori (opsional)'}
                            errors={errors.description}
                            onChange={e => setData('description', e.target.value)}
                            value={data.description}
                        />
                    </div>
                </div>
            </Card>
        </>
    )
}

Create.layout = page => <DashboardLayout children={page} />
