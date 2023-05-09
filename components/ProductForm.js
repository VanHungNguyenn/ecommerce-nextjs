import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'
import Spinner from './Spinner'
import { ReactSortable } from 'react-sortablejs'

export default function ProductForm({
	_id,
	title: existingTitle,
	description: existingDescription,
	price: existingPrice,
	images: existingImages,
}) {
	const [title, setTitle] = useState(existingTitle || '')
	const [description, setDescription] = useState(existingDescription || '')
	const [price, setPrice] = useState(existingPrice || '')
	const [images, setImages] = useState(existingImages || [])
	const [gotoProducts, setGotoProducts] = useState(false)
	const [isUploading, setIsUploading] = useState(false)
	const router = useRouter()

	console.log(images)

	const createProduct = async (e) => {
		e.preventDefault()
		const data = { title, description, price, images }
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
			<label htmlFor='photo'>Product photos:</label>
			<div className='mb-2 flex items-center gap-2'>
				<ReactSortable
					className='flex items-center gap-2'
					list={images}
					setList={updateImageOrder}
				>
					{!!images?.length &&
						images.map((link, index) => (
							<div key={index} className='h-24'>
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
				<label className=' w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-gray-500 rounded-lg bg-gray-200'>
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
					<div>Upload</div>
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
