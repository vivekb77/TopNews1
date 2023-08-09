const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  console.log("Added articles world:");
  
  //guardian usa
  await axios
  .post('https://topnews7.vercel.app/api/crontheguardianworldusa')
  .then((response) => {
    if (response.status === 200) {
      console.log('GUARDIAN USA: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //guardian world
  await axios
  .post('https://topnews7.vercel.app/api/crontheguardianworld')
  .then((response) => {
    if (response.status === 200) {
      console.log('GUARDIAN WORLD: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //telegraph
  await axios
  .post('https://topnews7.vercel.app/api/cronthetelegraph')
  .then((response) => {
    if (response.status === 200) {
      console.log('TELEGRAPH: ', response.data)
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
