import { deductCoins } from '../../utils/economy.js';

export default {
  name: 'hentai',
  description: 'Fetch NSFW images (Costs 25 ANVRS Coins)',
  async execute(sock, message, args, { user }) {
    const { from } = message;
    
    const validTags = ['waifu', 'neko', 'trap', 'blowjob'];
    let tag = args[0]?.toLowerCase();
    if (!tag || !validTags.includes(tag)) {
      tag = 'neko';
    }

    const COST = 25;
    const paid = await deductCoins(sock, message, user, COST, 'hentai command');
    if (!paid) return;

    await sock.sendMessage(from, { 
      text: `🔞 *Maya is fetching NSFW content...*\n🪙 *-25 ANVRS Coins* (Balance: ${user.coins})` 
    });

    let imageUrl = null;

    // Primary Source: Waifu.pics
    try {
      const res = await fetch(`https://api.waifu.pics/nsfw/${tag}`);
      const data = await res.json();
      imageUrl = data.url;
    } catch (e) {
      console.log('Waifu.pics failed, trying Nekos.life fallback...');
    }

    // Secondary Source: Nekos.life
    if (!imageUrl) {
      try {
        const res = await fetch('https://nekos.life/api/v2/img/lewd');
        const data = await res.json();
        imageUrl = data.url;
      } catch (e) {
        console.log('Nekos.life failed, trying Nekos.fun fallback...');
      }
    }

    // Tertiary Source: Nekos.fun
    if (!imageUrl) {
      try {
        const res = await fetch('https://api.nekos.fun/https/hentai');
        const data = await res.json();
        imageUrl = data.image;
      } catch (e) {
        console.log('All NSFW APIs failed.');
      }
    }

    if (imageUrl) {
      try {
        await sock.sendMessage(from, { 
          image: { url: imageUrl }, 
          caption: `🔞 *Tag:* ${tag}\n🪙 Remaining Coins: ${user.coins}` 
        });
      } catch (err) {
        await sock.sendMessage(from, { text: '❌ Failed to send image.' });
      }
    } else {
      await sock.sendMessage(from, { text: '❌ Unable to reach NSFW image servers right now. Try again later.' });
    }
  }
};