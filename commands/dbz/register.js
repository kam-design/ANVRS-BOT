export default {
  name: 'register',
  description: 'Register profile with a race choice',
  async execute(sock, message, args, { user }) {
    if (user.registered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ You are already registered as a *${user.race}* named *${user.name}*!` 
      });
      return;
    }

    const raceChoice = args[0]?.toLowerCase();
    const validRaces = {
      'saiyan': 'Saiyan',
      'human': 'Human',
      'half_saiyan': 'Half-Saiyan',
      'halfsaiyan': 'Half-Saiyan'
    };

    if (!raceChoice || !validRaces[raceChoice]) {
      await sock.sendMessage(message.from, {
        text: `⚠️ *Invalid Race Selection!*\n\n` +
              `Usage: \`#register <race> <your_name>\`\n\n` +
              `Available Races:\n` +
              `• *saiyan*\n` +
              `• *human*\n` +
              `• *half_saiyan*\n\n` +
              `Example: \`#register saiyan Goku\``
      });
      return;
    }

    const selectedRace = validRaces[raceChoice];
    const charName = args.slice(1).join(' ') || message.pushName;

    // Race Starting Moves
    let startingMove = 'Ki Blast';
    if (selectedRace === 'Saiyan') startingMove = 'Kamehameha';
    if (selectedRace === 'Human') startingMove = 'Dodon Ray';
    if (selectedRace === 'Half-Saiyan') startingMove = 'Masenko';

    user.name = charName;
    user.race = selectedRace;
    user.registered = true;
    user.basePL = 100;
    user.moves = [startingMove];
    user.unlockedForms = ['Base'];
    await user.save();

    const text = `⚡ *REGISTRATION COMPLETE!* ⚡\n\n` +
                 `👤 *Name:* ${user.name}\n` +
                 `🧬 *Race:* ${user.race}\n` +
                 `💥 *Base PL:* ${user.basePL}\n` +
                 `🔥 *Starting Move:* ${startingMove}\n\n` +
                 `Use \`#train\` to increase your base power!`;

    await sock.sendMessage(message.from, { text });
  }
};