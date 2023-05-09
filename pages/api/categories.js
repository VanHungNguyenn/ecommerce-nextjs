import { Category } from '@/models/Category'
import { mongooseConnect } from '@/lib/mongoose'

export default async function handle(req, res) {
	const { method } = req
	await mongooseConnect()

	if (method === 'GET') {
		const categories = await Category.find().populate('parent')
		res.json(categories)
	}

	if (method === 'POST') {
		const { name, parentCategory } = req.body
		const categoryDoc = await Category.create({
			name,
			parent: parentCategory,
		})

		res.json(categoryDoc)
	}

	if (method === 'PUT') {
		const { name, parentCategory, _id } = req.body

		const categoryDoc = await Category.findByIdAndUpdate(
			{ _id },
			{
				name,
				parent: parentCategory,
			},
			{ new: true }
		)

		res.json(categoryDoc)
	}

	if (method === 'DELETE') {
		if (req.query?.id) {
			await Category.deleteOne({ _id: req.query.id })
			res.json('ok')
		}
	}
}
