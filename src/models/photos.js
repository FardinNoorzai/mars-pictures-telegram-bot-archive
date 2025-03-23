const {mongoose} = require('mongoose');

const photoSchema = new mongoose.Schema({
    total: Number ,
    date: String,
    data: [{
        count: Number,
        id: Number,
        sol: Number,
        camera: {
            id: Number,
            name: String,
            rover_id: Number,
            full_name: String
        },
        img_src: String,
        earth_date: String,
        rover: {
            id: Number,
            name: String,
            landing_date: String,
            launch_date: String,
            status: String
        }
    }]
})

const Photos = mongoose.model('Photos', photoSchema);

module.exports = { Photos };