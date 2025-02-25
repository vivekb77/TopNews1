const mongoose = require('mongoose')

//schema validation for rss feed data
const NewsData = new mongoose.Schema(
	{
		displayOnFE: { type: Boolean, required: true },
        articleSource: { type: String, required: true },
		articleTitle: { type: String, required: true,unique: true },
		articleDescription: { type: String, required: false },
		articleUrl: { type: String, required: true },
        teaserImageUrl: { type: String, required: false },
        resizedImageUrl: { type: String, required: false },
        articleAuthor: { type: String, required: false },
        articleGuid: { type: String, required: true, unique: true },
		articlePublicationDate: { type: Date, required: true },
		articleImportedToTopNewsDate: { type: Date, required: true },
		clickCount: { type: Number, required: false },
	},
	{ collection: 'NZNewsData' }
)

const model = mongoose.model('NewsData', NewsData)

module.exports = model