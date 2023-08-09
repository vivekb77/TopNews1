const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  console.log("Added articles AU:");
  
  //sky news
  await axios
  .post('https://topnews7.vercel.app/api/cronskynewsau')
  .then((response) => {
    if (response.status === 200) {
      console.log('SKYNEWS: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //guardian au
  await axios
  .post('https://topnews7.vercel.app/api/crontheguardianau')
  .then((response) => {
    if (response.status === 200) {
      console.log('GUARDIAN AU: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //guardian uk
  await axios
  .post('https://topnews7.vercel.app/api/crontheguardianuk')
  .then((response) => {
    if (response.status === 200) {
      console.log('GUARDIAN UK: ', response.data)
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
