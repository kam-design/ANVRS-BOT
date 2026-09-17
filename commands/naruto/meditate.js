export default {
  name: 'meditate',
  description: 'Train chakra control and gain Ninja Ranks',
  async execute(sock, message, args, { user }) {
    if (!user.ninjaRegistered) {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#nregister <village> <name>`' });
      return;
    }

    const gain = 25;
    user.maxChakra += gain;
    user.chakra = user.maxChakra;

    let rankUpText = '';
    if (user.maxChakra >= 500 && user.ninjaRank === 'Academy Student') {
      user.ninjaRank = 'Genin';
      rankUpText = '\n\n🎉 *RANK UP:* You passed the exam and became a *Genin*!';
    } else if (user.maxChakra >= 1500 && user.ninjaRank === 'Genin') {
      user.ninjaRank = 'Chunin';
      rankUpText = '\n\n🎉 *RANK UP:* You passed the Chunin Exams! Promoted to *Chunin*!';
    } else if (user.maxChakra >= 4000 && user.ninjaRank === 'Chunin') {
      user.ninjaRank = 'Jonin';
      rankUpText = '\n\n🎉 *RANK UP:* Promoted to elite *Jonin*!';
    }

    await user.save();

    await sock.sendMessage(message.from, {
      text: `🧘 *Chakra Training Complete!*\n` +
            `• Max Chakra Gain: +${gain}\n` +
            `• Current Max Chakra: ⚡ ${user.maxChakra}${rankUpText}`
    });
  }
};