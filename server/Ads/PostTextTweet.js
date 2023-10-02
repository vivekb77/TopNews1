const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const axios = require('axios');
const { TwitterApi } = require("twitter-api-v2");
const NotNewsModel = require('../models/not_news.model')

const client = new TwitterApi({
    appKey: "cISfV86E8UFutenkbehxznw0V",
    appSecret: "Z5uAHCmleWjVfWvZKknA1JPNkc0zHnE4PMTqW5r5Ki6xqSJX0w",
    accessToken: "1688843792076709888-s1pnNf0YWT81ox2Kwxo21bExYBjsfd",
    accessSecret: "P4U06O3lFtMfZ2ostjczuzlWnrE02ea9TJosESRpo48tt",
});

const rwClient = client.readWrite;

router.post('/PostTextTweet', async (req, res) => {
    try {
        await postTextTweet();
        return res.json({ status: 'ok' })
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function postTextTweet() {
    let NotNewsArray = await getNotNews();
    const randomNum = Math.floor(Math.random() * 18);
    let TweetText = `${NotNewsArray[randomNum].articleTitle} || Article by ${NotNewsArray[randomNum].articleSource} || #NewZealand #latestNEWS #AucklandNews #WellingtonNews ${NotNewsArray[randomNum].articleUrl}`
    try {
        await rwClient.v2.tweet(
            TweetText);
        console.log("Text Tweet posted successfully");
    } catch (error) {
        console.log(error);
    }
}

async function getNotNews() {
    const timeZone = 'Pacific/Auckland';
    const currentDate = moment().tz(timeZone).startOf('day').toDate();
    let NotNewsArray = [];
    NotNewsArray = await NotNewsModel.find({
        displayOnFE: true,
        articlePublicationDate: {
            $gte: currentDate,
            $lt: moment(currentDate).add(1, 'day').toDate()
        }
    })
    NotNewsArray.sort((a, b) => (a.articlePublicationDate > b.articlePublicationDate) ? -1 : 1)
    NotNewsArray = NotNewsArray.slice(0, 20);

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
        NotNewsArray[f].articleAuthor = formattedDate;
    }
    return NotNewsArray;
}
module.exports = router;