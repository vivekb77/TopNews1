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

router.post('/PostImageTweet', async (req, res) => {
    try {
        //only post Media Tweet from 7am to 11pm
        const currentTimeUTC = new Date();
        const nztOffset = 13 * 60;
        const currentTimeNZT = new Date(currentTimeUTC.getTime() + nztOffset * 60 * 1000);
        const startTimeNZT = new Date(currentTimeNZT);
        startTimeNZT.setHours(6, 55, 0);
        const endTimeNZT = new Date(currentTimeNZT);
        endTimeNZT.setHours(23, 5, 0);

        if (currentTimeNZT >= startTimeNZT && currentTimeNZT <= endTimeNZT) {
            console.log("Posting Media Tweet: " + currentTimeNZT);
            await PostImageTweet();
            return res.json({ status: 'ok', message: "Posted Media Tweet: " + currentTimeNZT })
        } else {
            console.log("Skipping Media Tweet: " + currentTimeNZT);
            return res.json({ status: 'ok', message: "Skipped Media Tweet: " + currentTimeNZT })
        }
    } catch (err) {
        console.log(err);
        return res.json({ status: 'error' })
    }
})

async function PostImageTweet() {
    try {
        const mediaId = await client.v1.uploadMedia(
            "/tmp/twitteradimage.png"
        );
        await rwClient.v2.tweet({
            text:
                "#NewZealand #LatestNEWS #NZNews #AucklandNews #WellingtonNews Read more #NEWS at https://newsexpress.co.nz",
            media: { media_ids: [mediaId] },
        });
        console.log("Media Tweet posted successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = router;
// https://www.geeksforgeeks.org/tweet-using-node-js-and-twitter-api/
// https://www.npmjs.com/package/twitter-api-v2