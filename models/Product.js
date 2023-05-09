import mongoose, { model, Schema } from 'mongoose'

const ProductSchema = new Schema({
	title: { type: String, required: true },
	description: String,
	price: { type: Number, required: true },
	images: [String],
})

export const Product =
	mongoose.models.Product || model('Product', ProductSchema)
