import React, { useState, useEffect } from 'react'
import { X, Upload } from 'lucide-react'

import {
    createItem,
    getCategories,
    uploadImage
} from '../services/api'

const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '')

const inputClass =
    'w-full border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-black'

const labelClass = 'block text-sm text-gray-700 mb-2'

/*
 * Accepts both prop names so it works with the parent either way:
 *   <AddItem onItemAdded={...} />   (used in Items.jsx)
 *   <AddItem onAdd={...} />
 */
const AddItem = ({ onClose, onItemAdded, onAdd }) => {

    const [categories, setCategories] = useState([])
    const [categoriesError, setCategoriesError] = useState('')

    const [form, setForm] = useState({
        name: '',
        categoryId: '',
        subCategory: '',
        brand: '',
        price: '',
        stock: '',
        lowStockThreshold: ''
    })

    const [image, setImage] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [uploadingImage, setUploadingImage] = useState(false)
    const [imageError, setImageError] = useState('')

    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)


    // LOAD CATEGORIES
    useEffect(() => {

        let cancelled = false

        const fetchCategories = async () => {

            try {

                const data = await getCategories()

                if (cancelled) return

                /*
                 * If Rubber Wood exists in the database, use it as
                 * returned by the API. Otherwise show a disabled
                 * placeholder (no fake ID, since createItem() needs
                 * a real category ID).
                 */
                const rubberWoodExists = data.some(
                    (category) =>
                        category.name?.trim().toLowerCase() === 'rubber wood'
                )

                setCategories(
                    rubberWoodExists
                        ? data
                        : [...data, { id: null, name: 'Rubber Wood' }]
                )

                if (data.length > 0) {
                    setForm((prev) => ({
                        ...prev,
                        categoryId: data[0].id
                    }))
                }

            } catch (err) {

                console.error(err)

                if (!cancelled) {
                    setCategoriesError('Could not load categories.')
                }

            }
        }

        fetchCategories()

        return () => {
            cancelled = true
        }

    }, [])


    const handleChange = (e) => {

        const { name, value } = e.target

        setForm((prev) => ({
            ...prev,
            [name]: value
        }))

    }


    const handleImage = async (e) => {

        const file = e.target.files?.[0]

        if (!file) return

        setImageError('')
        setUploadingImage(true)

        try {

            const data = await uploadImage(file)

            // Full URL for preview
            setImage(`${API_URL}${data.url}`)

            // Relative path saved to database
            setImageUrl(data.url)

        } catch (err) {

            console.error(err)

            setImageError(err.message || 'Failed to upload image.')

        } finally {

            setUploadingImage(false)

            // Allow re-selecting the same file
            e.target.value = ''

        }
    }


    const handleSubmit = async (e) => {

        e.preventDefault()

        // Prevent double submits (this caused duplicate items before)
        if (submitting) return

        setError('')

        if (
            !form.name.trim() ||
            form.categoryId === '' ||
            form.price === '' ||
            form.stock === ''
        ) {
            setError('Please fill in all required fields.')
            return
        }

        setSubmitting(true)

        // Only the save itself is inside try/catch, so a problem in the
        // parent callback can never show "Failed to add item" for an
        // item that was actually saved.
        try {

            await createItem({
                name: form.name.trim(),
                categoryId: Number(form.categoryId),
                subCategory: form.subCategory.trim(),
                brand: form.brand.trim(),
                price: Number(form.price),
                stock: Number(form.stock),
                lowStockThreshold: Number(form.lowStockThreshold || 0),
                imageUrl
            })

        } catch (err) {

            console.error(err)

            setError(err.message || 'Failed to add item.')
            setSubmitting(false)

            return

        }

        // Item is saved. Notify the parent (refresh list + close modal).
        const notifyParent = onItemAdded || onAdd

        if (typeof notifyParent === 'function') {
            notifyParent()
        } else {
            console.warn(
                'AddItem: no onItemAdded/onAdd prop passed. Closing modal only.'
            )
            onClose?.()
        }
    }


    return (

        <div className='fixed inset-0 z-[100] bg-black/30 flex items-center justify-center p-4'>

            <div className='bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto border border-gray-200'>

                {/* HEADER */}

                <div className='flex items-center justify-between px-5 sm:px-7 py-5 border-b border-gray-200'>

                    <div>

                        <div className='inline-flex items-center gap-2 mb-1'>

                            <p className='text-xs text-gray-500'>
                                ITEMS
                            </p>

                            <span className='w-6 h-[1px] bg-gray-400' />

                        </div>

                        <h2 className='text-xl font-medium text-gray-900'>
                            Add New Item
                        </h2>

                    </div>

                    <button
                        type='button'
                        onClick={onClose}
                        className='text-gray-500 hover:text-black transition'
                    >
                        <X size={19} strokeWidth={1.5} />
                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                    className='px-5 sm:px-7 py-6'
                >

                    {/* IMAGE */}

                    <div className='mb-6'>

                        <p className='text-sm text-gray-700 mb-3'>
                            Product Image
                        </p>

                        <label className='w-28 h-28 border border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-black transition overflow-hidden bg-gray-50'>

                            {uploadingImage ? (

                                <span className='text-[10px] text-gray-500'>
                                    Uploading...
                                </span>

                            ) : image ? (

                                <img
                                    src={image}
                                    alt='Preview'
                                    className='w-full h-full object-cover'
                                />

                            ) : (

                                <>
                                    <Upload
                                        size={20}
                                        strokeWidth={1.5}
                                        className='text-gray-400'
                                    />

                                    <span className='text-[10px] text-gray-500 mt-2'>
                                        Upload Image
                                    </span>
                                </>

                            )}

                            <input
                                type='file'
                                accept='image/*'
                                onChange={handleImage}
                                className='hidden'
                                disabled={uploadingImage}
                            />

                        </label>

                        {imageError && (
                            <p className='text-xs text-black mt-2'>
                                {imageError}
                            </p>
                        )}

                    </div>


                    {/* PRODUCT NAME */}

                    <div className='mb-5'>

                        <label className={labelClass}>
                            Product Name
                        </label>

                        <input
                            type='text'
                            name='name'
                            value={form.name}
                            onChange={handleChange}
                            placeholder='Enter product name'
                            className={inputClass}
                        />

                    </div>


                    {/* CATEGORY + SUBCATEGORY */}

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>

                        <div>

                            <label className={labelClass}>
                                Category
                            </label>

                            <select
                                name='categoryId'
                                value={form.categoryId}
                                onChange={handleChange}
                                className={`${inputClass} bg-white`}
                            >

                                <option value=''>
                                    Select category
                                </option>

                                {categories.map((category) => (

                                    <option
                                        key={category.id ?? 'rubber-wood'}
                                        value={category.id ?? ''}
                                        disabled={category.id === null}
                                    >
                                        {category.name}
                                        {category.id === null
                                            ? ' (not configured)'
                                            : ''}
                                    </option>

                                ))}

                            </select>

                            {categoriesError && (
                                <p className='text-xs text-black mt-2'>
                                    {categoriesError}
                                </p>
                            )}

                        </div>

                        <div>

                            <label className={labelClass}>
                                Subcategory
                            </label>

                            <input
                                type='text'
                                name='subCategory'
                                value={form.subCategory}
                                onChange={handleChange}
                                placeholder='e.g. Sofa'
                                className={inputClass}
                            />

                        </div>

                    </div>


                    {/* BRAND */}

                    <div className='mb-5'>

                        <label className={labelClass}>
                            Brand
                        </label>

                        <input
                            type='text'
                            name='brand'
                            value={form.brand}
                            onChange={handleChange}
                            placeholder='e.g. King Koil'
                            className={inputClass}
                        />

                    </div>


                    {/* PRICE + STOCK */}

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5'>

                        <div>

                            <label className={labelClass}>
                                Selling Price
                            </label>

                            <input
                                type='number'
                                name='price'
                                min='0'
                                value={form.price}
                                onChange={handleChange}
                                placeholder='0'
                                className={inputClass}
                            />

                        </div>

                        <div>

                            <label className={labelClass}>
                                Initial Stock
                            </label>

                            <input
                                type='number'
                                name='stock'
                                min='0'
                                value={form.stock}
                                onChange={handleChange}
                                placeholder='0'
                                className={inputClass}
                            />

                        </div>

                    </div>


                    {/* LOW STOCK THRESHOLD */}

                    <div className='mb-6'>

                        <label className={labelClass}>
                            Low Stock Threshold
                        </label>

                        <input
                            type='number'
                            name='lowStockThreshold'
                            min='0'
                            value={form.lowStockThreshold}
                            onChange={handleChange}
                            placeholder='e.g. 5'
                            className={inputClass}
                        />

                        <p className='text-xs text-gray-400 mt-2'>
                            The system will use this value to identify
                            low-stock items.
                        </p>

                    </div>


                    {/* ERROR */}

                    {error && (
                        <p className='text-xs text-black mb-4'>
                            {error}
                        </p>
                    )}


                    {/* ACTIONS */}

                    <div className='flex flex-col-reverse sm:flex-row justify-end gap-3 pt-5 border-t border-gray-100'>

                        <button
                            type='button'
                            onClick={onClose}
                            className='border border-gray-300 text-gray-600 px-5 py-2.5 text-sm hover:border-black hover:text-black transition'
                        >
                            Cancel
                        </button>

                        <button
                            type='submit'
                            disabled={
                                submitting ||
                                uploadingImage ||
                                form.categoryId === ''
                            }
                            className='bg-black text-white px-5 py-2.5 text-sm hover:bg-gray-800 transition disabled:opacity-50'
                        >
                            {submitting ? 'Adding...' : 'Add Item'}
                        </button>

                    </div>

                </form>

            </div>

        </div>

    )
}

export default AddItem