const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NewsDataAU = require('../models/au_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')
const axios = require('axios');

//get news articles
router.get('/GetNewsForAU', async (req, res) => {

    let topictopulltweets = "PullAllNews";
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone

    let AITweets = [];
    let AITweetsYesterday = [];
    if (topictopulltweets == "PullAllNews") {
        AITweets = await NewsDataAU.find({
            displayOnFE: true,
            articlePublicationDate: {
                $gte: currentDate,
                $lt: moment(currentDate).add(1, 'day').toDate()
            }

        })
    }

    else {
        //this will be need if want to pull articles for specific provider
        AITweets = await NewsDataAU.find({
            articleSource: { '$regex': topictopulltweets, '$options': 'i' },
            displayOnFE: true
        })
    }
    //if total news articles today are less than 20, pull yesterdays articles and add
    if (AITweets.length < 20) {

        AITweetsYesterday = await NewsDataAU.find({
            displayOnFE: true,
            articlePublicationDate: {
                $lt: moment(currentDate).add(0, 'day').toDate(),
            }

        })
        for (let z = 0; z < AITweetsYesterday.length; z++) {
            AITweets.push(AITweetsYesterday[z]);
        }
    }

    if (AITweets.length > 0) {
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
        res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        res.setHeader('CDN-Cache-Control', 'max-age=60');
        res.setHeader('Cache-Control', 'public, max-age=60');
        return res.json({ status: 'ok', tweets: AITweets })
    } else {
        return res.json({ status: 'error', errormessage: 'Something went wrong' })
    }

})


//get last article update datetime
router.get('/dateTimeOfLastPullAU', async (req, res) => {
    try {
        const dateTimeOfLastPull = await DateTimeOfLastPullModel.find({
            _id: "64b7bd95181d90534a16cb5a"
        })
        const inputDate = new Date(dateTimeOfLastPull[0].dateTimeOfLastPull_AU);
        const options = {
            day: '2-digit',
            month: 'short',
            // year: '2-digit', 
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
            timeZone: 'Pacific/Auckland'
        };
        res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=60');
        res.setHeader('CDN-Cache-Control', 'max-age=60');
        res.setHeader('Cache-Control', 'public, max-age=30');
        return res.json({ status: 'ok', dateTimeOfLastPull: inputDate.toLocaleDateString('en-US', options) })

    } catch (error) {
        res.json({ status: 'error', errormessage: 'Error getting dateTimeOfLastPull' })
    }
})


module.exports = router;