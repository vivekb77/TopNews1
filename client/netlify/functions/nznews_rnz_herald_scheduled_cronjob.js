const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  
  //rnz
  await axios
  .post('https://topnews7.vercel.app/api/cronrnz')
  .then((response) => {
    if (response.status === 200) {
      console.log('RNZ: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

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

   //googlenews
   await axios
   .post('https://topnews7.vercel.app/api/cronrgooglenews')
   .then((response) => {
     if (response.status === 200) {
       console.log('Google news: ', response.data)
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
