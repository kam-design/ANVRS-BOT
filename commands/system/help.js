import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'help',
  description: 'Displays active universe commands',
  async execute(sock, message, args, { activeMode }) {
    const isDbz = activeMode === 'dbz';
    const activeFolder = isDbz ? 'dbz' : 'naruto';
    const imageName = isDbz ? 'dragon ball.jpg' : 'Naruto Anime.jpg';
    const headerTitle = isDbz ? '🐉 DRAGON BALL UNIVERSE' : '🍃 NARUTO UNIVERSE';

    const getCommands = (dirName) => {
      const dirPath = path.join(__dirname, `../../commands/${dirName}`);
      if (!fs.existsSync(dirPath)) return [];
      return fs.readdirSync(dirPath).filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
    };

    const sysCmds = getCommands('system');
    const gameCmds = getCommands(activeFolder);

    let menu = `*— ${headerTitle} —*\n\n`;
    menu += `⚙️ *SYSTEM COMMANDS*\n` + sysCmds.map(c => `• #${c}`).join('\n') + `\n\n`;
    menu += `🔥 *GAME COMMANDS*\n` + gameCmds.map(c => `• #${c}`).join('\n') + `\n\n`;
    menu += `_Type any command with '#' to execute._`;

    const imagePath = path.join(__dirname, `../../assets/${imageName}`);

    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await sock.sendMessage(message.from, { image: imageBuffer, caption: menu });
    } else {
      await sock.sendMessage(message.from, { text: menu });
    }
  }
};