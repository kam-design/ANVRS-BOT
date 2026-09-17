export default {
  name: 'nregister',
  description: 'Register as a Shinobi',
  async execute(sock, message, args, { user }) {
    if (user.ninjaRegistered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ You are already a *${user.ninjaRank}* from *${user.village}*!` 
      });
      return;
    }

    const villages = ['konoha', 'suna', 'kiri', 'kumo', 'iwa'];
    const chosenVillage = args[0]?.toLowerCase();

    if (!chosenVillage || !villages.includes(chosenVillage)) {
      await sock.sendMessage(message.from, {
        text: `🍃 *SHINOBI REGISTRATION*\n\n` +
              `Usage: \`#nregister <village> <ninja_name>\` \n\n` +
              `Villages: *konoha*, *suna*, *kiri*, *kumo*, *iwa*\n` +
              `Example: \`#nregister konoha Sasuke\``
      });
      return;
    }

    const natures = ['Fire', 'Water', 'Lightning', 'Earth', 'Wind'];
    const randomNature = natures[Math.floor(Math.random() * natures.length)];
    const ninjaName = args.slice(1).join(' ') || message.pushName;

    user.ninjaName = ninjaName;
    user.village = chosenVillage.toUpperCase();
    user.ninjaRank = 'Academy Student';
    user.chakra = 100;
    user.maxChakra = 100;
    user.chakraNature = randomNature;
    user.jutsus = ['Clone Technique', 'Substitution'];
    user.ninjaRegistered = true;
    await user.save();

    await sock.sendMessage(message.from, {
      text: `🌀 *WELCOME TO THE SHINOBI WORLD!* 🌀\n\n` +
            `👤 *Name:* ${user.ninjaName}\n` +
            `🏙️ *Village:* ${user.village}\n` +
            `📜 *Rank:* ${user.ninjaRank}\n` +
            `⚡ *Chakra Nature:* ${user.chakraNature}\n` +
            `💥 *Base Chakra:* ${user.chakra}`
    });
  }
};