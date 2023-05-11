import { Product } from '@/models/Product'
import { mongooseConnect } from '@/lib/mongoose'
import { isAdminRequest } from './auth/[...nextauth]'

export default async function handle(req, res) {
	const { method } = req
	await mongooseConnect()
	await isAdminRequest(req, res)

	if (method === 'GET') {
		if (req.query?.id) {
			const product = await Product.findOne({
				_id: req.query.id,
			})
			res.json(product)
			return
		}

		const products = await Product.find({})
		res.json(products)
	}

	if (method === 'POST') {
		const {
			title,
			description,
			price,
			images,
			category,
			productProperties,
		} = req.body
		const productDoc = await Product.create({
			title,
			description,
			price,
			images,
			category,
			productProperties,
		})

		res.json(productDoc)
	}

	if (method === 'PUT') {
		const {
			_id,
			title,
			description,
			price,
			images,
			category,
			productProperties,
		} = req.body
		const productDoc = await Product.findOneAndUpdate(
			{ _id },
			{ title, description, price, images, category, productProperties },
			{ new: true }
		)

		res.json(productDoc)
	}

	if (method === 'DELETE') {
		if (req.query?.id) {
			await Product.deleteOne({ _id: req.query.id })
			res.json({ success: true })
		}
	}
}
