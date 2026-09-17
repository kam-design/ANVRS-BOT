import { deductCoins } from '../../utils/economy.js';

export default {
  name: 'wallpaper',
  description: 'Fetch an anime wallpaper (Costs 10 ANVRS Coins)',
  async execute(sock, message, args, { user }) {
    const { from } = message;
    const query = args.join(' ');

    const COST = 10;
    const paid = await deductCoins(sock, message, user, COST, 'wallpaper search');
    if (!paid) return;

    await sock.sendMessage(from, { 
      text: `🔍 *Maya is fetching a wallpaper...*\n🪙 *-10 ANVRS Coins* (Balance: ${user.coins})` 
    });

    let imageUrl = null;

    // 1. Primary API: Nekos.best
    try {
      const res = await fetch('https://nekos.best/api/v2/wallpaper');
      const data = await res.json();
      imageUrl = data.results?.[0]?.url;
    } catch (e) {
      console.log('Nekos.best failed, trying Waifu.im...');
    }

    // 2. Secondary API: Waifu.im
    if (!imageUrl) {
      try {
        const res = await fetch('https://api.waifu.im/search?included_tags=waifu');
        const data = await res.json();
        imageUrl = data.images?.[0]?.url;
      } catch (e) {
        console.log('Waifu.im failed, fallback to direct image...');
      }
    }

    // 3. Fail-safe Direct Image Stream
    if (!imageUrl) {
      imageUrl = `https://picsum.photos/1080/1920`;
    }

    try {
      await sock.sendMessage(from, { 
        image: { url: imageUrl }, 
        caption: `✨ *Anime Wallpaper* ${query ? `(${query})` : ''}\n🪙 Remaining Coins: ${user.coins}` 
      });
    } catch (err) {
      console.error('Failed to send image:', err);
      await sock.sendMessage(from, { text: '❌ Unable to deliver image. Check bot internet connection.' });
    }
  }
};