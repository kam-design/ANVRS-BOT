export default {
  name: 'kaioken',
  description: 'Apply temporary Kaioken multiplier',
  async execute(sock, message, args, { user }) {
    if (!user.registered || user.race === 'None') {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#register saiyan/human/half_saiyan <name>`' });
      return;
    }

    const multiplier = parseInt(args[0]) || 2;

    if (multiplier < 1 || multiplier > 20) {
      await sock.sendMessage(message.from, { text: '⚠️ Multiplier must be between x2 and x20!' });
      return;
    }

    user.activeKaioken = multiplier;
    await user.save();

    const currentPL = (user.basePL + user.tempPL) * user.activeKaioken;

    await sock.sendMessage(message.from, { 
      text: `🔥 *KAIOKEN x${multiplier}!*\n` +
            `• Base PL: ${user.basePL}\n` +
            `• Boosted PL: ⚡ ${currentPL}` 
    });
  }
};