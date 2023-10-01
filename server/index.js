const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();

const NZNews = require('./GetNews/NZNews')
const AUNews = require('./GetNews/AUNews')
const WorldNews = require('./GetNews/WorldNews')
const NotNews = require('./GetNews/NotNews')

const AddNZNews = require('./AddNews/AddNZNews')
const AddAUNews = require('./AddNews/AddAUNews')
const AddWorldNews = require('./AddNews/AddWorldNews')
const AddNotNews = require('./AddNews/AddNotNews')

const CurateNews = require('./Curate/Curate')
const Login = require('./Curate/Login')
const CreateAd = require('./Ads/CreateAd')
const PostAd = require('./Ads/PostAd')


const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 1337

app.use(cors())
app.use(express.json())


try {
	 mongoose.connect(`${MONGO_URL}`)
  } catch (error) {
	console.log("could not connect to mongo db "+error)
}

app.use('/api', NZNews)
app.use('/api', AddNZNews)
app.use('/api', AUNews)
app.use('/api', AddAUNews)
app.use('/api', WorldNews)
app.use('/api', AddWorldNews)
app.use('/api', CurateNews)
app.use('/api', Login)
app.use('/api', AddNotNews)
app.use('/api', NotNews)
app.use('/api', CreateAd)
app.use('/api', PostAd)

app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})


//cron job every 30 mins to pull latest articles
// https://github.com/ncb000gt/node-cron
// cron.schedule('*/30 * * * *', async () => {
// 	const currentDateTimebefore = new Date().toLocaleString();
//   	console.log(`Running cron job to fetch latest articles at [${currentDateTimebefore}]`);
// 	addedArticlesCount = 0;
// 	skippedArticlesCount = 0;
// 	await runCron();
// 	console.log("Added Articles Count "+addedArticlesCount);
// 	console.log("Skipped Articles Count "+skippedArticlesCount);
// 	const currentDateTimeafter = new Date().toLocaleString();
// 	console.log(`Cron job finished at [${currentDateTimeafter}]`);
//   });

  //get all news providers
//   app.post('/api/providers', async (req, res) => {
// 	try {
		
// 		TopicArray = []
// 		TopicArray.push("STUFF")
// 		TopicArray.push("NZ Herald")
// 		TopicArray.push("RNZ")

// 		TopicArray = [...new Set(TopicArray)];  //remove duplicates
		
// 		return res.json({ status: 'ok', TopicArray:TopicArray })

// 	} catch (error) {
// 		console.log(error)
// 		res.json({ status: 'error', error: 'Error while sending providers' })
// 	}
// })