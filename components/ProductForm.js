import { useEffect, useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Spinner from './Spinner'
import { ReactSortable } from 'react-sortablejs'
import { set } from 'mongoose'

export default function ProductForm({
	_id,
	title: existingTitle,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
	category: existingCategory,
	properties: existingProperties,
}) {
	const [title, setTitle] = useState(existingTitle || '')
	const [category, setCategory] = useState(existingCategory || '')
	const [productProperties, setProductProperties] = useState(
		existingProperties || {}
	)
	const [description, setDescription] = useState(existingDescription || '')
	const [price, setPrice] = useState(existingPrice || '')
	const [images, setImages] = useState(existingImages || [])
	const [gotoProducts, setGotoProducts] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const [categories, setCategories] = useState([])
	const router = useRouter()

	useEffect(() => {
		axios.get('/api/categories').then((response) => {
			setCategories(response.data)
		})
	}, [])

	const createProduct = async (e) => {
		e.preventDefault()
		const data = {
			title,
			description,
			price,
			images,
			category,
			productProperties,
		}
		if (_id) {
			//update
			await axios.put(`/api/products`, { ...data, _id })
		} else {
			//create
			await axios.post('/api/products', data)
		}

		setGotoProducts(true)
	}

	if (gotoProducts) {
		router.push('/products')
	}

	async function uploadImages(ev) {
		const files = ev.target?.files

		if (files?.length > 0) {
			setIsUploading(true)
			const data = new FormData()

			for (const file of files) {
				data.append('file', file)
			}

			const res = await axios.post('/api/upload', data, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			setImages((oldImages) => [...oldImages, ...res.data])
			setIsUploading(false)
		}
	}

	function updateImageOrder(images) {
		setImages(images)
	}

	const propertiestoFill = []

	if (categories.length > 0 && category) {
		let catInfo = categories.find((cat) => cat._id === category)

		propertiestoFill.push(...catInfo.properties)

		while (catInfo?.parent?._id) {
			const parentCat = categories.find(
				(cat) => cat._id === catInfo.parent._id
			)

			propertiestoFill.push(...parentCat.properties)
			catInfo = parentCat
		}
	}

	const setProductProp = (propName, propValue) => {
		setProductProperties((oldProps) => {
			const newProductProps = { ...oldProps }
			newProductProps[propName] = propValue
			return newProductProps
		})
	}

	return (
		<form onSubmit={createProduct}>
			<label htmlFor='product'>Product name:</label>
			<input
				id='product'
				type='text'
				placeholder='Product name'
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<label htmlFor='category'>Category:</label>
			<select
				id='category'
				value={category}
				onChange={(e) => setCategory(e.target.value)}
			>
				<option value=''>Uncategorized</option>
				{categories.length > 0 &&
					categories.map((category) => (
						<option key={category._id} value={category._id}>
							{category.name}
						</option>
					))}
			</select>
			{propertiestoFill.length > 0 &&
				propertiestoFill.map((prop) => (
					<div key={prop._id}>
						<label className='capitalize'>{prop.name}</label>
						<div>
							<select
								onChange={(e) =>
									setProductProp(prop.name, e.target.value)
								}
								value={productProperties[prop.name]}
								className='mb-0'
							>
								{prop.values.map((val) => (
									<option key={val} value={val}>
										{val}
									</option>
								))}
							</select>
						</div>
					</div>
				))}
			<label htmlFor='photo'>Product photos:</label>
			<div className='mb-2 flex items-center gap-2'>
				<ReactSortable
					className='flex items-center gap-2'
					list={images}
					setList={updateImageOrder}
				>
					{!!images?.length &&
						images.map((link, index) => (
							<div
								key={index}
								className='h-24 bg-white p-4 shadow-sm rounded-sm border border-gray-200'
							>
								<img
									src={link}
									alt=''
									className='h-full object-cover rounded-lg'
								/>
							</div>
						))}
				</ReactSortable>
				{isUploading && (
					<div className='h-24 flex items-center justify-center'>
						<Spinner />
					</div>
				)}
				<label className=' w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-lg bg-white shadow-sm border border-primary'>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						strokeWidth={1.5}
						stroke='currentColor'
						className='w-6 h-6'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
						/>
					</svg>
					<div>Add image</div>
					<input
						type='file'
						className='hidden'
						onChange={uploadImages}
					/>
				</label>
				{!images?.length && <div>No photos in this product</div>}
			</div>
			<label htmlFor='description'>Product description:</label>
			<textarea
				id='description'
				cols='30'
				rows='10'
				placeholder='Description'
				value={description}
				onChange={(e) => setDescription(e.target.value)}
			></textarea>
			<label htmlFor='price'>Price (in USD):</label>
			<input
				id='price'
				type='number'
				placeholder='Price'
				value={price}
				onChange={(e) => setPrice(e.target.value)}
			/>
			<button type='submit' className='button-primary'>
				Save
			</button>
		</form>
	)
}
