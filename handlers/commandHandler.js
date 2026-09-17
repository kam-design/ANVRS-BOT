import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { Group } from '../models/Group.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const systemCommands = new Map();
const gameCommands = {
  dbz: new Map(),
  naruto: new Map(),
  demonslayer: new Map(),
  bleach: new Map()
};

export const loadCommands = async () => {
  systemCommands.clear();
  gameCommands.dbz.clear();
  gameCommands.naruto.clear();
  gameCommands.demonslayer.clear();
  gameCommands.bleach.clear();

  const commandsPath = path.join(__dirname, '../commands');
  const categories = fs.readdirSync(commandsPath);

  for (const category of categories) {
    const catPath = path.join(commandsPath, category);
    if (fs.statSync(catPath).isDirectory()) {
      const files = fs.readdirSync(catPath).filter(f => f.endsWith('.js'));
      
      for (const file of files) {
        const filePath = path.join(catPath, file);
        const fileUrl = pathToFileURL(filePath).href;
        const commandModule = await import(`${fileUrl}?update=${Date.now()}`);
        const command = commandModule.default;

        if (!command?.name) continue;

        if (category === 'system') {
          systemCommands.set(command.name, command);
        } else if (category === 'dbz') {
          gameCommands.dbz.set(command.name, command);
        } else if (category === 'naruto') {
          gameCommands.naruto.set(command.name, command);
        } else if (category === 'demonslayer') {
          gameCommands.demonslayer.set(command.name, command);
        } else if (category === 'bleach') {
          gameCommands.bleach.set(command.name, command);
        }
      }
    }
  }
  console.log(`Loaded System: ${systemCommands.size} | DBZ: ${gameCommands.dbz.size} | Naruto: ${gameCommands.naruto.size} | Demon Slayer: ${gameCommands.demonslayer.size} | Bleach: ${gameCommands.bleach.size}`);
};

export const handleCommand = async (sock, message, user) => {
  const { text, from } = message;
  if (!text) return;

  // 1. Prefixless Maya AI Trigger Check
  if (text.toLowerCase().startsWith('maya')) {
    const rawPrompt = text.replace(/^maya\s*/i, '').trim();
    const mayaCommand = systemCommands.get('maya');

    if (mayaCommand) {
      const args = rawPrompt ? rawPrompt.split(/ +/) : [];
      let group = await Group.findOne({ jid: from });
      const activeMode = group ? group.activeGame : 'dbz';
      await mayaCommand.execute(sock, message, args, { user, activeMode });
      return;
    }
  }

  // 2. Standard Prefix Check for All Other Commands
  if (!text.startsWith('#')) return;

  const args = text.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // 3. System Commands (#wallpaper, #music, #hentai, #selectgame, etc.)
  if (systemCommands.has(commandName)) {
    let group = await Group.findOne({ jid: from });
    const activeMode = group ? group.activeGame : 'dbz';
    await systemCommands.get(commandName).execute(sock, message, args, { user, activeMode });
    return;
  }

  // 4. Fetch Group Active Game
  let group = await Group.findOne({ jid: from });
  if (!group) {
    group = await Group.create({ jid: from, activeGame: 'dbz' });
  }

  const activeMode = group.activeGame;
  const activeMap = gameCommands[activeMode];

  // 5. Execute Active Game Command
  if (activeMap && activeMap.has(commandName)) {
    await activeMap.get(commandName).execute(sock, message, args, { user, activeMode });
  } else {
    await sock.sendMessage(from, { 
      text: `⚠️ Command \`#${commandName}\` is not available in current mode (*${activeMode.toUpperCase()}*).` 
    });
  }
};