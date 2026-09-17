import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'ping',
  description: 'Check bot latency and status',
  async execute(sock, message, args, { activeMode }) {
    const isDbz = activeMode === 'dbz';
    const imageName = isDbz ? 'Goku.jpg' : 'Naruto.jpg';
    const imagePath = path.join(__dirname, `../../assets/${imageName}`);

    const captionText = isDbz 
      ? 'Pong! 🐉 ANVRS_BOT is online! KAMEHAMEHA!' 
      : 'Pong! 🍃 ANVRS_BOT is online! DATTEBAYO!';

    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await sock.sendMessage(message.from, { image: imageBuffer, caption: captionText });
    } else {
      await sock.sendMessage(message.from, { text: captionText });
    }
  }
};