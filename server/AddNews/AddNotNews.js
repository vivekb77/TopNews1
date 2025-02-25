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
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News daily blog. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewskiwiblog', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.kiwiblog.co.nz/feed', "KIWIBLOG");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News kiwi blog. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsinterest', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.interest.co.nz/rss', "INTEREST CO NZ");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News INTEREST CO NZ. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsgreaterauckland', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.greaterauckland.org.nz/feed', "GREATERAUCKLAND");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News greater auckland. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsnztech', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://nztech.org.nz/news/feed', "NZTECH ORG");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News NZTECH ORG. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewstimes', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.times.co.nz/feed/', "TIMES")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News TIMES Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewslocalmatters', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.localmatters.co.nz/feed/', "LOCALMATTERS")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News Local matters Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsaucklandcouncil', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://ourauckland.aucklandcouncil.govt.nz/rss', "AUCKLANDCOUNCIL")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News auckland council Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsinsidegovernmentnz', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://insidegovernment.co.nz/feed/', "INSIDEGOVERNMENTNZ")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News INSIDEGOVERNMENTNZ Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsnorightturn', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://norightturn.blogspot.com/feeds/posts/default?alt=rss', "NORIGHTTURN")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News NoRightTurn Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsthestandardorgnz', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://thestandard.org.nz/feed/', "THESTANDARD ORG NZ")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News thestandardorgnz Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnotnewsbeehivegovtnz', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.beehive.govt.nz/rss.xml', "BEEHIVE GOVT NZ")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for Not News beehivegovtnz Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

async function fetchDataFromRSS(sourceUrl, articleSource) {
	try {
		const response = await axios.get(sourceUrl);
		const parser = new Parser();
		const parsedrssfeednoimage = await parser.parseString(response.data); //using rss parser , this does not parse image url
		const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

		let NotNewsItemsArray = [];
		const timeZone = 'Pacific/Auckland';

	// BEEHIVE GOVT NZ
	if (articleSource == "BEEHIVE GOVT NZ") {
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

		// THESTANDARD ORG NZ
		if (articleSource == "THESTANDARD ORG NZ") {
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

		// AUCKLANDCOUNCIL
		if (articleSource == "AUCKLANDCOUNCIL") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].link,
					articlePublicationDate: new Date(parsedrssfeednoimage.items[i].isoDate),
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}

		// INSIDEGOVERNMENTNZ
		if (articleSource == "INSIDEGOVERNMENTNZ") {
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

		// NORIGHTTURN
		if (articleSource == "NORIGHTTURN") {
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
		// INTEREST
		if (articleSource == "INTEREST CO NZ") {
			for (let i = 0; i < 10; i++) {
				const notNewsItem = {
					displayOnFE: true,
					articleSource: articleSource,
					articleTitle: parsedrssfeednoimage.items[i].title,
					articleUrl: parsedrssfeednoimage.items[i].link,
					articleGuid: parsedrssfeednoimage.items[i].guid,
					articlePublicationDate: moment().tz(timeZone).toDate(), //because this feed has clean readable date
					articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
				};
				NotNewsItemsArray.push(notNewsItem);
			};
		}

		// GREATERAUCKLAND
		if (articleSource == "GREATERAUCKLAND") {
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

		// NZTECH
		if (articleSource == "NZTECH ORG") {
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

		//TIMES
		if (articleSource == "TIMES") {
			parserrssfeed.rss.channel[0].item.forEach(item => {
				// don't pull if title is weird , here a lot of titles are bad with no content 
				if (item.title[0].includes("Gallery")) {
					//skip
				}
				else {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: item.title[0],
						articleUrl: item.link[0],
						articleGuid: guid = item.guid[0]['_'],
						articlePublicationDate: new Date(item.pubDate[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NotNewsItemsArray.push(newsItem);
				}
			});
		}

		//LOCALMATTERS
		if (articleSource == "LOCALMATTERS") {
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