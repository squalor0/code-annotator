const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.post('/comment', async (req, res) => {
  const { code } = req.body;
  
  try {
    const response = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        messages: [{
          role: 'user',
          content: `Generate concise explanatory comments for this JavaScript code. Return ONLY the comments:\n\n${code}`
        }],
        temperature: 0.3,
        max_tokens: 200
      })
    });
    
    const data = await response.json();
    const comments = data.choices[0].message.content;
    res.json({ comments });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
