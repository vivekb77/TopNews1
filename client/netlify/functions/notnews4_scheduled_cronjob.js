const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

  //INSIDEGOVERNMENTNZ
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsinsidegovernmentnz')
    .then((response) => {
      if (response.status === 200) {
        console.log('INSIDEGOVERNMENTNZ: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //NORIGHTTURN
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsnorightturn')
    .then((response) => {
      if (response.status === 200) {
        console.log('NORIGHTTURN: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //THESTANDARD.ORG.NZ
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsthestandardorgnz')
    .then((response) => {
      if (response.status === 200) {
        console.log('THESTANDARD.ORG.NZ: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //BEEHIVE.GOVT.NZ
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsbeehivegovtnz')
    .then((response) => {
      if (response.status === 200) {
        console.log('BEEHIVE.GOVT.NZ: ', response.data)
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
