const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

    //create add
    await axios
        .post('https://topnews7.vercel.app/api/CreateAd')
        .then((response) => {
            if (response.status === 200) {
                console.log('Created Ad for Insta: ', response.data)
            }
        })
        .catch((e) => {
            console.error(e)
        })

    //post on insta
    await axios
        .post('https://topnews7.vercel.app/api/PostOnInsta')
        .then((response) => {
            if (response.status === 200) {
                console.log('Posted on Insta: ', response.data)
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
