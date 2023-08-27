const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const NotNewsModel = require('../models/not_news.model')
const DateTimeOfLastPullModel = require('../models/datetime.model')
const axios = require('axios');

//get not news articles
router.post('/GetNotNews', async (req, res) => {

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
                $lt: moment(currentDate).add(0, 'day').toDate(),
            }

        })
        for (let z = 0; z < NotNewsArrayYesterday.length; z++) {
            NotNewsArray.push(NotNewsArrayYesterday[z]);
        }
    }

    if (NotNewsArray.length > 0) {
        NotNewsArray = NotNewsArray.slice(0, 25);
        //shuffle array
        for (let i = NotNewsArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [NotNewsArray[i], NotNewsArray[j]] = [NotNewsArray[j], NotNewsArray[i]];
        }
        //sort the array by date
        // NotNewsArray.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)

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
        return res.json({ status: 'ok', notnews: NotNewsArray })
    } else {
        return res.json({ status: 'error', errormessage: 'Something went wrong' })
    }

})


module.exports = router;