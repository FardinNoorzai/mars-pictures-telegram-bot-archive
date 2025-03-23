const axios = require('axios');
const https = require('https');
require('dotenv').config({path: '../.env'});
const agent = new https.Agent({ family: 4 });

async function fetchPhotos(date) {
  console.log(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${process.env.NASA_API_KEY}`);
  const response = await axios.get(
    `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?earth_date=${date}&api_key=${process.env.NASA_API_KEY}`,
    { httpsAgent: agent }
  );
  let count = 0;
  for (const photo of response.data.photos) {
    photo.count = count++; 
  }
  return response.data.photos;
}


module.exports = { fetchPhotos };