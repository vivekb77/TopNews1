const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {

  //kiwiblog
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewskiwiblog')
    .then((response) => {
      if (response.status === 200) {
        console.log('KIWIBLOG: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //interest
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsinterest')
    .then((response) => {
      if (response.status === 200) {
        console.log('INTEREST: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //greater auckland
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsgreaterauckland')
    .then((response) => {
      if (response.status === 200) {
        console.log('GREATER AUCKLAND: ', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })

  //NZTECH
  await axios
    .post('https://topnews7.vercel.app/api/cronnotnewsnztech')
    .then((response) => {
      if (response.status === 200) {
        console.log('NZTECH: ', response.data)
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
