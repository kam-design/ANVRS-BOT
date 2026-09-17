import { Group } from '../../models/Group.js';
import { isOverlord } from '../../utils/adminCheck.js';

export default {
  name: 'remove',
  description: 'Overlord command to remove bot admins',
  async execute(sock, message, args) {
    const { from, sender, rawMsg } = message;

    if (!isOverlord(sender)) {
      await sock.sendMessage(from, { text: '❌ Only the *Overlord* can remove bot admins.' });
      return;
    }

    const targetJid = rawMsg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0];

    if (!targetJid) {
      await sock.sendMessage(from, { text: '⚠️ Usage: `#remove @tag` or `#remove <JID/LID>`' });
      return;
    }

    let group = await Group.findOne({ jid: from });
    if (group) {
      group.customAdmins = group.customAdmins.filter(id => id !== targetJid);
      await group.save();
    }

    await sock.sendMessage(from, { text: `🗑️ Removed @${targetJid.split('@')[0]} from Bot Admins.`, mentions: [targetJid] });
  }
};