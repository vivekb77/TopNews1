const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function (event, context) {
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
  try {
    const response = await axios.post('https://topnews7.vercel.app/api/ResizeImages', 
    {
      "articleSource": "NZ Herald"
    }, 
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic bmV3c2V4cHJlc3M6wqM1MHIwQDc9b1FYOQ==',
      }
    });
    if (response.status === 200) {
      console.log('Resize images:', response.data);
    }
  } catch (error) {
    console.error(error.message);
  }

  return {
    statusCode: 200,
  };
};

exports.handler = schedule("@hourly", handler);
