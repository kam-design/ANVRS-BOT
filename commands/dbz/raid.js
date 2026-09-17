// Simple tracking variable or Mongo schema addition
let bossHP = 500000;

export default {
  name: 'raid',
  description: 'Attack the World Boss',
  async execute(sock, message, args, { user }) {
    if (!user.registered) return;

    const myPL = (user.basePL + user.tempPL) * (user.activeKaioken || 1);
    const damage = Math.floor(myPL * (Math.random() * 0.4 + 0.8));

    bossHP -= damage;
    user.coins += 15;
    await user.save();

    if (bossHP <= 0) {
      bossHP = 500000; // Reset boss
      await sock.sendMessage(message.from, { 
        text: `💥 *CELL WAS DEFEATED!* 💥\n${user.name} landed the final blow! Boss HP has reset.` 
      });
    } else {
      await sock.sendMessage(message.from, { 
        text: `⚔️ *RAID ATTACK!*\n` +
              `💥 You dealt *${damage}* damage to Perfect Cell!\n` +
              `🩸 Cell Remaining HP: *${bossHP}/500000*\n` +
              `🪙 Reward: +15 Coins` 
      });
    }
  }
};