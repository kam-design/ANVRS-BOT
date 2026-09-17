import { User } from '../../models/User.js';
import { Group } from '../../models/Group.js';

export default {
  name: 'board',
  description: 'View the leaderboard for the current group universe',
  async execute(sock, message, args) {
    const { from } = message;

    // Get group active game module
    const group = await Group.findOne({ jid: from }) || { activeGame: 'dbz' };
    const universe = group.activeGame;

    let title = '';
    let sortField = '';
    let filterQuery = {};

    switch (universe) {
      case 'naruto':
        title = '🍃 *LEAF VILLAGE LEADERBOARD (Chakra)* 🍃';
        sortField = 'maxChakra';
        filterQuery = { ninjaRegistered: true };
        break;
      case 'demonslayer':
        title = '⚔️ *DEMON SLAYER CORPS LEADERBOARD (Mastery)* ⚔️';
        sortField = 'mastery';
        filterQuery = { slayerRegistered: true };
        break;
      case 'bleach':
        title = '🌸 *GOTEI 13 LEADERBOARD (Reiryoku)* 🌸';
        sortField = 'reiryoku';
        filterQuery = { reaperRegistered: true };
        break;
      case 'dbz':
      default:
        title = '⚡ *DRAGON BALL LEADERBOARD (Power Level)* ⚡';
        sortField = 'basePL';
        filterQuery = { registered: true };
        break;
    }

    const topPlayers = await User.find(filterQuery)
      .sort({ [sortField]: -1 })
      .limit(10);

    if (topPlayers.length === 0) {
      await sock.sendMessage(from, { text: `📜 No registered fighters found in the *${universe.toUpperCase()}* universe yet!` });
      return;
    }

    let boardText = `${title}\n\n`;
    topPlayers.forEach((p, index) => {
      const pName = p.name || p.ninjaName || p.slayerName || p.reaperName || 'Warrior';
      const stat = p[sortField];
      boardText += `*${index + 1}.* ${pName} — ⚡ ${stat}\n`;
    });

    await sock.sendMessage(from, { text: boardText });
  }
};