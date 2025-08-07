const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves index.html from /public

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

let chatModel; // Chat session object

// Initialize the chat session
async function initChatModel() {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  chatModel = await model.startChat({
    history: [], // Optional: add system or user messages here
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 2048,
    },
  });

  
}

 
initChatModel();

app.post('/chat', async (req, res) => {
  try {
    const { message } = req.body;
 
    if (!chatModel) {
      return res.status(503).json({ error: "Model not initialized yet. Try again." });
    }

    const result = await chatModel.sendMessage(message);
    const reply = result.response.text();

    res.json({ reply });
  } catch (err) {
    console.error("Error in /chat:", err);
    res.status(500).json({ error: "Something went wrong. Please try again later." });
  }
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
