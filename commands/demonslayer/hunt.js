import { User } from '../../models/User.js';

export default {
  name: 'hunt',
  description: 'Hunt Demons or duel a Slayer',
  async execute(sock, message, args, { user }) {
    if (!user.slayerRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#dsregister <style> <name>`' });
      return;
    }

    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // PvP Slayer Sparring
    if (mentionedJid) {
      const opponent = await User.findOne({ jid: mentionedJid });

      if (!opponent || !opponent.slayerRegistered) {
        await sock.sendMessage(message.from, { text: '❌ Target is not a registered Demon Slayer.' });
        return;
      }

      const myPower = user.mastery * (Math.random() * 0.5 + 0.8);
      const oppPower = opponent.mastery * (Math.random() * 0.5 + 0.8);

      let pvpLog = `⚔️ *SLAYER SPARRING MATCH!* ⚔️\n\n` +
                   `*${user.slayerName}* (${user.breathingStyle}) vs *${opponent.slayerName}* (${opponent.breathingStyle})\n\n`;

      if (myPower >= oppPower) {
        user.coins += 35;
        user.mastery += 25;
        await user.save();
        pvpLog += `🏆 *${user.slayerName} WINS!* (+35 Coins, +25 Mastery)`;
      } else {
        opponent.coins += 35;
        opponent.mastery += 25;
        await opponent.save();
        pvpLog += `💀 *${user.slayerName} WAS OVERPOWERED!* ${opponent.slayerName} wins.`;
      }

      await sock.sendMessage(message.from, { text: pvpLog });
      return;
    }

    // PvE Demon Hunt
    const demons = [
      { name: 'Temple Demon', power: 150, reward: 15 },
      { name: 'Hand Demon', power: 500, reward: 35 },
      { name: 'Rui (Lower Moon 5)', power: 1500, reward: 80 },
      { name: 'Akaza (Upper Moon 3)', power: 4500, reward: 180 },
      { name: 'Muzan Kibutsuji', power: 10000, reward: 400 }
    ];

    const validDemons = demons.filter(d => d.power <= user.mastery * 2.5);
    const enemy = validDemons.length > 0 ? validDemons[validDemons.length - 1] : demons[0];

    const myRoll = user.mastery * (Math.random() * 0.5 + 0.8);
    const enemyRoll = enemy.power * (Math.random() * 0.5 + 0.8);

    let log = `🩸 *DEMON ENCOUNTER!* 🩸\n\n` +
              `Target: *${enemy.name}* (Power: ${enemy.power})\n\n`;

    if (myRoll >= enemyRoll) {
      user.coins += enemy.reward;
      user.mastery += 20;
      await user.save();
      log += `🏆 *DECAPITATED!* You decapitated ${enemy.name}!\n(+${enemy.reward} Coins, +20 Mastery)`;
    } else {
      log += `💀 *DEFEAT!* ${enemy.name} sliced through your stance. Train your breathing!`;
    }

    await sock.sendMessage(message.from, { text: log });
  }
};