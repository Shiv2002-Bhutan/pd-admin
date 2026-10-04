import React, { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

import { updateItem, getCategories } from '../services/api'

const EditItem = ({ item, onClose, onUpdate }) => {

    const [categories, setCategories] = useState([])
    const [categoriesError, setCategoriesError] = useState('')

    const [form, setForm] = useState({
        name: item.name || '',
        categoryId: item.category_id || '',
        subCategory: item.sub_category || '',
        brand: item.brand || '',
        price: item.price || '',
        lowStockThreshold: item.low_stock_threshold || ''
    })

    const [image, setImage] = useState(item.image_url || '')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    useEffect(() => {

        const fetchCategories = async () => {

            try {

                const data = await getCategories()

                setCategories(data)

            } catch (err) {

                console.error(err)
                setCategoriesError('Could not load categories.')
            }
        }

        fetchCategories()

    }, [])

    const handleChange = (e) => {

        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleImage = (e) => {

        const file = e.target.files[0]

        if (!file) return

        setImage(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {

        e.preventDefault()

        setError('')

        if (!form.name.trim() || !form.categoryId || !form.price) {
            setError('Please fill in all required fields.')
            return
        }

        setSubmitting(true)

        try {

            await updateItem(item.id, {
                name: form.name.trim(),
                categoryId: Number(form.categoryId),
                subCategory: form.subCategory.trim(),
                brand: form.brand.trim(),
                price: Number(form.price),
                stock: item.stock,  // stock is managed separately, keep as-is
                lowStockThreshold: Number(form.lowStockThreshold || 0),
                imageUrl: image
            })

            onUpdate()

        } catch (err) {

            console.error(err)
            setError(err.message || 'Failed to update item.')

        } finally {

            setSubmitting(false)
        }
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
                    px-5
                    sm:px-7
                    py-5
                    border-b
                    border-gray-200
                    flex
                    items-center
                    justify-between
                '>

                    <div>

                        <div className='
                            flex
                            items-center
                            gap-2
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
                            ' />

                        </div>

                        <h2 className='
                            text-xl
                            font-medium
                            mt-1
                        '>
                            Edit Item
                        </h2>

                    </div>

                    <button
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
                        '>

                            {image ? (

                                <img
                                    src={image}
                                    alt={form.name}
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
                                        Upload
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
                                name='categoryId'
                                value={form.categoryId}
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

                                <option value=''>
                                    Select category
                                </option>

                                {categories.map((category) => (

                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>

                                ))}

                            </select>

                            {categoriesError && (

                                <p className='
                                    text-xs
                                    text-black
                                    mt-2
                                '>
                                    {categoriesError}
                                </p>

                            )}

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


                    {/* Price + Stock Threshold */}
                    <div className='
                        grid
                        grid-cols-1
                        sm:grid-cols-2
                        gap-4
                        mb-6
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
                                value={form.price}
                                onChange={handleChange}
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
                                Low Stock Threshold
                            </label>

                            <input
                                type='number'
                                name='lowStockThreshold'
                                value={form.lowStockThreshold}
                                onChange={handleChange}
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


                    {/* Current Stock */}
                    <div className='
                        border-t
                        border-gray-100
                        pt-4
                        mb-6
                    '>

                        <p className='
                            text-xs
                            text-gray-500
                        '>
                            CURRENT STOCK
                        </p>

                        <p className='
                            text-sm
                            text-gray-800
                            mt-1
                        '>
                            {item.stock} units
                        </p>

                        <p className='
                            text-xs
                            text-gray-400
                            mt-1
                        '>
                            Stock is managed separately.
                        </p>

                    </div>


                    {error && (

                        <p className='
                            text-xs
                            text-black
                            mb-4
                        '>
                            {error}
                        </p>

                    )}


                    {/* Actions */}
                    <div className='
                        flex
                        flex-col-reverse
                        sm:flex-row
                        justify-end
                        gap-3
                        border-t
                        border-gray-100
                        pt-5
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
                            disabled={submitting}
                            className='
                                bg-black
                                text-white
                                px-5
                                py-2.5
                                text-sm
                                hover:bg-gray-800
                                transition
                                disabled:opacity-50
                            '
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    )
}

export default EditItem