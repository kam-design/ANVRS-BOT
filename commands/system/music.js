import { deductCoins } from '../../utils/economy.js';

export default {
  name: 'music',
  description: 'Search and play audio tracks (Costs 15 ANVRS Coins)',
  async execute(sock, message, args, { user }) {
    const { from } = message;
    const songQuery = args.join(' ');

    if (!songQuery) {
      await sock.sendMessage(from, { text: '⚠️ Usage: `#music <song name / anime ost>`' });
      return;
    }

    const COST = 15;
    const paid = await deductCoins(sock, message, user, COST, 'music lookup');
    if (!paid) return;

    await sock.sendMessage(from, { 
      text: `🎵 *Searching track:* "${songQuery}"...\n🪙 *-15 ANVRS Coins* (Balance: ${user.coins})` 
    });

    try {
      // Primary: iTunes Search API for 30s high-res preview streams
      const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(songQuery)}&limit=1&entity=song`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const track = data.results[0];

        // Send audio file
        await sock.sendMessage(from, {
          audio: { url: track.previewUrl },
          mimetype: 'audio/mp4',
          ptt: false
        });

        // Send track metadata details
        await sock.sendMessage(from, {
          text: `🎧 *Track Found:* ${track.trackName}\n👤 *Artist:* ${track.artistName}\n💿 *Album:* ${track.collectionName}`
        });
      } else {
        await sock.sendMessage(from, { text: `❌ No audio track found for "${songQuery}".` });
      }
    } catch (err) {
      console.error('Music Fetch Error:', err);
      await sock.sendMessage(from, { text: '❌ Failed to connect to music servers. Check network/DNS.' });
    }
  }
};