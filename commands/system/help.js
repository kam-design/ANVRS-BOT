import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Group } from '../../models/Group.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'help',
  description: 'Displays active universe commands',
  async execute(sock, message, args) {
    const { from } = message;

    // Fetch active game module from Group database
    const group = await Group.findOne({ jid: from }) || { activeGame: 'dbz' };
    const activeMode = group.activeGame || 'dbz';

    // Config map for all 4 universes
    const universeConfig = {
      dbz: {
        folder: 'dbz',
        image: 'dragon ball.jpg',
        header: '🐉 DRAGON BALL UNIVERSE'
      },
      naruto: {
        folder: 'naruto',
        image: 'Naruto Anime.jpg',
        header: '🍃 NARUTO UNIVERSE'
      },
      demonslayer: {
        folder: 'demonslayer',
        image: 'Demon Slayer.jpg',
        header: '⚔️ DEMON SLAYER UNIVERSE'
      },
      bleach: {
        folder: 'bleach',
        image: 'Bleach.jpg',
        header: '🌸 BLEACH UNIVERSE'
      }
    };

    const config = universeConfig[activeMode] || universeConfig.dbz;

    const getCommands = (dirName) => {
      const dirPath = path.join(__dirname, `../../commands/${dirName}`);
      if (!fs.existsSync(dirPath)) return [];
      return fs.readdirSync(dirPath).filter(f => f.endsWith('.js')).map(f => f.replace('.js', ''));
    };

    const sysCmds = getCommands('system');
    const gameCmds = getCommands(config.folder);

    let menu = `*— ${config.header} —*\n\n`;
    menu += `⚙️ *SYSTEM COMMANDS*\n` + sysCmds.map(c => `• #${c}`).join('\n') + `\n\n`;
    menu += `🔥 *GAME COMMANDS (${activeMode.toUpperCase()})*\n` + gameCmds.map(c => `• #${c}`).join('\n') + `\n\n`;
    menu += `_Type any command with '#' to execute._`;

    const imagePath = path.join(__dirname, `../../assets/${config.image}`);

    if (fs.existsSync(imagePath)) {
      const imageBuffer = fs.readFileSync(imagePath);
      await sock.sendMessage(from, { image: imageBuffer, caption: menu });
    } else {
      await sock.sendMessage(from, { text: menu });
    }
  }
};