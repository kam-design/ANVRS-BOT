import { User } from '../../models/User.js'; // Ensure path is correct

export default {
  name: 'fight',
  description: 'PvE Villains or PvP Clash (Costs 0, Rewards PL & Coins)',
  async execute(sock, message, args, { user }) {
    if (!user.registered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#register saiyan/human/half_saiyan <name>`' });
      return;
    }

    const myPL = (user.basePL + user.tempPL) * (user.activeKaioken || 1);
    const myMove = user.moves[user.moves.length - 1] || 'Punch';
    const mentionedJid = message.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // PvP MODE
    if (mentionedJid) {
      const opponent = await User.findOne({ jid: mentionedJid });
      
      if (!opponent || !opponent.registered) {
        await sock.sendMessage(message.from, { text: '❌ That user is not registered in the DBZ universe.' });
        return;
      }

      const oppPL = (opponent.basePL + opponent.tempPL) * (opponent.activeKaioken || 1);
      const oppMove = opponent.moves[opponent.moves.length - 1] || 'Punch';
      
      const myRoll = myPL * (Math.random() * 0.5 + 0.8);
      const oppRoll = oppPL * (Math.random() * 0.5 + 0.8);

      let log = `⚔️ *PvP CLASH!* ⚔️\n\n` +
                `*${user.name}* (PL: ${myPL}) vs *${opponent.name}* (PL: ${oppPL})\n\n` +
                `💥 ${user.name} uses ${myMove}!\n` +
                `💥 ${opponent.name} counters with ${oppMove}!\n\n`;

      if (myRoll >= oppRoll) {
        user.basePL += 50;
        user.coins += 20;
        await user.save();
        log += `🏆 *${user.name} WINS!* (+50 PL, +20 ANVRS Coins)`;
      } else {
        opponent.basePL += 50;
        opponent.coins += 20;
        await opponent.save();
        log += `💀 *${user.name} was defeated!* ${opponent.name} takes the win.`;
      }

      await sock.sendMessage(message.from, { text: log });
      return;
    }

    // PvE MODE
    const villains = [
      { name: 'Saibaman', pl: 1200, reward: 5, move: 'Acid Spray' },
      { name: 'Raditz', pl: 1500, reward: 10, move: 'Double Sunday' },
      { name: 'Nappa', pl: 4000, reward: 15, move: 'Break Cannon' },
      { name: 'Vegeta (Scouter)', pl: 18000, reward: 25, move: 'Galick Gun' },
      { name: 'Frieza (Final Form)', pl: 120000, reward: 50, move: 'Death Beam' }
    ];

    // Find a villain near the player's PL
    const validVillains = villains.filter(v => v.pl <= myPL * 2);
    const enemy = validVillains.length > 0 ? validVillains[validVillains.length - 1] : villains[0];

    const myRoll = myPL * (Math.random() * 0.5 + 0.8);
    const enemyRoll = enemy.pl * (Math.random() * 0.5 + 0.8);

    let pveLog = `👾 *ENEMY APPEARED!* 👾\n\n` +
                 `*${enemy.name}* (PL: ${enemy.pl}) challenges you!\n\n` +
                 `💥 You fire a ${myMove}!\n` +
                 `💥 ${enemy.name} fires back with ${enemy.move}!\n\n`;

    if (myRoll >= enemyRoll) {
      user.basePL += 30;
      user.coins += enemy.reward;
      await user.save();
      pveLog += `🏆 *VICTORY!* You defeated ${enemy.name}.\n(+30 PL, +${enemy.reward} ANVRS Coins)`;
    } else {
      pveLog += `💀 *DEFEAT!* ${enemy.name} crushed you. Train harder!`;
    }

    await sock.sendMessage(message.from, { text: pveLog });
  }
};