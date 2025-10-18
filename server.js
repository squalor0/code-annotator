const fetch = require('node-fetch');
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.post('/comment', async (req, res) => {
  const { code } = req.body;
  console.log('Recieved code:', code);
  
  try {
    console.log('Calling Ollama...');
    const response = await fetch('http://localhost:11434/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'tinyllama',
        messages: [{
          role: 'user',
          content: `Generate concise explanatory comments for this JavaScript code for the purpose of annotation:\n\n${code}`
        }],
        temperature: 0.3,
        max_tokens: 200
      })
    });

    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    const comments = data.choices?.[0]?.message?.content || JSON.stringify(data);
    console.log('Comments:', comments);
    console.log('Sending respons...');
    res.json({ comments });
    console.log('Response sent!');
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
