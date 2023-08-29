const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
  
  //NEWSTALKZB
  await axios
  .post('https://topnews7.vercel.app/api/cronnewstalkzb')
  .then((response) => {
    if (response.status === 200) {
      console.log('NEWSTALKZB: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

  //BUSINESS DESK
  await axios
  .post('https://topnews7.vercel.app/api/cronbusinessdesk')
  .then((response) => {
    if (response.status === 200) {
      console.log('BUSINESS DESK: ', response.data)
    }
  })
  .catch((e) => {
    console.error(e)
  })

   //TP PLUS
   await axios
   .post('https://topnews7.vercel.app/api/crontpplus')
   .then((response) => {
     if (response.status === 200) {
       console.log('TP PLUS: ', response.data)
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
