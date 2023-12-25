const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

    //create add
    await axios
        .post('https://topnews7.vercel.app/api/CreateAd')
        .then((response) => {
            if (response.status === 200) {
                console.log('Created Ad for Twitter: ', response.data)
            }
        })
        .catch((e) => {
            console.error(e)
        })

    //post tweet
    await axios
        .post('https://topnews7.vercel.app/api/PostTweet')
        .then((response) => {
            if (response.status === 200) {
                console.log('Posted Ad on Twitter: ', response.data)
            }
        })
        .catch((e) => {
            console.error(e)
        })

    //post article url
    await axios
        .post('https://topnews7.vercel.app/api/PostTextTweet')
        .then((response) => {
            if (response.status === 200) {
                console.log('Posted Article URL to twitter: ', response.data)
            }
        })
        .catch((e) => {
            console.error(e)
        })

    return {
        statusCode: 200,
    };

};

exports.handler = schedule("@hourly", handler);
