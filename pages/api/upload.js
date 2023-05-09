import multiparty from 'multiparty'
import { v2 as cloudinaryV2 } from 'cloudinary'
import fs from 'fs'

// config
cloudinaryV2.config({
	cloud_name: 'vanhungnguyen',
	api_key: '724297145633116',
	api_secret: 'ah9HH5XNEFVQyzTH1dvgAp-cUB4',
})

export default async function handle(req, res) {
	const form = new multiparty.Form()

	const { fields, files } = await new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) return reject(err)

			resolve({ fields, files })
		})
	})

	const links = []

	for (const file of files.file) {
		// const ext = file.originalFilename.split('.').pop()
		const newFilename = Date.now()

		const result = await cloudinaryV2.uploader.upload(file.path, {
			public_id: `${newFilename}`,
			tags: 'products',
		})

		const link = result.secure_url
		links.push(link)
	}

	return res.json(links)
}

export const config = {
	api: {
		bodyParser: false,
	},
}
