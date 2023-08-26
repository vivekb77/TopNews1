const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  console.log("Added articles not news:");
  
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

return {
    statusCode: 200,
};
};

exports.handler = schedule("@hourly", handler);
