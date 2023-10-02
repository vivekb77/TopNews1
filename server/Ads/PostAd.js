const express = require('express')
const router = express.Router()
const { TwitterApi } = require("twitter-api-v2");

const client = new TwitterApi({
    appKey: "cISfV86E8UFutenkbehxznw0V",
    appSecret: "Z5uAHCmleWjVfWvZKknA1JPNkc0zHnE4PMTqW5r5Ki6xqSJX0w",
    accessToken: "1688843792076709888-s1pnNf0YWT81ox2Kwxo21bExYBjsfd",
    accessSecret: "P4U06O3lFtMfZ2ostjczuzlWnrE02ea9TJosESRpo48tt",
});

const rwClient = client.readWrite;

router.post('/PostAd', async (req, res) => {
    try {
        await postAd();
        // await postTextTweet();
        return res.json({ status: 'ok' })
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function postAd() {
    try {
        const mediaId = await client.v1.uploadMedia(
            "./Ads/twitteradimage.png"
        );
        await rwClient.v2.tweet({
            text:
                "#NewZealand #latestNEWS #AucklandNews #WellingtonNews Read more #NEWS at https://newsexpress.co.nz",
            media: { media_ids: [mediaId] },
        });
        console.log("Media Tweet posted successfully");
    } catch (error) {
        console.log(error);
    }
}

async function postTextTweet() {
    try {
        await rwClient.v2.tweet(
            "https://newsexpress.co.nz/");
        console.log("Text Tweet posted successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;
// https://www.geeksforgeeks.org/tweet-using-node-js-and-twitter-api/