export default {
  name: 'breathe',
  description: 'Train Total Concentration Breathing',
  async execute(sock, message, args, { user }) {
    if (!user.slayerRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#dsregister <style> <name>`' });
      return;
    }

    const gain = 30;
    user.mastery += gain;

    let rankUpText = '';
    if (user.mastery >= 600 && user.slayerRank === 'Mizunoto') {
      user.slayerRank = 'Kanoe';
      rankUpText = '\n\n🎉 *RANK UP:* Promoted to *Kanoe*!';
    } else if (user.mastery >= 1800 && user.slayerRank === 'Kanoe') {
      user.slayerRank = 'Hinoe';
      rankUpText = '\n\n🎉 *RANK UP:* Promoted to *Hinoe*!';
    } else if (user.mastery >= 5000 && user.slayerRank === 'Hinoe') {
      user.slayerRank = 'Hashira';
      rankUpText = `\n\n🔥 *RANK UP:* You became the *${user.breathingStyle} Hashira*!`;
    }

    await user.save();

    await sock.sendMessage(message.from, {
      text: `🫁 *Total Concentration Breathing Constant!*\n` +
            `• Mastery Gain: +${gain}\n` +
            `• Current Mastery: ⚡ ${user.mastery}${rankUpText}`
    });
  }
};