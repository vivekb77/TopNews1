const moment = require('moment-timezone');
const express = require('express')
const router = express.Router()
const axios = require('axios');
const Parser = require('rss-parser');
var cron = require('node-cron');
const xml2js = require('xml2js');
const NewsDataWorld = require('../models/world_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')

 
let addedArticlesCount;
let skippedArticlesCount;
let errorAddingArticlesCount;
// Get RSS feed from new providers whenever needed with a post request to api/cron


router.post('/crontheguardianworldusa', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.theguardian.com/us-news/rss',"THE GUARDIAN");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Guardian USA. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});

router.post('/crontheguardianworld', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.theguardian.com/world/rss',"THE GUARDIAN");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Guardian World. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});

async function fetchDataFromRSS(sourceUrl,articleSource) {
  try {
    const response = await axios.get(sourceUrl);
    const parser = new Parser();
    const parsedrssfeedforstuff = await parser.parseString(response.data); //using rss parser , this does not parse image url
	const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

	let NewsItemsArray= [];
	const timeZone = 'Pacific/Auckland';

	//THE GUARDIAN
	if(articleSource == "THE GUARDIAN"){
		//only pull last 20 articles
		for (let i = 0; i < 20; i++) {
		const newsItem = {
			displayOnFE:true,
			articleSource: articleSource,
			articleTitle: parserrssfeed.rss.channel[0].item[i].title[0],
			// articleDescription: parserrssfeed.rss.channel[0].item[i].description[0], //description is too long so skipping
			articleUrl: parserrssfeed.rss.channel[0].item[i].link[0],
			teaserImageUrl:parserrssfeed.rss.channel[0].item[i]['media:content'][1]['$']['url'],
			articleAuthor:parserrssfeed.rss.channel[0].item[i]['dc:creator'][0],
			articleGuid:parserrssfeed.rss.channel[0].item[i].guid[0],
			articlePublicationDate: new Date(parserrssfeed.rss.channel[0].item[i].pubDate[0]),
			articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
			};
		NewsItemsArray.push(newsItem);
		};
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
		const existingItem = await NewsDataWorld.findOne({ articleGuid: item.articleGuid });
		if (existingItem) {
			skippedArticlesCount ++
		//   console.log('Skipping ' +item.articleSource);
		 
		} else {
			addedArticlesCount ++;
		  	await NewsDataWorld.create(item);
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
        DateTimeOfLastPullModel.findByIdAndUpdate("64b7bd95181d90534a16cb5a", {dateTimeOfLastPull_World: new Date(dateTimeOfLastPull)}, {new: false}, (err, doc) => {
    });	
        console.log("dateTimeOfLastPull updated");
    }catch(error){
        console.log("dateTimeOfLastPull not updated");
    }
}

module.exports = router;