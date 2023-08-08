const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  console.log("Added articles STUFF all:");
  
  //stuff north
  await axios
  .post('https://topnews7.vercel.app/api/cronstuffnorth')
  .then((response) => {
    if (response.status === 200) {
      console.log('STUFF NORTH: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //stuff south
  await axios
  .post('https://topnews7.vercel.app/api/cronstuffsouth')
  .then((response) => {
    if (response.status === 200) {
      console.log('STUFF SOUTH: ', response.data)
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
