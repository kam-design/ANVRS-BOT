export default {
  name: 'profile',
  description: 'View Dragon Ball character stats',
  async execute(sock, message, args, { user }) {
    if (!user.registered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ Register first with \`#register saiyan/human/half_saiyan <name>\`` 
      });
      return;
    }

    const activePL = (user.basePL + user.tempPL) * user.activeKaioken;

    const profileCard = `🐉 *DRAGON BALL WARRIOR PROFILE* 🐉\n\n` +
      `👤 *Name:* ${user.name}\n` +
      `🧬 *Race:* ${user.race}\n` +
      `🪙 *Coins:* ${user.coins}\n` +
      `───────────────────\n` +
      `💥 *Base PL:* ${user.basePL}\n` +
      `⚡ *Active Total PL:* ${activePL}\n` +
      `🌀 *Form:* ${user.currentForm}\n` +
      `🔥 *Kaioken:* ${user.activeKaioken > 1 ? `x${user.activeKaioken}` : 'Off'}\n` +
      `───────────────────\n` +
      `✨ *Techniques:* ${user.moves.join(', ')}\n` +
      `🔓 *Unlocked Forms:* ${user.unlockedForms.join(', ')}`;

    await sock.sendMessage(message.from, { text: profileCard });
  }
};