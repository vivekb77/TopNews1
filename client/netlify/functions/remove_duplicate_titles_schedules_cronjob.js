const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {

  await axios
  .post('https://topnews7.vercel.app/api/removeDuplicateTitles')
  .then((response) => {
    if (response.status === 200) {
      console.log('Duplicate titles removal: ', response.data)
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
