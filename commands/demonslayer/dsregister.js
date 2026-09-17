export default {
  name: 'dsregister',
  description: 'Register as a Demon Slayer',
  async execute(sock, message, args, { user }) {
    if (user.slayerRegistered) {
      await sock.sendMessage(message.from, { 
        text: `⚠️ You are already a *${user.slayerRank}* using *${user.breathingStyle} Breathing*!` 
      });
      return;
    }

    const styles = ['Water', 'Flame', 'Thunder', 'Wind', 'Stone', 'Beast'];
    const chosenStyle = args[0]?.toLowerCase();

    const styleMap = {
      water: 'Water',
      flame: 'Flame',
      thunder: 'Thunder',
      wind: 'Wind',
      stone: 'Stone',
      beast: 'Beast'
    };

    if (!chosenStyle || !styleMap[chosenStyle]) {
      await sock.sendMessage(message.from, {
        text: `⚔️ *DEMON SLAYER CORPS REGISTRATION*\n\n` +
              `Usage: \`#dsregister <style> <slayer_name>\`\n\n` +
              `Breathing Styles: *water*, *flame*, *thunder*, *wind*, *stone*, *beast*\n` +
              `Example: \`#dsregister thunder Zenitsu\``
      });
      return;
    }

    const bladeColors = ['Black', 'Red', 'Blue', 'Yellow', 'Green', 'Amber'];
    const randomColor = bladeColors[Math.floor(Math.random() * bladeColors.length)];
    const slayerName = args.slice(1).join(' ') || message.pushName;

    user.slayerName = slayerName;
    user.breathingStyle = styleMap[chosenStyle];
    user.slayerRank = 'Mizunoto';
    user.mastery = 100;
    user.bladeColor = randomColor;
    user.slayerRegistered = true;
    await user.save();

    await sock.sendMessage(message.from, {
      text: `🗡️ *JOINED THE DEMON SLAYER CORPS!* 🗡️\n\n` +
            `👤 *Name:* ${user.slayerName}\n` +
            `🌊 *Style:* ${user.breathingStyle} Breathing\n` +
            `📜 *Rank:* ${user.slayerRank}\n` +
            `⚔️ *Nichirin Blade:* ${user.bladeColor}\n` +
            `💥 *Mastery:* ${user.mastery}`
    });
  }
};