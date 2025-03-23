const {User} = require('../models/users')
async function saveUser(data) {
    try{
        const user = new User();
        user.user_id = data.id;
        user.name = data.first_name;
        user.username = data.username;
        await user.save();
    }catch(err){
        console.log('user was registered and started the bot again')
    }
}

module.exports = {saveUser}