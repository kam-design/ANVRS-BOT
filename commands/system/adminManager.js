import { Group } from '../../models/Group.js';
import { isOverlord } from '../../utils/adminCheck.js';

export default {
  name: 'add',
  description: 'Overlord command to add bot admins',
  async execute(sock, message, args) {
    const { from, sender, rawMsg } = message;

    if (!isOverlord(sender)) {
      await sock.sendMessage(from, { text: '❌ Only the *Overlord* can assign bot admins.' });
      return;
    }

    const targetJid = rawMsg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || args[0];

    if (!targetJid) {
      await sock.sendMessage(from, { text: '⚠️ Usage: `#add @tag` or `#add <JID/LID>`' });
      return;
    }

    let group = await Group.findOne({ jid: from });
    if (!group) group = new Group({ jid: from });

    if (!group.customAdmins.includes(targetJid)) {
      group.customAdmins.push(targetJid);
      await group.save();
    }

    await sock.sendMessage(from, { text: `👑 Added @${targetJid.split('@')[0]} to Bot Admins!`, mentions: [targetJid] });
  }
};