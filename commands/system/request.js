import { isBotAdmin } from '../../utils/adminCheck.js';

export default {
  name: 'request',
  description: 'Request pairing code to link spare WhatsApp number',
  async execute(sock, message, args) {
    const { from, sender } = message;

    const hasPermission = await isBotAdmin(sock, from, sender);
    if (!hasPermission) {
      await sock.sendMessage(from, { text: '❌ Only Bot Admins can request multi-number pairing codes.' });
      return;
    }

    const phoneNumber = args[0]?.replace(/[^0-9]/g, '');

    if (!phoneNumber || phoneNumber.length < 10) {
      await sock.sendMessage(from, {
        text: `⚠️ *INVALID PHONE NUMBER!*\n\n` +
              `Usage: \`#request <phone_number_with_country_code>\`\n` +
              `Example: \`#request 263771234567\``
      });
      return;
    }

    try {
      // Requests 8-digit pairing code from Baileys
      const code = await sock.requestPairingCode(phoneNumber);
      
      const formattedCode = code?.match(/.{1,4}/g)?.join('-') || code;

      await sock.sendMessage(from, {
        text: `📲 *WHATSAPP PAIRING CODE GENERATED!*\n\n` +
              `Target Number: \`+${phoneNumber}\`\n` +
              `Pairing Code: *${formattedCode}*\n\n` +
              `1. Open WhatsApp on target phone.\n` +
              `2. Go to Linked Devices > Link a Device > Link with phone number instead.\n` +
              `3. Enter the code above.`
      });
    } catch (err) {
      console.error('Pairing Code Request Error:', err);
      await sock.sendMessage(from, { text: '❌ Failed to generate pairing code. Ensure the number is active on WhatsApp.' });
    }
  }
};