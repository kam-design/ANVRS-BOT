import { User } from '../../models/User.js';

export default {
  name: 'nfight',
  description: 'PvE Rogue Ninja clash or PvP Shinobi Duel',
  async execute(sock, message, args, { user }) {
    if (!user.ninjaRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#nregister <village> <name>`' });
      return;
    }

    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // PvP Shinobi Duel
    if (mentionedJid) {
      const opponent = await User.findOne({ jid: mentionedJid });

      if (!opponent || !opponent.ninjaRegistered) {
        await sock.sendMessage(message.from, { text: '❌ Target is not registered in the Shinobi world.' });
        return;
      }

      const myPower = user.maxChakra * (Math.random() * 0.5 + 0.8);
      const oppPower = opponent.maxChakra * (Math.random() * 0.5 + 0.8);

      let pvpLog = `⚔️ *SHINOBI DUEL!* ⚔️\n\n` +
                   `*${user.ninjaName}* (${user.village}) vs *${opponent.ninjaName}* (${opponent.village})\n\n`;

      if (myPower >= oppPower) {
        user.coins += 30;
        user.maxChakra += 20;
        await user.save();
        pvpLog += `🏆 *${user.ninjaName} WINS!* (+30 Coins, +20 Max Chakra)`;
      } else {
        opponent.coins += 30;
        opponent.maxChakra += 20;
        await opponent.save();
        pvpLog += `💀 *${user.ninjaName} WAS DEFEATED!* ${opponent.ninjaName} wins the clash.`;
      }

      await sock.sendMessage(message.from, { text: pvpLog });
      return;
    }

    // PvE Rogue Ninja Fight
    const rogues = [
      { name: 'Sound Genin', chakra: 200, reward: 10 },
      { name: 'Zabuza Momochi', chakra: 1200, reward: 40 },
      { name: 'Kisame Hoshigaki', chakra: 3500, reward: 90 },
      { name: 'Itachi Uchiha', chakra: 8000, reward: 200 }
    ];

    const validRogues = rogues.filter(r => r.chakra <= user.maxChakra * 2.5);
    const enemy = validRogues.length > 0 ? validRogues[validRogues.length - 1] : rogues[0];

    const myRoll = user.maxChakra * (Math.random() * 0.5 + 0.8);
    const enemyRoll = enemy.chakra * (Math.random() * 0.5 + 0.8);

    let log = `🗡️ *ROGUE NINJA ENCOUNTER!* 🗡️\n\n` +
              `Rogue target: *${enemy.name}* (Chakra: ${enemy.chakra})\n\n`;

    if (myRoll >= enemyRoll) {
      user.coins += enemy.reward;
      user.maxChakra += 15;
      await user.save();
      log += `🏆 *VICTORY!* You defeated ${enemy.name}!\n(+${enemy.reward} Coins, +15 Max Chakra)`;
    } else {
      log += `💀 *DEFEAT!* ${enemy.name} overwhelmed your Jutsu. Meditate to get stronger!`;
    }

    await sock.sendMessage(message.from, { text: log });
  }
};