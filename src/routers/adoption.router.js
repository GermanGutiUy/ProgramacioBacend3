const express = require('express');
const router = express.Router();
const adoptionService = require('../services/adoption.service');

// GET /api/adoptions
router.get('/', async (req, res, next) => {
  try {
    const items = await adoptionService.getAllAdoptions();
    res.json({ status: 'success', payload: items });
  } catch (err) { next(err); }
});

// GET /api/adoptions/:id
router.get('/:id', async (req, res, next) => {
  try {
    const item = await adoptionService.getAdoptionById(req.params.id);
    if (!item) return res.status(404).json({ status: 'error', message: 'Adoption not found' });
    res.json({ status: 'success', payload: item });
  } catch (err) { next(err); }
});

// POST /api/adoptions
router.post('/', async (req, res, next) => {
  try {
    const { pet, adopter, notes } = req.body;
    if (!pet || !adopter) return res.status(400).json({ status: 'error', message: 'pet and adopter required' });
    const created = await adoptionService.createAdoption({ petId: pet, userId: adopter, notes });
    res.status(201).json({ status: 'success', payload: created });
  } catch (err) {
    if (err.message === 'PetNotFound' || err.message === 'UserNotFound') {
      return res.status(404).json({ status: 'error', message: err.message });
    }
    next(err);
  }
});

// PUT /api/adoptions/:id
router.put('/:id', async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    if (status && !['pending','approved','rejected','completed'].includes(status)) {
      return res.status(400).json({ status: 'error', message: 'Invalid status' });
    }
    const updated = await adoptionService.updateAdoptionStatus(req.params.id, { status, notes });
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    if (err.message === 'AdoptionNotFound') return res.status(404).json({ status: 'error', message: 'Adoption not found' });
    next(err);
  }
});

// DELETE /api/adoptions/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await adoptionService.deleteAdoption(req.params.id);
    res.json({ status: 'success', payload: deleted });
  } catch (err) {
    if (err.message === 'AdoptionNotFound') return res.status(404).json({ status: 'error', message: 'Adoption not found' });
    next(err);
  }
});

module.exports = router;
