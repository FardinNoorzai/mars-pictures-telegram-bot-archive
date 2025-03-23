const { model } = require('mongoose');
const {Photos} = require('../models/photos');
const {fetchPhotos} = require('./nasa_api_service');
async function fetchAndCachePhotos(date) {
    const photos = await fetchPhotos(date);
    const photo = new Photos();
    photo.total = photos.length;
    photo.date = date;
    photo.data = photos;
    return await photo.save();
}


async function getPhotos(date, record) {
    const photoDoc = await Photos.findOne({date: date});
    
    if (photoDoc) {
        console.log('Photos were found in database');
        for (const photo of photoDoc.data){
            if(photo.count == record){
                return photo;
            }
        }
    } else {
        console.log('Photos were not found in database');
        const savedDoc = await fetchAndCachePhotos(date);
        console.log('savedDoc.data[0] ' + savedDoc.data[0]);
        return savedDoc.data[0];
    }
  }
  

module.exports = { getPhotos };