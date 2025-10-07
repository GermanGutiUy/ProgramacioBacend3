const Pet = require('../models/pet.model');


async function getAllPets() {
return Pet.find().populate('owner').lean();
}


module.exports = { getAllPets };