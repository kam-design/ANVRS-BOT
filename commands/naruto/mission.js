export default {
  name: 'mission',
  description: 'Take on Shinobi missions for rewards',
  async execute(sock, message, args, { user }) {
    if (!user.ninjaRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#nregister <village> <name>`' });
      return;
    }

    const missions = [
      { rank: 'D-Rank', req: 100, rewardCoins: 15, gainChakra: 10, desc: 'Find lost pet Tora' },
      { rank: 'C-Rank', req: 400, rewardCoins: 35, gainChakra: 25, desc: 'Escort a bridge builder' },
      { rank: 'B-Rank', req: 1200, rewardCoins: 80, gainChakra: 50, desc: 'Infiltrate enemy outpost' },
      { rank: 'A-Rank', req: 3000, rewardCoins: 150, gainChakra: 100, desc: 'Subdue rogue ninja group' }
    ];

    const available = missions.filter(m => user.maxChakra >= m.req);
    const mission = available[Math.floor(Math.random() * available.length)];

    user.coins += mission.rewardCoins;
    user.maxChakra += mission.gainChakra;
    await user.save();

    await sock.sendMessage(message.from, {
      text: `📜 *MISSION ACCOMPLISHED!* 📜\n\n` +
            `• *Rank:* ${mission.rank}\n` +
            `• *Task:* ${mission.desc}\n` +
            `🪙 *Coins Earned:* +${mission.rewardCoins}\n` +
            `⚡ *Max Chakra Gain:* +${mission.gainChakra}\n` +
            `💰 *Wallet:* ${user.coins} ANVRS Coins`
    });
  }
};