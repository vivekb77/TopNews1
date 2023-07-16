const mongoose = require('mongoose')

//schema validation for user data
const UserData = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		total_tokens: { type: Number, required: false },
		CreatedDate: { type: Date, required: true },
	},
	{ collection: 'UserData' }
)

const model = mongoose.model('UserData', UserData)

module.exports = model



