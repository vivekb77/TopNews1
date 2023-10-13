//Alternate history - What if dogs were not domesticated, if electricity was not discovered
//Future scientific discovery

const express = require('express')
const router = express.Router()
const moment = require('moment-timezone');
const axios = require('axios');
const { TwitterApi } = require("twitter-api-v2");
const { Configuration, OpenAIApi } = require("openai");

const client = new TwitterApi({
    appKey: "cISfV86E8UFutenkbehxznw0V",
    appSecret: "Z5uAHCmleWjVfWvZKknA1JPNkc0zHnE4PMTqW5r5Ki6xqSJX0w",
    accessToken: "1688843792076709888-s1pnNf0YWT81ox2Kwxo21bExYBjsfd",
    accessSecret: "P4U06O3lFtMfZ2ostjczuzlWnrE02ea9TJosESRpo48tt",
});

const rwClient = client.readWrite;

router.post('/PostArticleTweet', async (req, res) => {
    try {
        //only post Article Tweet from 7am to 11pm
        const currentTimeUTC = new Date();
        const nztOffset = 13 * 60;
        const currentTimeNZT = new Date(currentTimeUTC.getTime() + nztOffset * 60 * 1000);
        const startTimeNZT = new Date(currentTimeNZT);
        startTimeNZT.setHours(6, 55, 0);
        const endTimeNZT = new Date(currentTimeNZT);
        endTimeNZT.setHours(23, 5, 0);

        if (currentTimeNZT >= startTimeNZT && currentTimeNZT <= endTimeNZT) {
            console.log("Posting AIArticle Tweet: " + currentTimeNZT);
            await postArticleTweet();
            return res.json({ status: 'ok', message: "Posted AIArticle Tweet: " + currentTimeNZT })
        } else {
            console.log("Skipping AIArticle Tweet: " + currentTimeNZT);
            return res.json({ status: 'ok', message: "Skipped AIArticle Tweet: " + currentTimeNZT })
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function postArticleTweet() {
    let AIArticle = await getAIArticle();
    if (AIArticle) {
        let TweetText = `${AIArticle}`
        try {
            await rwClient.v2.tweet(
                TweetText);
            console.log("AIArticle Tweet posted successfully");
        } catch (error) {
            console.log(error);
        }
    }
}


async function getAIArticle() {
    
    const configuration = new Configuration({
        apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);


    let prompts = ['Generate a new random tweet on a historical fact.','Generate a new random tweet on a geographical fact.','Generate a new random tweet on a science fact.','Generate a new random tweet on a mathematics fact.'];
    let AIArticle;
    const randomNum = Math.floor(Math.random() * prompts.length);

    try {
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo-instruct",
            prompt: prompts[randomNum],
            max_tokens: 70,
            temperature: 0.5,
        });
        if (response.status==200) {
            AIArticle = response.data.choices[0].text;
          } else {
            console.error("OpenAI API request failed with status code:", response.status);
          }
        return AIArticle;
    } catch (error) {
        console.error("Error generating AIArticle:", error);
        return null;
    }

}
module.exports = router;
// https://github.com/plhery/node-twitter-api-v2/blob/HEAD/doc/v2.md#create-a-tweet
// https://the-trivia-api.com/docs/v2/#tag/Questions/operation/getRandomQuestions