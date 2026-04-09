// Run: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const users = [
  { name: 'Alice Fontaine', email: 'alice@acme.com', role: 'admin', department: 'Engineering', salary: 95000, active: true, notes: 'Lead architect' },
  { name: 'Bruno Nakamura', email: 'bruno@acme.com', role: 'editor', department: 'Design', salary: 72000, active: true, notes: 'UI specialist' },
  { name: 'Celine Osei', email: 'celine@acme.com', role: 'user', department: 'Marketing', salary: 58000, active: false, notes: '' },
  { name: 'Dmitri Volkov', email: 'dmitri@acme.com', role: 'viewer', department: 'Sales', salary: 61000, active: true, notes: 'Regional lead' },
  { name: 'Esme Larsson', email: 'esme@acme.com', role: 'user', department: 'Product', salary: 80000, active: true, notes: 'Growth PM' },
  { name: 'Felix Adeyemi', email: 'felix@acme.com', role: 'editor', department: 'Engineering', salary: 88000, active: true, notes: '' },
  { name: 'Grace Tanaka', email: 'grace@acme.com', role: 'user', department: 'HR', salary: 64000, active: true, notes: '' },
  { name: 'Hugo Reyes', email: 'hugo@acme.com', role: 'admin', department: 'Product', salary: 102000, active: true, notes: 'CPO' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/crudapp');
    console.log('Connected to MongoDB');
    await User.deleteMany({});
    const inserted = await User.insertMany(users);
    console.log(`✅ Seeded ${inserted.length} users`);
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected');
  }
}

seed();