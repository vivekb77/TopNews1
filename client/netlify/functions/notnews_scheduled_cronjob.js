const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

  //spinoff
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsthespinoff')
    .then((response) => {
      if (response.status === 200) {
        console.log('SPINOFF: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //greenpeace
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsgreenpeace')
    .then((response) => {
      if (response.status === 200) {
        console.log('GREENPEACE: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //YSB
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsYSB')
    .then((response) => {
      if (response.status === 200) {
        console.log('YSB: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //daily blog
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsdailyblog')
    .then((response) => {
      if (response.status === 200) {
        console.log('DAILYBLOG: ', response.data)
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
