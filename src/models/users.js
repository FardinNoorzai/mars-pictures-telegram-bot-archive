const { mongoose } = require('mongoose');

const userSchema = new mongoose.Schema({
    user_id: { type: String, required: true, unique: true },
    name: { type: String, required: true }, 
    username: { type: String, unique: true } 
}, {
    timestamps: true, 
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
