// Actualizar (propietario o admin)
router.put('/:id', requireAuth, async (req, res, next) => {
  try {
    const target = await UserModel.findById(req.params.id);
    if (!target)
      return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
    if (req.user.role !== 'admin' && String(req.user._id) !== String(target._id)) {
      return res.status(403).json({ status: 'error', error: 'No autorizado' });
    }

    const data = { ...req.body };
    if (data.password) data.password = createHash(data.password);

    const updated = await UserModel.findByIdAndUpdate(req.params.id, data, { new: true }).lean();
    res.json({ status: 'success', payload: updated });
  } catch (err) {
    next(err);
  }
});

// Eliminar (admin)
router.delete('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const deleted = await UserModel.findByIdAndDelete(req.params.id).lean();
    if (!deleted) return res.status(404).json({ status: 'error', error: 'Usuario no encontrado' });
    res.json({ status: 'success', payload: deleted });
  } catch (err) {
    next(err);
  }
});

export default router;
