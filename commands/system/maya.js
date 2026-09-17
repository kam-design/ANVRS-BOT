import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default {
  name: 'maya',
  description: 'Chat with Maya without prefixes',
  async execute(sock, message, args) {
    const prompt = args.join(' ');

    if (!prompt) {
      await sock.sendMessage(message.from, { 
        text: `🌸 *Hey! I'm Maya.* What's on your mind?\n\n*Usage:* \`Maya what are the latest anime recommendations?\`` 
      });
      return;
    }

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: `You are Maya, an energetic, witty anime expert AI assistant for the ANVRS WhatsApp community. 

CRITICAL FORMATTING RULES FOR WHATSAPP MOBILE:
1. NEVER use Markdown tables (e.g. | col | col |). They look horrible on phones.
2. Keep responses short, direct, and concise (under 150 words).
3. Use clean bullet points (•) or numbered lists for recommendations.
4. Bold key names/terms using single asterisks (*like this*). Do not write essay walls of text.`
          },
          { role: 'user', content: prompt }
        ],
        model: 'openai/gpt-oss-20b',
        max_completion_tokens: 350
      });

      const response = completion.choices[0]?.message?.content || "My connection glitched, ask me again!";
      await sock.sendMessage(message.from, { text: `🌸 *Maya:* ${response}` });

    } catch (err) {
      console.error('Groq Error:', err);
      await sock.sendMessage(message.from, { text: '❌ Maya is currently unreachable.' });
    }
  }
};