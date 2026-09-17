import { User } from '../../models/User.js';

export default {
  name: 'purify',
  description: 'Purify Hollows or duel a Soul Reaper',
  async execute(sock, message, args, { user }) {
    if (!user.reaperRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#bregister <reaper_name>`' });
      return;
    }

    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // PvP Soul Reaper Duel
    if (mentionedJid) {
      const opponent = await User.findOne({ jid: mentionedJid });

      if (!opponent || !opponent.reaperRegistered) {
        await sock.sendMessage(message.from, { text: '❌ Target is not a registered Soul Reaper.' });
        return;
      }

      const myPower = user.reiryoku * (user.bankaiUnlocked ? 2.5 : user.shikaiUnlocked ? 1.5 : 1) * (Math.random() * 0.5 + 0.8);
      const oppPower = opponent.reiryoku * (opponent.bankaiUnlocked ? 2.5 : opponent.shikaiUnlocked ? 1.5 : 1) * (Math.random() * 0.5 + 0.8);

      let pvpLog = `⚔️ *SOUL REAPER CLASH!* ⚔️\n\n` +
                   `*${user.reaperName}* vs *${opponent.reaperName}*\n\n`;

      if (myPower >= oppPower) {
        user.coins += 40;
        user.reiryoku += 30;
        await user.save();
        pvpLog += `🏆 *${user.reaperName} WINS!* (+40 Coins, +30 Reiryoku)`;
      } else {
        opponent.coins += 40;
        opponent.reiryoku += 30;
        await opponent.save();
        pvpLog += `💀 *${user.reaperName} WAS OVERPOWERED!* ${opponent.reaperName} wins the duel.`;
      }

      await sock.sendMessage(message.from, { text: pvpLog });
      return;
    }

    // PvE Hollow Extermination
    const hollows = [
      { name: 'Demi-Hollow', power: 120, reward: 10 },
      { name: 'Gillian (Menos Grande)', power: 600, reward: 30 },
      { name: 'Adjuchas', power: 1800, reward: 75 },
      { name: 'Grimmjow (Espada 6)', power: 5000, reward: 160 },
      { name: 'Ulquiorra Cifer', power: 12000, reward: 350 }
    ];

    const currentMultiplier = user.bankaiUnlocked ? 2.5 : user.shikaiUnlocked ? 1.5 : 1;
    const effectivePower = user.reiryoku * currentMultiplier;

    const validHollows = hollows.filter(h => h.power <= effectivePower * 2.5);
    const enemy = validHollows.length > 0 ? validHollows[validHollows.length - 1] : hollows[0];

    const myRoll = effectivePower * (Math.random() * 0.5 + 0.8);
    const enemyRoll = enemy.power * (Math.random() * 0.5 + 0.8);

    let log = `💀 *HOLLOW THREAT DETECTED!* 💀\n\n` +
              `Target: *${enemy.name}* (Power: ${enemy.power})\n\n`;

    if (myRoll >= enemyRoll) {
      user.coins += enemy.reward;
      user.reiryoku += 25;
      await user.save();
      log += `🏆 *PURIFIED!* You sent ${enemy.name} to the Soul Society!\n(+${enemy.reward} Coins, +25 Reiryoku)`;
    } else {
      log += `💀 *DEFEAT!* ${enemy.name} broke your spiritual pressure. Train with your Zanpakuto!`;
    }

    await sock.sendMessage(message.from, { text: log });
  }
};