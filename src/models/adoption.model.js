const mongoose = require('mongoose');

const adoptionSchema = new mongoose.Schema({
  pet: { type: mongoose.Schema.Types.ObjectId, ref: 'Pet', required: true },
  adopter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  requestedAt: { type: Date, default: () => new Date() },
  processedAt: { type: Date, default: null },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Adoption', adoptionSchema);
