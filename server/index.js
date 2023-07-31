const moment = require('moment-timezone');
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const NewsData = require('./models/news.model')
const DateTimeOfLastPullModel = require('./models/datetime.model')
const axios = require('axios');
const Parser = require('rss-parser');
var cron = require('node-cron');
const xml2js = require('xml2js');

const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
require('dotenv').config();

const MONGO_URL = process.env.MONGO_URL
const PORT = process.env.PORT || 1337

app.use(cors())
app.use(express.json())


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

try {
	 mongoose.connect(`${MONGO_URL}`)
  } catch (error) {
	console.log("could not connect to mongo db "+error)
}

let addedArticlesCount;
let skippedArticlesCount;
let errorAddingArticlesCount;
// Get RSS feed from new providers whenever needed with a post request to api/cron
app.post('/api/cronstuffnorth', async (req, res) => {
	console.log("Cron job via API triggered for STUFF NORTH")
	console.log(`Running cron job to fetch latest articles at [${new Date().toLocaleString()}]`);
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await runCronStuffNorth();
	console.log("Added Articles Count "+addedArticlesCount);
	console.log("Skipped Articles Count "+skippedArticlesCount);
	console.log("Error adding Articles Count "+errorAddingArticlesCount);
	console.log(`Cron job finished at [${new Date().toLocaleString()}]`);
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `Cron job completed successfully for STUFF NORTH. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error${errorAddingArticlesCount}`, message: `Cron job completed successfully for STUFF NORTH. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error${errorAddingArticlesCount}`})
});

app.post('/api/cronstuffsouth', async (req, res) => {
	console.log("Cron job via API triggered for STUFF SOUTH")
	console.log(`Running cron job to fetch latest articles at [${new Date().toLocaleString()}]`);
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await runCronStuffSouth();
	console.log("Added Articles Count "+addedArticlesCount);
	console.log("Skipped Articles Count "+skippedArticlesCount);
	console.log("Error adding Articles Count "+errorAddingArticlesCount);
	console.log(`Cron job finished at [${new Date().toLocaleString()}]`);
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for STUFF SOUTH. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error${errorAddingArticlesCount}`})
});

app.post('/api/cronnzherald', async (req, res) => {
	console.log("Cron job via API triggered for NZ Herald")
	console.log(`Running cron job to fetch latest articles at [${new Date().toLocaleString()}]`);
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await runCronNzHerald();
	console.log("Added Articles Count "+addedArticlesCount);
	console.log("Skipped Articles Count "+skippedArticlesCount);
	console.log("Error adding Articles Count "+errorAddingArticlesCount);
	console.log(`Cron job finished at [${new Date().toLocaleString()}]`);
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for NZ Herald. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error${errorAddingArticlesCount}`})
});

app.post('/api/cronrnz', async (req, res) => {
	console.log("Cron job via API triggered for RNZ")
	console.log(`Running cron job to fetch latest articles at [${new Date().toLocaleString()}]`);
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await runCronRnz();
	console.log("Added Articles Count "+addedArticlesCount);
	console.log("Skipped Articles Count "+skippedArticlesCount);
	console.log("Error adding Articles Count "+errorAddingArticlesCount);
	console.log(`Cron job finished at [${new Date().toLocaleString()}]`);
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for RNZ. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error${errorAddingArticlesCount}`})
});

async function runCronStuffNorth() {
	await fetchDataFromRSS('https://www.stuff.co.nz/rss',"STUFF");
	await fetchDataFromRSS('https://www.waikatotimes.co.nz/rss',"WAIKATO TIMES");
}

async function runCronStuffSouth() {
	await fetchDataFromRSS('https://www.thepress.co.nz/rss',"THE PRESS");
	await fetchDataFromRSS('https://www.thepost.co.nz/rss',"THE POST");
}

async function runCronNzHerald() {
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/curated/78/?outputType=xml&_website=nzh',"NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/nz/?outputType=xml&_website=nzh',"NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/business/?outputType=xml&_website=nzh',"NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/world/?outputType=xml&_website=nzh',"NZ Herald")
}

async function runCronRnz() {
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/on-the-inside.xml',"RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/national.xml',"RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/political.xml',"RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/country.xml',"RNZ")
}


async function fetchDataFromRSS(sourceUrl,articleSource) {
  try {
    const response = await axios.get(sourceUrl);
    const parser = new Parser();
    const parsedrssfeedforstuff = await parser.parseString(response.data); //using rss parser , this does not parse image url
	const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

	let NewsItemsArray= [];
	const timeZone = 'Pacific/Auckland';

	//stuff
	if(articleSource == "STUFF"){
		parsedrssfeedforstuff.items.forEach(item => {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: item.title,
			articleDescription: item.contentSnippet,
			articleUrl: item.link,
			teaserImageUrl: item.enclosure.url,
			articleAuthor:item['dc:creator'],
			articleGuid: item.guid,
			articlePublicationDate: new Date(item.pubDate),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
		};
		NewsItemsArray.push(newsItem);
		});
	}

	//nz herald
	if(articleSource == "NZ Herald"){
		parserrssfeed.rss.channel[0].item.forEach(item => {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: item.title[0],
			articleDescription: item.description[0],
			articleUrl: item.link[0],
			teaserImageUrl: item['media:content'][0]['$']['url'],
			articleGuid: guid = item.guid[0]['_'].slice(-27),
			// articleAuthor :item['dc:creator'],
			articlePublicationDate: new Date(item.pubDate[0]),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);	
		});	
	}

	//rnz
	if(articleSource == "RNZ"){
		parsedrssfeedforstuff.items.forEach(item => {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: item.title,
			articleDescription: item.contentSnippet,
			articleUrl: item.link,
			// teaserImageUrl: item.media_content['url'],
			articleGuid: item.guid,
			articlePublicationDate: new Date(item.pubDate),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);	
		});	
	}

	//the post
	const regex = /\d+[^0-9]/
	if(articleSource == "THE POST"){
		//only pull last 25 articles
		for (let i = 0; i < 25; i++) {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: parserrssfeed.feed.entry[i].title[0],
			articleDescription: parserrssfeed.feed.entry[i].summary[0],
			articleUrl: parserrssfeed.feed.entry[i].link[0]['$'].href,
			teaserImageUrl:parserrssfeed.feed.entry[i]['media:content'][0]['$']['url'],
			articleAuthor:parserrssfeed.feed.entry[i].author[0].name[0],
			articleGuid:parserrssfeed.feed.entry[i].id[0].slice(0, parserrssfeed.feed.entry[i].id[0].search(regex) + 10),
			articlePublicationDate: new Date(parserrssfeed.feed.entry[i].published[0]),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);
		};
	}

	//the press
	if(articleSource == "THE PRESS"){
	//only pull last 25
		for (let i = 0; i < 25; i++) {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: parserrssfeed.feed.entry[i].title[0],
			articleDescription: parserrssfeed.feed.entry[i].summary[0],
			articleUrl: parserrssfeed.feed.entry[i].link[0]['$'].href,
			teaserImageUrl:parserrssfeed.feed.entry[i]['media:content'][0]['$']['url'],
			articleAuthor:parserrssfeed.feed.entry[i].author[0].name[0],
			articleGuid:parserrssfeed.feed.entry[i].id[0].slice(0, parserrssfeed.feed.entry[i].id[0].search(regex) + 10),
			articlePublicationDate: new Date(parserrssfeed.feed.entry[i].published[0]),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);	
		}
	}

	//waikato times
	if(articleSource == "WAIKATO TIMES"){
		
		parserrssfeed.feed.entry.forEach(item => {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: item.title[0],
			articleDescription: item.summary[0],
			articleUrl: item.link[0]['$'].href,
			teaserImageUrl:item['media:content'][0]['$']['url'],
			articleAuthor:item.author[0].name[0],
			articleGuid:item.id[0].slice(0, item.id[0].search(regex) + 10),
			articlePublicationDate: new Date(item.published[0]),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);	
		});
	}

	await addNewsItemsToDB(NewsItemsArray)
  } catch (error) {
    console.error('Error fetching or parsing RSS feed:', error);
  }
}

//add news articles to mongo db, do not add if the guid is already present

async function addNewsItemsToDB(NewsItemsArray) {
	
	try {
	  for (const item of NewsItemsArray) {
		const existingItem = await NewsData.findOne({ articleGuid: item.articleGuid });
		if (existingItem) {
			skippedArticlesCount ++
		//   console.log('Skipping ' +item.articleSource);
		 
		} else {
			addedArticlesCount ++;
		  	await NewsData.create(item);
		//   console.log('News Inserted '+item.articleSource);
		}
	  }
	} catch (error) {
		errorAddingArticlesCount++
	  console.error('Error inserting News article, mostly due to duplicate key' +error);
	}
  }

  async function AddDateTimeOfLastPull(dateTimeOfLastPull){
	try{
		DateTimeOfLastPullModel.findByIdAndUpdate("64b7bd95181d90534a16cb5a", {dateTimeOfLastPull: new Date(dateTimeOfLastPull)}, {new: false}, (err, doc) => {
	});	
		console.log("dateTimeOfLastPull updated");
	}catch{
		console.log("dateTimeOfLastPull not updated");
	}
  }

//get news articles
app.post('/api/GetNewsForProvider', async (req, res) => {

let topictopulltweets = "PullAllNews";
const timeZone = 'Pacific/Auckland';
const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone

	let AITweets = [];
	let AITweetsYesterday = [];
	if(topictopulltweets == "PullAllNews"){
		 AITweets = await NewsData.find({
			displayOnFE: true,
			articlePublicationDate: {
				$gte: currentDate,
				$lt: moment(currentDate).add(1, 'day').toDate()
			  }

		})
	}
	else {
		//this will be need if want to pull articles for specific provider
		 AITweets = await NewsData.find({
			articleSource: { '$regex':topictopulltweets , '$options' : 'i'},
			displayOnFE: true
		})
	}

	//if total news articles today are less than 20, pull yesterdays articles and add
	if(AITweets.length < 100){
		
		AITweetsYesterday = await NewsData.find({
		   displayOnFE: true,
		   articlePublicationDate: {
			   $lt: moment(currentDate).add(0, 'day').toDate(),
			 }

	   })
	   for(let z = 0; z<AITweetsYesterday.length; z++){
		AITweets.push(AITweetsYesterday[z]);
	   }
   }

	if(AITweets.length > 0){
		//shuffle array
		// for (let i = AITweets.length - 1; i > 0; i--) {
		// 	const j = Math.floor(Math.random() * (i + 1));
		// 	[AITweets[i], AITweets[j]] = [AITweets[j], AITweets[i]];
		//   }
		//sort the array by date
		AITweets.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)
		AITweets = AITweets.slice(0, 100);

		for (let f = 0; f < AITweets.length; f++) {
			const inputDate = new Date(AITweets[f].articlePublicationDate);
		
			const options = {
				day: '2-digit',
				month: 'short',
				// year: '2-digit', 
				hour: '2-digit',
				minute: '2-digit',
				hour12: true,
				timeZone: 'Pacific/Auckland'
			};
			const formattedDate = inputDate.toLocaleDateString('en-US', options);
			AITweets[f].articleAuthor = formattedDate; //updating author field as new date is of string type can t reassign to date fields
		}
	return res.json({ status: 'ok', tweets: AITweets })
	}else{
		return res.json({ status: 'error', errormessage: 'Something went wrong' })
	}

})

  
//get last article update datetime
app.post('/api/dateTimeOfLastPull', async (req, res) => {
try {
	const dateTimeOfLastPull = await DateTimeOfLastPullModel.find({
		_id: "64b7bd95181d90534a16cb5a"
	})
	const inputDate = new Date(dateTimeOfLastPull[0].dateTimeOfLastPull);
				const options = { 
					day: '2-digit', 
					month: 'short',
					// year: '2-digit', 
					hour: '2-digit', 
					minute: '2-digit', 
					hour12: true ,
					timeZone: 'Pacific/Auckland'
				  };
	return res.json({ status: 'ok', dateTimeOfLastPull: inputDate.toLocaleDateString('en-US', options)})

} catch (error) {
	res.json({ status: 'error', errormessage: 'Error getting dateTimeOfLastPull' })
}
})

  //get news providers
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

//topic.js
//aicard.js
// index.js























// DELETE TWEET START
app.post('/api/deleteTweet', async (req, res) => {

	let dbid = req.body.dbid.trim();
	
	TweetData.findByIdAndDelete(dbid)
		.then(deletedUser => {
			// console.log(`Successfully deleted user with id ${dbid}`);
			return res.json({ status: 'ok'})
		})
		.catch(err => {
			// console.log(`Error deleting user with id ${dbid}: ${err}`);
			return res.json({ status: 'error'})
		});

})
// DELETE TWEET END

// ADD TAG START
app.post('/api/addtag', async (req, res) => {

	let dbid = req.body.dbid.trim();
	let tag = req.body.tag.trim();
	
	try{
		TweetData.findByIdAndUpdate(dbid, {tag: tag, curationstatus: "notcurated"}, {new: false}, (err, doc) => {
			if (err) return handleError(err);
		});	
		return res.json({ status: 'ok'})
	}catch{
		return res.json({ status: 'error'})
	}
})
// ADD TAG END

// PULL TWEET to show user START
app.post('/api/ShowTweets', async (req, res) => {

	let tweeterUserHadleToPullTweets = req.body.tweeterUserHadleToPullTweets.trim();
	
	const AITweets = await TweetData.find({

		//case insensitive search on handle
		TwitteruserName: { '$regex':tweeterUserHadleToPullTweets , '$options' : 'i'} ,
		curationstatus:"notcurated"
	})
	
	if(AITweets.length > 0){
		//sort the array by likes to views ratio
		AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
	return res.json({ status: 'ok', tweets: AITweets })
	}else{
		return res.json({ status: 'error', error: 'No Tweets found for user' })
	}

})
// PULL TWEET to show user END

// PULL TWEET  on topic to show user START
app.post('/api/GetTweetsOnTopic', async (req, res) => {

	let topictopulltweets = req.body.topictopulltweets.trim();
	
	const AITweets = await TweetData.find({
		//case insensitive search on handle
		tag: { '$regex':topictopulltweets , '$options' : 'i'} 

	})
	
	if(AITweets.length > 0){
		//sort the array by likes to views ratio
		AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
	return res.json({ status: 'ok', tweets: AITweets })
	}else{
		return res.json({ status: 'error', error: 'No Tweets found for topic' })
	}

})
// PULL TWEET on topic to show user END


// CURATE TWEET  START
app.post('/api/curate', async (req, res) => {

	let tweeterUserHadleToPullTweets = req.body.tweeterUserHadleToPullTweets.trim();
	let topicToPullTweets = req.body.topicToPullTweets.trim();

	
	
	if(topicToPullTweets === "null"){

		const AITweets = await TweetData.find({

			//case insensitive search on handle
			TwitteruserName: { '$regex':tweeterUserHadleToPullTweets , '$options' : 'i'} ,
			curationstatus:"notcurated"
		})

		if(AITweets.length > 0){
			//sort the array by likes to views ratio
			AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)
		return res.json({ status: 'ok', tweets: AITweets })
		}
		else{
			return res.json({ status: 'error', error: 'No Tweets found for user' })
		}

	}

	if(tweeterUserHadleToPullTweets === "null"){

		const AITweets = await TweetData.find({

			//case insensitive search on handle
			tag: { '$regex':topicToPullTweets , '$options' : 'i'} ,
			curationstatus:"notcurated"
		})

		if(AITweets.length > 0){
			//sort the array by likes to views ratio
			AITweets.sort((a, b) => (a.likesTOviewsRatio > b.likesTOviewsRatio) ? -1 : 1)

		return res.json({ status: 'ok', tweets: AITweets })
		}
		else{
			return res.json({ status: 'error', error: 'No Tweets found for topic' })
		}
	}	
	
})
// CURATE TWEET END

// Generate AI TWEET START
app.post('/api/GenerateAITweet', async (req, res) => {

	let neednewAITweetforthisTweet = req.body.neednewAITweetforthisTweet.trim();
	let dbid = req.body.dbid.trim();
	let promptforAI = `${neednewAITweetforthisTweet}${neednewAITweetforthisTweet.slice(-1)==="." ? "" : "."}` //add . if not present
	
	const { Configuration, OpenAIApi } = require("openai");

	const configuration = new Configuration({
		apiKey: process.env.apiKey,
	});
	const openai = new OpenAIApi(configuration);
	let promptfornewtweet = `Write a new Tweet with no hashtags using the following Tweet as context. ${promptforAI}`;


	try{

	
		const newAItweet = await openai.createCompletion({
			"model": "text-curie-001",
			// "model": "text-davinci-003",
			"prompt": promptfornewtweet,
			"temperature": 0.9,
			"max_tokens": 100,
			// "top_p": 1,  this with temperature 0.9 gives bad results
			"frequency_penalty": 0.37,
			"presence_penalty": 0,
			// "stop": ["\n\n"]
		});

		console.log(newAItweet.data.usage.total_tokens)
		total_tokens_used_byAI = newAItweet.data.usage.total_tokens;
		

		if(newAItweet){

			//add tokens used to db
			TweetData.findByIdAndUpdate(dbid, {$inc: {total_tokens: total_tokens_used_byAI}}, {new: true}, (err, doc) => {
				if (err) return handleError(err);
			});
			// tokeuseremail = "genericuser@gmail.com"
			// UserData.findByIdAndUpdate(tokeuseremail, {$inc: {total_tokens: total_tokens_used_byAI}}, {new: true}, (err, doc) => {
			// 	if (err) return handleError(err);
			// });


			return res.json({ status: 'ok', newAItweet: newAItweet.data.choices[0].text })
			}else{
				return res.json({ status: 'error', error: 'Tweet Generation failed by AI' })
		}
	}
	catch(error){{
		console.log(error)
		return res.json({ status: 'error', error: 'Tweet Generation failed by AI' })
	}}
	

})
// generate AI TWEET END







app.listen(PORT, () => {
	console.log(`Server started on ${PORT}`)
})

