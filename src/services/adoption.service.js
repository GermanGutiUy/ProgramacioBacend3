const Adoption = require('../models/adoption.model');
const Pet = require('../models/pet.model');
const User = require('../models/user.model');

async function createAdoption({ petId, userId, notes }) {
  // verify existence of pet and user
  const pet = await Pet.findById(petId);
  if (!pet) throw new Error('PetNotFound');

  const user = await User.findById(userId);
  if (!user) throw new Error('UserNotFound');

  const adoption = await Adoption.create({
    pet: pet._id,
    adopter: user._id,
    notes,
  });
  return adoption;
}

async function getAllAdoptions() {
  return Adoption.find().populate('pet').populate('adopter').lean();
}

async function getAdoptionById(id) {
  return Adoption.findById(id).populate('pet').populate('adopter').lean();
}

async function updateAdoptionStatus(id, { status, notes }) {
  const adoption = await Adoption.findById(id);
  if (!adoption) throw new Error('AdoptionNotFound');

  if (status) {
    adoption.status = status;
    if (['approved', 'rejected', 'completed'].includes(status)) {
      adoption.processedAt = new Date();
    }
  }
  if (notes !== undefined) adoption.notes = notes;
  await adoption.save();
  return adoption;
}

async function deleteAdoption(id) {
  const r = await Adoption.findByIdAndDelete(id);
  if (!r) throw new Error('AdoptionNotFound');
  return r;
}

module.exports = {
  createAdoption,
  getAllAdoptions,
  getAdoptionById,
  updateAdoptionStatus,
  deleteAdoption
};
