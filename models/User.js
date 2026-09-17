import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  jid: { type: String, required: true, unique: true },
  
  // Shared Economy & Cooldowns
  coins: { type: Number, default: 100 },
  lastTrain: { type: Date, default: 0 },
  joinedAt: { type: Date, default: Date.now },

  // DBZ Module Stats
  name: { type: String, default: 'Warrior' },
  registered: { type: Boolean, default: false },
  race: { type: String, enum: ['Saiyan', 'Human', 'Half-Saiyan', 'None'], default: 'None' },
  basePL: { type: Number, default: 100 },
  tempPL: { type: Number, default: 0 },
  currentForm: { type: String, default: 'Base' },
  activeKaioken: { type: Number, default: 1 },
  moves: { type: [String], default: ['Ki Blast'] },
  unlockedForms: { type: [String], default: ['Base'] },

  // Naruto Module Stats
  ninjaRegistered: { type: Boolean, default: false },
  ninjaName: { type: String, default: '' },
  village: { type: String, default: 'None' },
  ninjaRank: { type: String, default: 'Academy Student' },
  chakra: { type: Number, default: 100 },
  maxChakra: { type: Number, default: 100 },
  chakraNature: { type: String, default: 'Fire' },
  jutsus: { type: [String], default: ['Clone Technique', 'Substitution'] },

  // Demon Slayer Module Stats
  slayerRegistered: { type: Boolean, default: false },
  slayerName: { type: String, default: '' },
  breathingStyle: { type: String, default: 'Water' },
  slayerRank: { type: String, default: 'Mizunoto' },
  mastery: { type: Number, default: 100 },
  bladeColor: { type: String, default: 'Black' },
  demonKills: { type: Number, default: 0 },

  // Bleach Module Stats
  reaperRegistered: { type: Boolean, default: false },
  reaperName: { type: String, default: '' },
  zanpakutoName: { type: String, default: 'Unawakened' },
  reaperRank: { type: String, default: 'Unseated Officer' },
  reiryoku: { type: Number, default: 100 },
  shikaiUnlocked: { type: Boolean, default: false },
  bankaiUnlocked: { type: Boolean, default: false },
  releaseState: { type: String, default: 'Sealed' }
});

export const User = mongoose.model('User', userSchema);