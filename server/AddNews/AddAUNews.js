const moment = require('moment-timezone');
const express = require('express')
const router = express.Router()
const axios = require('axios');
const Parser = require('rss-parser');
var cron = require('node-cron');
const xml2js = require('xml2js');
const NewsDataAU = require('../models/au_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')

 
let addedArticlesCount;
let skippedArticlesCount;
let errorAddingArticlesCount;
// Get RSS feed from new providers whenever needed with a post request to api/cron
router.post('/cronskynewsau', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.skynews.com.au/rss',"SKY NEWS");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for SKY news AU. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});
router.post('/crontheguardianau', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.theguardian.com/au/rss',"THE GUARDIAN");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully Guardian AU. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});

router.post('/crontheguardianuk', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.theguardian.com/uk/rss',"THE GUARDIAN");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Guardian UK. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});

router.post('/cronthetelegraph', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.telegraph.co.uk/rss.xml',"THE TELEGRAPH");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for TELEGRAPH. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}`})
});

async function fetchDataFromRSS(sourceUrl,articleSource) {
  try {
    const response = await axios.get(sourceUrl);
    const parser = new Parser();
    const parsedrssfeedforstuff = await parser.parseString(response.data); //using rss parser , this does not parse image url
	const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

	let NewsItemsArray= [];
	const timeZone = 'Pacific/Auckland';

	//NEWSCOMAU
	if(articleSource == "SKY NEWS"){
		
		parsedrssfeedforstuff.items.forEach(item => {
			
			//there are links to sections in the feed , don't pull that
			if(item.title == "World" || item.title == "Australia" || item.title == "Homepage Tops Mid Collection"){
			//skip
			}
			else{
				const newsItem = {
					displayOnFE:true,
					articleSource: articleSource,
					articleTitle: item.title,
					articleDescription: item.contentSnippet,
					articleUrl: item.link,
					articleGuid: item.link,
					articlePublicationDate: new Date(parsedrssfeedforstuff.lastBuildDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
					NewsItemsArray.push(newsItem);
			}
		})
	}

	//THE GUARDIAN
	if(articleSource == "THE GUARDIAN"){
		//only pull last 25 articles
		for (let i = 0; i < 25; i++) {
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

	//THE TELEGRAPH
	if(articleSource == "THE TELEGRAPH"){
		//only pull last 20 articles

		for (let i = 0; i < 20; i++) {

			//only add if image url is present
			const enclosure = parserrssfeed.rss.channel[0].item[i].enclosure?.[0];
    		const imageUrl = enclosure?.['$']?.['url'] ?? null;

			if (imageUrl) {
			const newsItem = {
				displayOnFE:true,
				articleSource: articleSource,
				articleTitle: parserrssfeed.rss.channel[0].item[i].title[0],
				// articleDescription: parserrssfeed.rss.channel[0].item[i].description[0], //description is too long so skipping
				articleUrl: parserrssfeed.rss.channel[0].item[i].link[0],
				teaserImageUrl:parserrssfeed.rss.channel[0].item[i].enclosure[0]['$']['url'],
				articleAuthor:parserrssfeed.rss.channel[0].item[i]['dc:creator'][0],
				articleGuid:parserrssfeed.rss.channel[0].item[i].guid[0]['_'],
				articlePublicationDate: new Date(parserrssfeed.rss.channel[0].item[i].pubDate[0]),
				articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NewsItemsArray.push(newsItem);
			}
		}
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
		const existingItem = await NewsDataAU.findOne({ articleGuid: item.articleGuid });
		if (existingItem) {
			skippedArticlesCount ++
		//   console.log('Skipping ' +item.articleSource);
		 
		} else {
			addedArticlesCount ++;
		  	await NewsDataAU.create(item);
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
        DateTimeOfLastPullModel.findByIdAndUpdate("64b7bd95181d90534a16cb5a", {dateTimeOfLastPull_AU: new Date(dateTimeOfLastPull)}, {new: false}, (err, doc) => {
    });	
        console.log("dateTimeOfLastPull updated");
    }catch(error){
        console.log("dateTimeOfLastPull not updated");
    }
}

module.exports = router;