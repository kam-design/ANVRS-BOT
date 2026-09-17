import { Group } from '../models/Group.js';

export const OVERLORD_JID = '42924289085446@lid';

export const isOverlord = (sender) => sender === OVERLORD_JID;

export const isBotAdmin = async (sock, chatJid, sender) => {
  if (isOverlord(sender)) return true;

  if (chatJid.endsWith('@g.us')) {
    try {
      // 1. Check Native WhatsApp Group Admins
      const groupMeta = await sock.groupMetadata(chatJid);
      const participant = groupMeta.participants.find(p => p.id === sender);
      if (participant?.admin) return true;

      // 2. Check Custom Bot Admins stored in MongoDB
      const group = await Group.findOne({ jid: chatJid });
      if (group && group.customAdmins.includes(sender)) return true;
    } catch (err) {
      console.error('Admin check error:', err);
    }
  }

  return false;
};