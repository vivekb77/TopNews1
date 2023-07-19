const mongoose = require('mongoose')

//schema validation for date time
const DateTimeOfLastPullModel = new mongoose.Schema(
	{
		dateTimeOfLastPull: { type: Date, required: true },
	},
	{ collection: 'DateTimeOfLastPull' }
)

const model = mongoose.model('DateTimeOfLastPullModel', DateTimeOfLastPullModel)

module.exports = model