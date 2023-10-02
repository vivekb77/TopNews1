const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  
//create add
  await axios
  .post('https://topnews7.vercel.app/api/CreateAd')
  .then((response) => {
    if (response.status === 200) {
      console.log('Create Ad: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //post add
  await axios
  .post('https://topnews7.vercel.app/api/PostAd')
  .then((response) => {
    if (response.status === 200) {
      console.log('Post Ad: ', response.data)
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
