const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {

  await axios
  .post('https://topnews7.vercel.app/api/cronremoveWeirdArticles')
  .then((response) => {
    if (response.status === 200) {
      console.log('Weirds articles with specific names removal: ', response.data)
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
