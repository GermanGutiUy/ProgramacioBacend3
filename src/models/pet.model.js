const mongoose = require('mongoose');


const petSchema = new mongoose.Schema({
name: { type: String, required: true },
species: { type: String, required: true },
age: { type: Number, required: true },
owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });


module.exports = mongoose.model('Pet', petSchema);