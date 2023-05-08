import { Product } from '@/models/Product'
import { mongooseConnect } from '@/lib/mongoose'

export default async function handle(req, res) {
	const { method } = req
	await mongooseConnect()

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
		const { title, description, price } = req.body
		const productDoc = await Product.create({
			title,
			description,
			price,
		})

		res.json(productDoc)
	}
}
