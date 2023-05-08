import Layout from '@/components/Layout'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

export default function NewProduct() {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [price, setPrice] = useState('')
	const [gotoProducts, setGotoProducts] = useState(false)
	const router = useRouter()

	const createProduct = async (e) => {
		e.preventDefault()
		const data = { title, description, price }

		await axios.post('/api/products', data)
		setGotoProducts(true)
	}

	if (gotoProducts) {
		router.push('/products')
	}

	return (
		<Layout>
			<form onSubmit={createProduct}>
				<h1>New Product</h1>
				<label htmlFor='product'>Product name:</label>
				<input
					id='product'
					type='text'
					placeholder='Product name'
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
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
		</Layout>
	)
}
