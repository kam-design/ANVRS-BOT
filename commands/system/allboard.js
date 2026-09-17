import { User } from '../../models/User.js';

export default {
  name: 'allboard',
  description: 'Global leaderboard across all anime universes and wealth',
  async execute(sock, message) {
    const { from } = message;

    // Top Wealthy Players
    const richest = await User.find().sort({ coins: -1 }).limit(3);
    
    // Strongest DBZ
    const dbzTop = await User.find({ registered: true }).sort({ basePL: -1 }).limit(1);
    
    // Strongest Naruto
    const narutoTop = await User.find({ ninjaRegistered: true }).sort({ maxChakra: -1 }).limit(1);
    
    // Strongest Demon Slayer
    const dsTop = await User.find({ slayerRegistered: true }).sort({ mastery: -1 }).limit(1);
    
    // Strongest Bleach
    const bleachTop = await User.find({ reaperRegistered: true }).sort({ reiryoku: -1 }).limit(1);

    let text = `🌐 *ANVRS GLOBAL MULTIVERSE LEADERBOARD* 🌐\n\n`;

    text += `💰 *TOP WEALTHIEST (ANVRS Coins)*\n`;
    if (richest.length > 0) {
      richest.forEach((u, i) => {
        text += `${i + 1}. *${u.name || 'User'}* — 🪙 ${u.coins} Coins\n`;
      });
    } else {
      text += `• No economic records yet.\n`;
    }

    text += `\n👑 *UNIVERSE CHAMPIONS*\n`;
    text += `• ⚡ *DBZ Champion:* ${dbzTop[0] ? `${dbzTop[0].name} (PL: ${dbzTop[0].basePL})` : 'None'}\n`;
    text += `• 🍃 *Naruto Champion:* ${narutoTop[0] ? `${narutoTop[0].ninjaName} (${narutoTop[0].maxChakra} Chakra)` : 'None'}\n`;
    text += `• ⚔️ *Demon Slayer Champion:* ${dsTop[0] ? `${dsTop[0].slayerName} (${dsTop[0].mastery} Mastery)` : 'None'}\n`;
    text += `• 🌸 *Bleach Champion:* ${bleachTop[0] ? `${bleachTop[0].reaperName} (${bleachTop[0].reiryoku} Reiryoku)` : 'None'}\n`;

    await sock.sendMessage(from, { text });
  }
};