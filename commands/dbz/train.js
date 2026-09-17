export default {
  name: 'train',
  description: 'Train to increase base Power Level',
  async execute(sock, message, args, { user }) {
    if (!user.registered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ You must register first! Type \`#register saiyan/human/half_saiyan <name>\`` 
      });
      return;
    }

    const COOLDOWN_MS = 30 * 1000; // 30 seconds
    const now = Date.now();
    const timePassed = now - new Date(user.lastTrain).getTime();

    if (timePassed < COOLDOWN_MS) {
      const timeLeft = Math.ceil((COOLDOWN_MS - timePassed) / 1000);
      await sock.sendMessage(message.from, { 
        text: `⏳ You are exhausted! Wait *${timeLeft}s* before training again.` 
      });
      return;
    }

    const plGain = 20;
    user.basePL += plGain;
    user.lastTrain = new Date();

    // Auto-unlock Forms check based on new Base PL
    let formUnlockedText = '';
    if (user.race === 'Saiyan' || user.race === 'Half-Saiyan') {
      if (user.basePL >= 3000 && !user.unlockedForms.includes('Super Saiyan')) {
        user.unlockedForms.push('Super Saiyan');
        formUnlockedText = `\n\n🔥 *NEW FORM UNLOCKED:* Super Saiyan!`;
      } else if (user.basePL >= 6000 && !user.unlockedForms.includes('Super Saiyan 2')) {
        user.unlockedForms.push('Super Saiyan 2');
        formUnlockedText = `\n\n⚡ *NEW FORM UNLOCKED:* Super Saiyan 2!`;
      } else if (user.basePL >= 10000 && !user.unlockedForms.includes('Super Saiyan 3')) {
        user.unlockedForms.push('Super Saiyan 3');
        formUnlockedText = `\n\n💥 *NEW FORM UNLOCKED:* Super Saiyan 3!`;
      }
    }

    await user.save();

    const currentTotalPL = (user.basePL + user.tempPL) * user.activeKaioken;
    await sock.sendMessage(message.from, { 
      text: `🏋️ *Training Complete!*\n` +
            `• Base PL Gain: +${plGain}\n` +
            `• Current Base PL: ${user.basePL}\n` +
            `• Total Active PL: ${currentTotalPL}${formUnlockedText}` 
    });
  }
};