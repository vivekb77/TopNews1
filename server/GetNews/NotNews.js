const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NotNewsModel = require('../models/not_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')
const axios = require('axios');

//get not news articles
router.get('/GetNotNews', async (req, res) => {

    let topictopufllnews = "PullAllNews";
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate(); // Get the current date in the specified time zone

    let NotNewsArray = [];
    let NotNewsArrayYesterday = [];
    if (topictopufllnews == "PullAllNews") {
        NotNewsArray = await NotNewsModel.find({
            displayOnFE: true,
            articlePublicationDate: {
                $gte: currentDate,
                $lt: moment(currentDate).add(1, 'day').toDate()
            }

        })
    }
    else {
        //this will be need if want to pull articles for specific provider
        NotNewsArray = await NotNewsModel.find({
            articleSource: { '$regex': topictopulltweets, '$options': 'i' },
            displayOnFE: true
        })
    }

    //if total not news articles today are less than 10, pull yesterdays articles and add
    if (NotNewsArray.length < 25) {

        NotNewsArrayYesterday = await NotNewsModel.find({
            displayOnFE: true,
            articlePublicationDate: {
                $gte: moment(currentDate).add(-1, 'day').toDate(),
                $lt: currentDate  //these 2 for only yesterday's not news
            }

        })
        for (let z = 0; z < NotNewsArrayYesterday.length; z++) {
            NotNewsArray.push(NotNewsArrayYesterday[z]);
        }
    }

    if (NotNewsArray.length > 0) {
        //sort the array by date
        NotNewsArray.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)
        NotNewsArray = NotNewsArray.slice(0, 25);
        //shuffle array
        for (let i = NotNewsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [NotNewsArray[i], NotNewsArray[j]] = [NotNewsArray[j], NotNewsArray[i]];
        }
        
        for (let f = 0; f < NotNewsArray.length; f++) {
            const inputDate = new Date(NotNewsArray[f].articlePublicationDate);

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
            NotNewsArray[f].articleAuthor = formattedDate; //updating author field as new date is of string type can t reassign to date fields
        }
        res.setHeader('Vercel-CDN-Cache-Control', 'public, max-age=300, stale-while-revalidate=3600');
        res.setHeader('Cache-Control','max-age=0, s-maxage=60', 'stale-while-revalidate');
        return res.json({ status: 'ok', notnews: NotNewsArray })
    } else {
        return res.json({ status: 'error', errormessage: 'Something went wrong' })
    }

})


module.exports = router;