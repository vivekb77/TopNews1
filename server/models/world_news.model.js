const mongoose = require('mongoose')

//schema validation for rss feed data
const NewsDataWorld = new mongoose.Schema(
	{
		displayOnFE: { type: Boolean, required: true },
        articleSource: { type: String, required: true },
		articleTitle: { type: String, required: true},
		articleDescription: { type: String, required: false },
		articleUrl: { type: String, required: true },
        teaserImageUrl: { type: String, required: false },
        articleAuthor: { type: String, required: false },
        articleGuid: { type: String, required: true, unique: true },
		articlePublicationDate: { type: Date, required: true },
		articleImportedToTopNewsDate: { type: Date, required: true },
	},
	{ collection: 'WorldNewsData' }
)

const model = mongoose.model('NewsDataWorld', NewsDataWorld)

module.exports = model