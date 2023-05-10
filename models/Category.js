import mongoose, { model, Schema } from 'mongoose'

const CategorySchema = new Schema({
	name: { type: String, required: true },
	parent: { type: mongoose.Types.ObjectId, ref: 'Category' },
	properties: [{ type: Object }],
})

export const Category =
	mongoose.models?.Category || model('Category', CategorySchema)
