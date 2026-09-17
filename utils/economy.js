export const deductCoins = async (sock, message, user, cost, actionName) => {
  if (user.coins < cost) {
    await sock.sendMessage(message.from, { 
      text: `❌ *INSUFFICIENT ANVRS COINS!*\n\n` +
            `• Required: 🪙 ${cost} Coins\n` +
            `• Your Balance: 🪙 ${user.coins} Coins\n\n` +
            `💡 *Earn coins by training or slaying in active anime game modes!*` 
    });
    return false;
  }

  user.coins -= cost;
  await user.save();
  return true;
};