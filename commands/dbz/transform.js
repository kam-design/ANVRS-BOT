export default {
  name: 'transform',
  description: 'Transform into unlocked forms',
  async execute(sock, message, args, { user }) {
    if (!user.registered || user.race === 'None') {
      await sock.sendMessage(message.from, { text: '⚠️ Register first with `#register saiyan/human/half_saiyan <name>`' });
      return;
    }

    const requestedForm = args.join(' ').toLowerCase();

    const formBoosts = {
      'base': { name: 'Base', boost: 0 },
      'super saiyan': { name: 'Super Saiyan', boost: 3000 },
      'super saiyan 2': { name: 'Super Saiyan 2', boost: 6000 },
      'super saiyan 3': { name: 'Super Saiyan 3', boost: 10000 }
    };

    if (!requestedForm || !formBoosts[requestedForm]) {
      await sock.sendMessage(message.from, {
        text: `⚡ *AVAILABLE FORMS*\n\n` +
              `Unlocked: ${user.unlockedForms.join(', ')}\n\n` +
              `Usage: \`#transform <form_name>\`\n` +
              `Example: \`#transform super saiyan\``
      });
      return;
    }

    const selected = formBoosts[requestedForm];

    if (!user.unlockedForms.includes(selected.name)) {
      await sock.sendMessage(message.from, { 
        text: `❌ You have not unlocked *${selected.name}* yet! Keep training with \`#train\`.` 
      });
      return;
    }

    user.currentForm = selected.name;
    user.tempPL = selected.boost;
    await user.save();

    const totalPL = (user.basePL + user.tempPL) * user.activeKaioken;

    await sock.sendMessage(message.from, {
      text: `💥 *TRANSFORMATION ACTIVE!*\n\n` +
            `• Active Form: *${user.currentForm}*\n` +
            `• Form Boost: +${user.tempPL} PL\n` +
            `• Total Active PL: ⚡ ${totalPL}`
    });
  }
};