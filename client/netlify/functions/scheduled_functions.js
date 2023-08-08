
const { schedule } = require("@netlify/functions");
const axios = require('axios')

const handler = async function(event, context) {
    console.log("Added articles:", event);
    
    //post req start
    axios
    .post('https://topnews7.vercel.app/api/cronstuffnorth')
    .then((response) => {
      if (response.status === 200) {
        console.log('Req body:', response.data)
      }
    })
    .catch((e) => {
      console.error(e)
    })
    //end

    return {
        statusCode: 200,
    };
};

exports.handler = schedule("@hourly", handler);
