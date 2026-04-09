const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ─── GET /api/users ─── List with search, filter, pagination
router.get('/', async (req, res, next) => {
  try {
    const {
      search = '',
      role = '',
      status = '',
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      order = 'desc',
    } = req.query;

    // Build filter
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } },
      ];
    }

    if (role) filter.role = role;
    if (status === 'active') filter.active = true;
    if (status === 'inactive') filter.active = false;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOrder = order === 'asc' ? 1 : -1;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(filter),
    ]);

    // Stats (on full collection, not filtered)
    const [totalCount, activeCount, salaryAgg] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ active: true }),
      User.aggregate([{ $group: { _id: null, avg: { $avg: '$salary' }, total: { $sum: '$salary' } } }]),
    ]);

    res.json({
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
      stats: {
        total: totalCount,
        active: activeCount,
        avgSalary: Math.round(salaryAgg[0]?.avg || 0),
        totalSalary: salaryAgg[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ─── GET /api/users/:id ─── Get single record
router.get('/:id', async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ─── POST /api/users ─── Create
router.post('/', async (req, res, next) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/users/:id ─── Update
router.put('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/users/:id ─── Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully', id: req.params.id });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/users ─── Bulk delete
router.delete('/', async (req, res, next) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Provide an array of ids' });
    }
    const result = await User.deleteMany({ _id: { $in: ids } });
    res.json({ message: `${result.deletedCount} users deleted` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;