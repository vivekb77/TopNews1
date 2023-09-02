const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

  //times
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewstimes')
    .then((response) => {
      if (response.status === 200) {
        console.log('TIMES: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //LOCAL MATTERS
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewslocalmatters')
    .then((response) => {
      if (response.status === 200) {
        console.log('LOCAL MATTERS: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

    //aucklancouncil
    await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsaucklandcouncil')
    .then((response) => {
      if (response.status === 200) {
        console.log('AUCKLAND COUNCIL: ', response.data)
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
