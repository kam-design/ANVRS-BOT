export default {
  name: 'shop',
  description: 'DBZ Item & Technique Shop',
  async execute(sock, message, args, { user }) {
    const shopMenu = `🛍️ *CAPSULE CORP SHOP*\n\n` +
      `1. *Kamehameha / Final Flash* - 100 Coins\n` +
      `2. *Senzu Bean* (Instant train refresh) - 50 Coins\n` +
      `3. *Gravity Chamber* (+50% PL gain on train) - 300 Coins\n\n` +
      `*Usage:* \`#buy 1\`, \`#buy 2\`, or \`#buy 3\``;

    await sock.sendMessage(message.from, { text: shopMenu });
  }
};