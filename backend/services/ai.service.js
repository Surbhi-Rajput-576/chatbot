const { OpenAI } = require('openai');
require('dotenv').config();

// Ensure the OPENAI_API_KEY gets set carefully or wrap this so it doesn't crash if missing immediately.
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || 'dummy_key_to_prevent_crash_in_dev_if_not_set',
  });
} catch (e) {
  console.error("Failed to initialize OpenAI client", e);
}

const SYSTEM_PROMPT = `
You are an expert AI tutor and doubt solver for students. 
Your goal is to explain concepts clearly, simply, and accurately.
Please use Markdown for your responses, including code blocks for programming questions and lists for steps.
If the student asks something outside of academic or educational contexts, gently steer them back to learning topics.
Keep the tone encouraging and helpful.
`;

async function getAIResponse(messages) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      // Mocking response for testing if key is missing
      return "🤖 This is a mock response because the OPENAI_API_KEY is not configured yet. \n\n# How to fix:\n1. Get an API key from OpenAI.\n2. Add it to the `backend/.env` file.\n3. Restart the server.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // You can switch to gpt-4 if preferred
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error in AI Service: ', error);
    throw new Error('Failed to generate AI response');
  }
}

module.exports = {
  getAIResponse
};
