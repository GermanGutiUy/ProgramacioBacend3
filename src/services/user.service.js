const User = require('../models/user.model');


async function getAllUsers() {
return User.find().populate('pets').lean();
}


async function getUserById(id) {
return User.findById(id).populate('pets').lean();
}


module.exports = { getAllUsers, getUserById };