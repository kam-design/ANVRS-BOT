export default {
  name: 'bregister',
  description: 'Register as a Soul Reaper',
  async execute(sock, message, args, { user }) {
    if (user.reaperRegistered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ You are already a *${user.reaperRank}* wielding *${user.zanpakutoName}*!` 
      });
      return;
    }

    const zanpakutoNames = ['Zangetsu', 'Senbonzakura', 'Hyorinmaru', 'Ryujin Jakka', 'Kyoka Suigetsu', 'Wabisuke'];
    const randomZanpakuto = zanpakutoNames[Math.floor(Math.random() * zanpakutoNames.length)];
    const reaperName = args.join(' ') || message.pushName;

    user.reaperName = reaperName;
    user.zanpakutoName = randomZanpakuto;
    user.reaperRank = 'Unseated Officer';
    user.reiryoku = 100;
    user.shikaiUnlocked = false;
    user.bankaiUnlocked = false;
    user.reaperRegistered = true;
    await user.save();

    await sock.sendMessage(message.from, {
      text: `🌸 *ENTERED THE SOUL SOCIETY!* 🌸\n\n` +
            `👤 *Name:* ${user.reaperName}\n` +
            `⚔️ *Zanpakuto:* ${user.zanpakutoName}\n` +
            `📜 *Rank:* ${user.reaperRank}\n` +
            `⚡ *Reiryoku:* ${user.reiryoku}`
    });
  }
};