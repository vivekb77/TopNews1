const mongoose = require('mongoose')

//schema validation for date time
const DateTimeOfLastPullModel = new mongoose.Schema(
	{
		dateTimeOfLastPull_NZ: { type: Date, required: false },
		dateTimeOfLastPull_AU: { type: Date, required: false },
		dateTimeOfLastPull_World: { type: Date, required: false },
		dateTimeOfLastPull_NotNews: { type: Date, required: false },
	},
	{ collection: 'DateTimeOfLastPull' }
)

const model = mongoose.model('DateTimeOfLastPullModel', DateTimeOfLastPullModel)

module.exports = model