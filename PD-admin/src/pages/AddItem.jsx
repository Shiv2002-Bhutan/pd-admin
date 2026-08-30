import React, { useState } from 'react'
import { X, Upload, Package } from 'lucide-react'

const AddItem = ({ onClose, onAdd }) => {

    const [form, setForm] = useState({
        name: '',
        category: 'Furniture',
        subCategory: '',
        brand: '',
        price: '',
        stock: '',
        lowStockThreshold: ''
    })

    const [image, setImage] = useState('')

    const categories = [
        'King Koil',
        'Furniture',
        'Clothing',
        'Mattresses'
    ]

    const handleChange = (e) => {

        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImage = (e) => {

        const file = e.target.files?.[0]

        if (!file) return

        const imageUrl = URL.createObjectURL(file)

        setImage(imageUrl)
    }

    const handleSubmit = (e) => {

        e.preventDefault()

        if (
            !form.name.trim() ||
            !form.category ||
            !form.price ||
            !form.stock
        ) {
            return
        }

        const newItem = {
            name: form.name.trim(),
            category: form.category,
            subCategory: form.subCategory.trim(),
            brand: form.brand.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            lowStockThreshold: Number(
                form.lowStockThreshold || 0
            ),
            image
        }

        onAdd(newItem)
    }

    return (
        <div className='
            fixed
            inset-0
            z-[100]
            bg-black/30
            flex
            items-center
            justify-center
            p-4
        '>

            <div className='
                bg-white
                w-full
                max-w-xl
                max-h-[90vh]
                overflow-y-auto
                border
                border-gray-200
            '>

                {/* Header */}
                <div className='
                    flex
                    items-center
                    justify-between
                    px-5
                    sm:px-7
                    py-5
                    border-b
                    border-gray-200
                '>

                    <div>

                        <div className='
                            inline-flex
                            items-center
                            gap-2
                            mb-1
                        '>

                            <p className='
                                text-xs
                                text-gray-500
                            '>
                                ITEMS
                            </p>

                            <span className='
                                w-6
                                h-[1px]
                                bg-gray-400
                            '/>

                        </div>

                        <h2 className='
                            text-xl
                            font-medium
                            text-gray-900
                        '>
                            Add New Item
                        </h2>

                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        className='
                            text-gray-500
                            hover:text-black
                            transition
                        '
                    >
                        <X
                            size={19}
                            strokeWidth={1.5}
                        />
                    </button>

                </div>


                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className='
                        px-5
                        sm:px-7
                        py-6
                    '
                >

                    {/* Image */}
                    <div className='mb-6'>

                        <p className='
                            text-sm
                            text-gray-700
                            mb-3
                        '>
                            Product Image
                        </p>

                        <label className='
                            w-28
                            h-28
                            border
                            border-dashed
                            border-gray-300
                            flex
                            flex-col
                            items-center
                            justify-center
                            cursor-pointer
                            hover:border-black
                            transition
                            overflow-hidden
                            bg-gray-50
                        '>

                            {image ? (

                                <img
                                    src={image}
                                    alt='Preview'
                                    className='
                                        w-full
                                        h-full
                                        object-cover
                                    '
                                />

                            ) : (

                                <>
                                    <Upload
                                        size={20}
                                        strokeWidth={1.5}
                                        className='text-gray-400'
                                    />

                                    <span className='
                                        text-[10px]
                                        text-gray-500
                                        mt-2
                                    '>
                                        Upload Image
                                    </span>
                                </>

                            )}

                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImage}
                                className='hidden'
                            />

                        </label>

                    </div>


                    {/* Product Name */}
                    <div className='mb-5'>

                        <label className='
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        '>
                            Product Name
                        </label>

                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Enter product name'
                            className='
                                w-full
                                border
                                border-gray-300
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-black
                            '
                        />

                    </div>


                    {/* Category + Subcategory */}
                    <div className='
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                        mb-5
                    '>

                        <div>

                            <label className='
                                block
                                text-sm
                                text-gray-700
                                mb-2
                            '>
                                Category
                            </label>

                            <select
                                name='category'
                                value={form.category}
                                onChange={handleChange}
                                className='
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    bg-white
                                    outline-none
                                    focus:border-black
                                '
                            >

                                {categories.map((category) => (

                                    <option
                                        key={category}
                                        value={category}
                                    >
                                        {category}
                                    </option>

                                ))}

                            </select>

                        </div>


                        <div>

                            <label className='
                                block
                                text-sm
                                text-gray-700
                                mb-2
                            '>
                                Subcategory
                            </label>

                            <input
                                type='text'
                                name='subCategory'
                                value={form.subCategory}
                                onChange={handleChange}
                                placeholder='e.g. Sofa'
                                className='
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                '
                            />

                        </div>

                    </div>


                    {/* Brand */}
                    <div className='mb-5'>

                        <label className='
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        '>
                            Brand
                        </label>

                        <input
                            type='text'
                            name='brand'
                            value={form.brand}
                            onChange={handleChange}
                            placeholder='e.g. King Koil'
                            className='
                                w-full
                                border
                                border-gray-300
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-black
                            '
                        />

                    </div>


                    {/* Price + Stock */}
                    <div className='
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                        mb-5
                    '>

                        <div>

                            <label className='
                                block
                                text-sm
                                text-gray-700
                                mb-2
                            '>
                                Selling Price
                            </label>

                            <input
                                type='number'
                                name='price'
                                min='0'
                                value={form.price}
                                onChange={handleChange}
                                placeholder='0'
                                className='
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                '
                            />

                        </div>


                        <div>

                            <label className='
                                block
                                text-sm
                                text-gray-700
                                mb-2
                            '>
                                Initial Stock
                            </label>

                            <input
                                type='number'
                                name='stock'
                                min='0'
                                value={form.stock}
                                onChange={handleChange}
                                placeholder='0'
                                className='
                                    w-full
                                    border
                                    border-gray-300
                                    px-3
                                    py-2.5
                                    text-sm
                                    outline-none
                                    focus:border-black
                                '
                            />

                        </div>

                    </div>


                    {/* Low Stock Threshold */}
                    <div className='mb-6'>

                        <label className='
                            block
                            text-sm
                            text-gray-700
                            mb-2
                        '>
                            Low Stock Threshold
                        </label>

                        <input
                            type='number'
                            name='lowStockThreshold'
                            min='0'
                            value={form.lowStockThreshold}
                            onChange={handleChange}
                            placeholder='e.g. 5'
                            className='
                                w-full
                                border
                                border-gray-300
                                px-3
                                py-2.5
                                text-sm
                                outline-none
                                focus:border-black
                            '
                        />

                        <p className='
                            text-xs
                            text-gray-400
                            mt-2
                        '>
                            The system will use this value to identify
                            low-stock items.
                        </p>

                    </div>


                    {/* Actions */}
                    <div className='
                        flex
                        flex-col-reverse
                        sm:flex-row
                        justify-end
                        gap-3
                        pt-5
                        border-t
                        border-gray-100
                    '>

                        <button
                            type='button'
                            onClick={onClose}
                            className='
                                border
                                border-gray-300
                                text-gray-600
                                px-5
                                py-2.5
                                text-sm
                                hover:border-black
                                hover:text-black
                                transition
                            '
                        >
                            Cancel
                        </button>

                        <button
                            type='submit'
                            className='
                                bg-black
                                text-white
                                px-5
                                py-2.5
                                text-sm
                                hover:bg-gray-800
                                transition
                            '
                        >
                            Add Item
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default AddItem