const moment = require('moment-timezone');
const express = require('express')
const router = express.Router()
const axios = require('axios');
const Parser = require('rss-parser');
var cron = require('node-cron');
const xml2js = require('xml2js');
const NotNewsModel = require('../models/not_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')


let addedArticlesCount;
let skippedArticlesCount;
let errorAddingArticlesCount;


router.post('/cronnotnewsthespinoff', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://thespinoff.co.nz/feed', "THESPINOFF");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News SpinOFF. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsgreenpeace', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.greenpeace.org/aotearoa/feed', "GREENPEACE");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News Greenpeace. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsysb', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://ysb.co.nz/feed', "YSB");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News YSB. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsdailyblog', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://thedailyblog.co.nz/feed', "DAILYBLOG");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News daily blog. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewskiwiblog', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.kiwiblog.co.nz/feed', "KIWIBLOG");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News kiwi blog. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

async function fetchDataFromRSS(sourceUrl, articleSource) {
	try {
		const response = await axios.get(sourceUrl);
		const parser = new Parser();
		const parsedrssfeednoimage = await parser.parseString(response.data); //using rss parser , this does not parse image url
		const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

		let NotNewsItemsArray = [];
		const timeZone = 'Pacific/Auckland';

		// THESPINOFF
		if (articleSource == "THESPINOFF") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].id,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}

		// GREENPEACE
		if (articleSource == "GREENPEACE") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].guid,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}

		// YSB
		if (articleSource == "YSB") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					// articleDescription: parsedrssfeednoimage.items[i].content,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].guid,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}
		// DAILYBLOG
		if (articleSource == "DAILYBLOG") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					// articleDescription: parsedrssfeednoimage.items[i].content,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].guid,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}
		// KIWIBLOG
		if (articleSource == "KIWIBLOG") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					// articleDescription: parsedrssfeednoimage.items[i].content,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].guid,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}

		await addNewsItemsToDB(NotNewsItemsArray)
	} catch (error) {
		console.error('Error fetching or parsing RSS feed:', error);
	}
}

//add news articles to mongo db, do not add if the guid is already present

async function addNewsItemsToDB(NotNewsItemsArray) {

	try {
		for (const item of NotNewsItemsArray) {
			const existingItem = await NotNewsModel.findOne({ articleGuid: item.articleGuid });
			if (existingItem) {
				skippedArticlesCount++
				// console.log('Skipping ' + item.articleSource);

			} else {
				addedArticlesCount++;
				await NotNewsModel.create(item);
				// console.log('News Inserted ' + item.articleSource);
			}
		}
	} catch (error) {
		errorAddingArticlesCount++
		console.error('Error inserting News article, mostly due to duplicate key' + error);
	}
}

async function AddDateTimeOfLastPull(dateTimeOfLastPull) {
	try {
		DateTimeOfLastPullModel.findByIdAndUpdate("64b7bd95181d90534a16cb5a", { dateTimeOfLastPull_NotNews: new Date(dateTimeOfLastPull) }, { new: false }, (err, doc) => {
		});
		console.log("dateTimeOfLastPull updated");
	} catch (error) {
		console.log("dateTimeOfLastPull not updated");
	}
}

module.exports = router;