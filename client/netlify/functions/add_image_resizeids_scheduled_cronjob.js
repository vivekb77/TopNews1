const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  //nz herald
  await axios
  .post('https://topnews7.vercel.app/api/cronnzherald')
  .then((response) => {
    if (response.status === 200) {
      console.log('NZ HERALD: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //resize images
  await axios
  .post('https://topnews7.vercel.app/api/ResizeImages')
  .then((response) => {
    if (response.status === 200) {
      console.log('Resize images : ', response.data)
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
