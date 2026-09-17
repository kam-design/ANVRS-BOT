import { Group } from '../../models/Group.js';
import { isBotAdmin } from '../../utils/adminCheck.js';

export default {
  name: 'selectgame',
  aliases: ['cmd'],
  description: 'Switch group universe mode (Admin Only)',
  async execute(sock, message, args) {
    const { from, sender } = message;

    const hasPermission = await isBotAdmin(sock, from, sender);
    if (!hasPermission) {
      await sock.sendMessage(from, { text: '❌ *ACCESS DENIED!* Only the Overlord or Bot Admins can switch universes.' });
      return;
    }

    const choice = args[0]?.toLowerCase();
    const validGames = ['dbz', 'naruto', 'demonslayer', 'bleach'];

    if (!choice || !validGames.includes(choice)) {
      await sock.sendMessage(from, { 
        text: `👑 *OVERLORD ADMIN CONTROL*\n\n` +
              `Usage: \`#selectgame <dbz | naruto | demonslayer | bleach>\`\n\n` +
              `Available Modules:\n` +
              `• *dbz* - Dragon Ball Universe\n` +
              `• *naruto* - Naruto Shinobi Universe\n` +
              `• *demonslayer* - Demon Slayer Corps\n` +
              `• *bleach* - Soul Society (Gotei 13)` 
      });
      return;
    }

    let group = await Group.findOne({ jid: from });
    if (!group) group = new Group({ jid: from });

    group.activeGame = choice;
    await group.save();

    const titles = {
      dbz: '🐉 DRAGON BALL UNIVERSE',
      naruto: '🍃 NARUTO SHINOBI UNIVERSE',
      demonslayer: '⚔️ DEMON SLAYER CORPS',
      bleach: '⛩️ SOUL SOCIETY (BLEACH)'
    };

    await sock.sendMessage(from, { text: `✅ *UNIVERSE LOCKED!* Group set to *${titles[choice]}*.` });
  }
};