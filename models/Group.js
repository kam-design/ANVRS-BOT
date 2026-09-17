import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  activeGame: { 
    type: String, 
    enum: ['dbz', 'naruto', 'demonslayer', 'bleach'], 
    default: 'dbz' 
  },
  customAdmins: { type: [String], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

export const Group = mongoose.model('Group', groupSchema);