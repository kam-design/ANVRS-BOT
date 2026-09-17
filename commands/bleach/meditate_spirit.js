export default {
  name: 'meditate_spirit',
  description: 'Commune with your Zanpakuto to increase Reiryoku',
  async execute(sock, message, args, { user }) {
    if (!user.reaperRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#bregister <reaper_name>`' });
      return;
    }

    const gain = 35;
    user.reiryoku += gain;

    let unlockText = '';
    if (user.reiryoku >= 800 && !user.shikaiUnlocked) {
      user.shikaiUnlocked = true;
      user.reaperRank = 'Seated Officer';
      unlockText = `\n\n⚡ *RELEASE UNLOCKED:* You communicated with *${user.zanpakutoName}* and unlocked **Shikai**!`;
    } else if (user.reiryoku >= 3500 && !user.bankaiUnlocked) {
      user.bankaiUnlocked = true;
      user.reaperRank = 'Captain';
      unlockText = `\n\n💥 *BANKAI UNLOCKED:* You achieved **Bankai** and became a Gotei 13 *Captain*!`;
    }

    await user.save();

    await sock.sendMessage(message.from, {
      text: `🧘 *Jinzen Training Complete!*\n` +
            `• Reiryoku Gain: +${gain}\n` +
            `• Total Reiryoku: ⚡ ${user.reiryoku}${unlockText}`
    });
  }
};