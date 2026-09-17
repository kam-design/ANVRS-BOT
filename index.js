import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '1.1.1.1']);

import 'dotenv/config';
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from '@whiskeysockets/baileys';
import qrcode from 'qrcode-terminal';
import pino from 'pino';
import { connectDB } from './config/database.js';
import { User } from './models/User.js';
import { loadCommands, handleCommand } from './handlers/commandHandler.js';

async function startBot() {
  await connectDB();
  await loadCommands();

  const { state, saveCreds } = await useMultiFileAuthState('auth_info');

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    logger: pino({ level: 'error' }),
    syncFullHistory: false
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('Scan this QR code with WhatsApp:');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('Connection closed. Reconnecting...', shouldReconnect);
      if (shouldReconnect) startBot();
    } else if (connection === 'open') {
      console.log('ANVRS_BOT is successfully connected to WhatsApp!');
    }
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('messages.upsert', async (m) => {
    try {
      const msg = m.messages[0];
      if (!msg || !msg.message || msg.key.fromMe) return;

      // FIX: Preserve group/chat remote JID for replies
      const from = msg.key.remoteJid; 
      const sender = msg.key.participant || msg.key.remoteJid;
      const pushName = msg.pushName || 'User';

      const text = (
        msg.message.conversation ||
        msg.message.extendedTextMessage?.text ||
        msg.message.imageMessage?.caption ||
        msg.message.videoMessage?.caption ||
        ''
      ).trim();

      if (!text) return;

      console.log(`[MSG] Chat: ${from} | Sender: ${sender} | Text: "${text}"`);

      // MongoDB Auto-Registration
      let user = await User.findOne({ jid: sender });
      if (!user) {
        user = await User.create({ jid: sender, name: pushName });
        console.log(`[DB] Created user for ${pushName}`);
      }

      const messageData = { from, sender, pushName, text, rawMsg: msg };
      await handleCommand(sock, messageData, user);

    } catch (err) {
      console.error('Error handling incoming message:', err);
    }
  });
}

startBot();