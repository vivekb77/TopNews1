const mongoose = require('mongoose')

//schema validation for rss feed data
const NotNewsData = new mongoose.Schema(
	{
		displayOnFE: { type: Boolean, required: true },
		articleSource: { type: String, required: true },
		articleTitle: { type: String, required: true },
		articleDescription: { type: String, required: false },
		articleUrl: { type: String, required: true },
		teaserImageUrl: { type: String, required: false },
		articleAuthor: { type: String, required: false },
		articleGuid: { type: String, required: true, unique: true },
		articlePublicationDate: { type: Date, required: true },
		articleImportedToTopNewsDate: { type: Date, required: true },
		clickCount: { type: Number, required: false },
	},
	{ collection: 'NotNewsData' }
)

const model = mongoose.model('NotNewsData', NotNewsData)

module.exports = model