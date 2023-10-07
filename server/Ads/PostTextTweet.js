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
        //only post Text Tweet from 7am to 11pm
        const currentTimeUTC = new Date();
        const nztOffset = 13 * 60;
        const currentTimeNZT = new Date(currentTimeUTC.getTime() + nztOffset * 60 * 1000);
        const startTimeNZT = new Date(currentTimeNZT);
        startTimeNZT.setHours(6, 55, 0);
        const endTimeNZT = new Date(currentTimeNZT);
        endTimeNZT.setHours(23, 5, 0);

        if (currentTimeNZT >= startTimeNZT && currentTimeNZT <= endTimeNZT) {
            console.log("Posting Text Tweet: " + currentTimeNZT);
            await postTextTweet();
            return res.json({ status: 'ok', message: "Posted Text Tweet: " + currentTimeNZT })
        } else {
            console.log("Skipping Text Tweet: " + currentTimeNZT);
            return res.json({ status: 'ok', message: "Skipped Text Tweet: " + currentTimeNZT })
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function postTextTweet() {
    let NotNewsArray = await getNotNews();
    const randomNum = Math.floor(Math.random() * NotNewsArray.length);
    let TweetText = `${NotNewsArray[randomNum].articleTitle} || Article by ${NotNewsArray[randomNum].articleSource} || #NewZealand #LatestNews #NZNews #AucklandNews #WellingtonNews ${NotNewsArray[randomNum].articleUrl}`
    try {
        await rwClient.v2.tweet(
            TweetText);
        console.log("Text Tweet posted successfully");
    } catch (error) {
        console.log(error);
    }
}

router.post('/PostPollTweet', async (req, res) => {
    try {
        //only post Poll Tweet from 7am to 11pm
        const currentTimeUTC = new Date();
        const nztOffset = 13 * 60;
        const currentTimeNZT = new Date(currentTimeUTC.getTime() + nztOffset * 60 * 1000);
        const startTimeNZT = new Date(currentTimeNZT);
        startTimeNZT.setHours(6, 55, 0);
        const endTimeNZT = new Date(currentTimeNZT);
        endTimeNZT.setHours(23, 5, 0);

        if (currentTimeNZT >= startTimeNZT && currentTimeNZT <= endTimeNZT) {
            console.log("Posting Poll Tweet: " + currentTimeNZT);
            await postPollTweet();
            return res.json({ status: 'ok', message: "Posted Poll Tweet: " + currentTimeNZT })
        } else {
            console.log("Skipping Poll Tweet: " + currentTimeNZT);
            return res.json({ status: 'ok', message: "Skipped Poll Tweet: " + currentTimeNZT })
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function postPollTweet() {
    let PollsArray = await getPolls();
    let PollAnswersArray = [];
    const randomNum = Math.floor(Math.random() * PollsArray.length);

    let PollTweetText = `${PollsArray[randomNum].question.text}`
    let correctAnswer = PollsArray[randomNum].correctAnswer;
    //hint for correct answer, make last letter of answer caps
    var lastLetter = correctAnswer.slice(-1).toLowerCase();
    var capitalizedLastLetter = lastLetter.toUpperCase();
    let correctAnswerHint = correctAnswer.slice(0, -1) + capitalizedLastLetter;

    PollAnswersArray.push(correctAnswerHint)
    PollAnswersArray.push(PollsArray[randomNum].incorrectAnswers[0])
    PollAnswersArray.push(PollsArray[randomNum].incorrectAnswers[1])
    PollAnswersArray.push(PollsArray[randomNum].incorrectAnswers[2])

    //shuffle answers
    for (let i = PollAnswersArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [PollAnswersArray[i], PollAnswersArray[j]] = [PollAnswersArray[j], PollAnswersArray[i]];
    }

    try {
        const { data: createdTweet } = await client.v2.tweet(PollTweetText, {
            poll: { duration_minutes: 300, options: [PollAnswersArray[0], PollAnswersArray[1], PollAnswersArray[2], PollAnswersArray[3]] },
        });
        // console.log('Tweet', createdTweet.id, ':', createdTweet.text);
    } catch (error) {
        console.log(error);
    }
}

async function getPolls() {
    let PollsArray = [];

    try {
        const response = await axios.get("https://the-trivia-api.com/v2/questions?limit=10&difficulties=hard,medium&region=NZ&types=text_choice");
        for (let i = 0; i < response.data.length; i++) {
            const pollsItem = {
                question: response.data[i].question,
                correctAnswer: response.data[i].correctAnswer,
                incorrectAnswers: response.data[i].incorrectAnswers,
                category: response.data[i].category,
                difficulty: response.data[i].difficulty,
                regions: response.data[i].regions
            };
            PollsArray.push(pollsItem);
        };
    }
    catch (error) {
        console.log(error);
    }

    return PollsArray;
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
// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#create-a-tweet
// https://the-trivia-api.com/docs/v2/#tag/Questions/operation/getRandomQuestions