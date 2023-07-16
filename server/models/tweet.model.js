const mongoose = require('mongoose')

//schema validation for user data
const TweetData = new mongoose.Schema(
	{
		// _id: { type: String, required: true },
		TweeterUserIDtopullTweets: { type: String, required: false },
		TwitteruserName: { type: String, required: false },
		TwitteruserFullName: { type: String, required: false }, 
		CreatedDate: { type: Date, required: false },
		tweet: { type: String, required: false },
		tweetID: { type: String, required: false },
		retweet_count: { type: Number, required: false },
		reply_count: { type: Number, required: false },
		like_count: { type: Number, required: false },
		quote_count: { type: Number, required: false },
		impression_count: { type: Number, required: false },
		curationstatus: { type: String, required: false },
		total_tokens: { type: Number, required: false },
		likesTOviewsRatio: { type: Number, required: false },
		tag: { type: String, required: false },
	},
	{ collection: 'TweetData' }
)

const model = mongoose.model('TweetData', TweetData)

module.exports = model



