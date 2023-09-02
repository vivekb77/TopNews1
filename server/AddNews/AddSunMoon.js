const axios = require('axios');

const options = {
  method: 'GET',
  url: 'https://moon-phase.p.rapidapi.com/advanced',
  headers: {
    'X-RapidAPI-Key': '50a1718df1mshce3d9fe74425cb5p1f1428jsnfc2fb8ac68c9',
    'X-RapidAPI-Host': 'moon-phase.p.rapidapi.com'
  }
};

try {
	const response = await axios.request(options);
	console.log(response.data);
} catch (error) {
	console.error(error);
}