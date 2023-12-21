const moment = require('moment-timezone');
const express = require('express')
const router = express.Router()
const axios = require('axios');
const Parser = require('rss-parser');
var cron = require('node-cron');
const xml2js = require('xml2js');
const NewsData = require('../models/nz_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')


let addedArticlesCount;
let skippedArticlesCount;
let errorAddingArticlesCount;
// Get RSS feed from new providers whenever needed with a post request to api/cron
router.post('/cronstuffonlynorth', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.stuff.co.nz/rss', "STUFF");
	// await fetchDataFromRSS('https://www.waikatotimes.co.nz/rss', "WAIKATO TIMES");
	// AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: `ok`, message: `Cron job completed successfully for stuff North. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronstuffsouth', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.stuff.co.nz/rss', "STUFF");
	// await fetchDataFromRSS('https://www.thepress.co.nz/rss', "THE PRESS");
	// await fetchDataFromRSS('https://www.thepost.co.nz/rss', "THE POST");
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for STUFF SOUTH. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnzherald', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/curated/78/?outputType=xml&_website=nzh', "NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/nz/?outputType=xml&_website=nzh', "NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/business/?outputType=xml&_website=nzh', "NZ Herald")
	await fetchDataFromRSS('https://www.nzherald.co.nz/arc/outboundfeeds/rss/section/world/?outputType=xml&_website=nzh', "NZ Herald")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for NZ Herald. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronrnz', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/on-the-inside.xml', "RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/national.xml', "RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/political.xml', "RNZ")
	await fetchDataFromRSS('https://www.rnz.co.nz/rss/country.xml', "RNZ")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for RNZ. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/crongooglenews', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://news.google.com/rss?hl=en-NZ&gl=NZ&ceid=NZ:en', "GOOGLENEWS")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for google news. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronnewstalkzb', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://www.newstalkzb.co.nz/rssfeed', "NEWSTALKZB")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for NEWSTALKZB. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/cronbusinessdesk', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://businessdesk.co.nz/feed', "BUSINESSDESK")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for business desk. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

router.post('/crontpplus', async (req, res) => {
	addedArticlesCount = 0;
	skippedArticlesCount = 0;
	errorAddingArticlesCount = 0;
	await fetchDataFromRSS('https://tpplus.co.nz/feed/', "TPPLUS")
	AddDateTimeOfLastPull(new Date().toLocaleString());
	return res.json({ status: 'ok', message: `Cron job completed successfully for TP PLUS. Added ${addedArticlesCount}, Skipped ${skippedArticlesCount}, Error ${errorAddingArticlesCount}` })
});

async function fetchDataFromRSS(sourceUrl, articleSource) {
	try {
		const response = await axios.get(sourceUrl);
		if (response.status === 200) {
			const parser = new Parser();
			const parsedrssfeedforstuff = await parser.parseString(response.data); //using rss parser , this does not parse image url
			const parserrssfeed = await xml2js.parseStringPromise(response.data) //this parses image url

			let NewsItemsArray = [];
			const timeZone = 'Pacific/Auckland';

			//TPPLUS
			if (articleSource == "TPPLUS") {
				parserrssfeed.rss.channel[0].item.forEach(item => {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: item.title[0],
						articleUrl: item.link[0],
						articleGuid: guid = item.guid[0]['_'],
						articlePublicationDate: new Date(item.pubDate[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				});
			}

			//BUSINESSDESK
			if (articleSource == "BUSINESSDESK") {
				//only pull last 20 articles
				for (let i = 0; i < 20; i++) {

					//only add if image url is present
					const enclosure = parserrssfeed.rss.channel[0].item[i]['media:content']?.[0];
					const imageUrl = enclosure?.['$']?.['url'] ?? null;
					if (imageUrl) {
						const newsItem = {
							displayOnFE: true,
							articleSource: articleSource,
							articleTitle: parserrssfeed.rss.channel[0].item[i].title[0],
							articleUrl: parserrssfeed.rss.channel[0].item[i].link[0],
							teaserImageUrl: parserrssfeed.rss.channel[0].item[i]['media:content'][0]['$']['url'],
							articleAuthor: parserrssfeed.rss.channel[0].item[i]['dc:creator'][0],
							articleGuid: parserrssfeed.rss.channel[0].item[i].guid[0]['_'],
							articlePublicationDate: new Date(parserrssfeed.rss.channel[0].item[i].pubDate[0]),
							articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
						};
						NewsItemsArray.push(newsItem);
					}
				}
			}

			//NEWSTALKZB
			if (articleSource == "NEWSTALKZB") {
				parserrssfeed.rss.channel[0].item.forEach(item => {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: item.title[0],
						articleUrl: item.link[0],
						teaserImageUrl: item['media:content'][0]['$']['url'],
						articleGuid: guid = item.guid[0]['_'],
						articlePublicationDate: new Date(item.pubDate[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				});
			}

			//google news for 1news, newshub , newsroom, otago daily news, reseller news
			if (articleSource == "GOOGLENEWS") {
				parserrssfeed.rss.channel[0].item.forEach(item => {
					const newsItem = {
						displayOnFE: true,
						articleSource: item.source[0]['_'],
						articleTitle: item.title[0].split(' - ')[0], //google news add source at the end of title, remove it
						articleUrl: item.link[0],
						articleGuid: guid = item.guid[0]['_'],
						articlePublicationDate: new Date(item.pubDate[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					if (newsItem.articleSource === "Newshub" || newsItem.articleSource === "1News" || newsItem.articleSource === "Newsroom" || newsItem.articleSource === "Otago Daily Times" || newsItem.articleSource === "Reseller News" || newsItem.articleSource === "SunLive" || newsItem.articleSource === "Scoop") {
						NewsItemsArray.push(newsItem);
					}
				});
			}

			//stuff
			if (articleSource == "STUFF") {
				parsedrssfeedforstuff.items.forEach(item => {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: item.title,
						articleDescription: item.contentSnippet,
						articleUrl: item.link,
						teaserImageUrl: item.enclosure.url,
						articleAuthor: item['dc:creator'],
						articleGuid: item.guid,
						articlePublicationDate: new Date(item.pubDate),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				});
				NewsItemsArray.splice(10); //remove all after 5 to fasten db writes
			}

			//nz herald
			if (articleSource == "NZ Herald") {
				parserrssfeed.rss.channel[0].item.forEach(item => {
					const newsItem = {
						displayOnFE: true,
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
			if (articleSource == "RNZ") {
				parsedrssfeedforstuff.items.forEach(item => {
					const newsItem = {
						displayOnFE: true,
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
			if (articleSource == "THE POST") {
				//only pull last 25 articles
				for (let i = 0; i < 25; i++) {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: parserrssfeed.feed.entry[i].title[0],
						articleDescription: parserrssfeed.feed.entry[i].summary[0],
						articleUrl: parserrssfeed.feed.entry[i].link[0]['$'].href,
						teaserImageUrl: parserrssfeed.feed.entry[i]['media:content'][0]['$']['url'],
						articleAuthor: parserrssfeed.feed.entry[i].author[0].name[0],
						articleGuid: parserrssfeed.feed.entry[i].id[0].slice(0, parserrssfeed.feed.entry[i].id[0].search(regex) + 10),
						articlePublicationDate: new Date(parserrssfeed.feed.entry[i].published[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				};
			}

			//the press
			if (articleSource == "THE PRESS") {
				//only pull last 25
				for (let i = 0; i < 25; i++) {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: parserrssfeed.feed.entry[i].title[0],
						articleDescription: parserrssfeed.feed.entry[i].summary[0],
						articleUrl: parserrssfeed.feed.entry[i].link[0]['$'].href,
						teaserImageUrl: parserrssfeed.feed.entry[i]['media:content'][0]['$']['url'],
						articleAuthor: parserrssfeed.feed.entry[i].author[0].name[0],
						articleGuid: parserrssfeed.feed.entry[i].id[0].slice(0, parserrssfeed.feed.entry[i].id[0].search(regex) + 10),
						articlePublicationDate: new Date(parserrssfeed.feed.entry[i].published[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				}
			}

			//waikato times
			if (articleSource == "WAIKATO TIMES") {

				parserrssfeed.feed.entry.forEach(item => {
					const newsItem = {
						displayOnFE: true,
						articleSource: articleSource,
						articleTitle: item.title[0],
						articleDescription: item.summary[0],
						articleUrl: item.link[0]['$'].href,
						teaserImageUrl: item['media:content'][0]['$']['url'],
						articleAuthor: item.author[0].name[0],
						articleGuid: item.id[0].slice(0, item.id[0].search(regex) + 10),
						articlePublicationDate: new Date(item.published[0]),
						articleImportedToTopNewsDate: moment().tz(timeZone).toDate()
					};
					NewsItemsArray.push(newsItem);
				});
				NewsItemsArray.splice(20); //remove all after 20
			}
			await addNewsItemsToDB(NewsItemsArray)
		} else {
			console.error('Error fetching RSS feed: status code - ', response.status);
		}

	} catch (error) {
		console.error('Error fetching or parsing RSS feed:', error.message);
	}
}

//add news articles to mongo db, do not add if the guid is already present

async function addNewsItemsToDB(NewsItemsArray) {

	try {
		for (const item of NewsItemsArray) {
			const existingItem = await NewsData.findOne({ articleGuid: item.articleGuid });
			if (existingItem) {
				skippedArticlesCount++
				// console.log('Skipping ' + item.articleSource);

			} else {
				addedArticlesCount++;
				await NewsData.create(item);
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
		DateTimeOfLastPullModel.findByIdAndUpdate("64b7bd95181d90534a16cb5a", { dateTimeOfLastPull_NZ: new Date(dateTimeOfLastPull) }, { new: false }, (err, doc) => {
		});
		console.log("dateTimeOfLastPull updated");
	} catch {
		console.log("dateTimeOfLastPull not updated");
	}
}

module.exports = router;