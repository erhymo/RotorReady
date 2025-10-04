import express from 'express';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '2mb' }));

// Serve statiske filer fra ./public (index.html lastes på '/')
app.use(express.static('public'));

// Helse-sjekk
app.get('/health', (_req, res) => {
  res.json({ ok: true, model: process.env.MODEL || 'gpt-4o-mini' });
});

// Enkel "snakk med AI": POST /api/ask { question: "..." }
app.post('/api/ask', async (req, res) => {
  try {
    const question = (req.body && req.body.question) ? String(req.body.question) : '';
    if (!question.trim()) {
      return res.status(400).json({ error: "Mangler 'question' i body." });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const model = process.env.MODEL || 'gpt-4o-mini';

    const system = 'Du er en kortfattet assistent for luftfart/helikopter. Svar på norsk og vær presis.';
    const user = 'Brukerspørsmål: ' + question;

    const r = await client.responses.create({
      model: model,
      input: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.2
    });

    const text = r.output_text || '';
    res.json({ answer: text.trim() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Noe gikk galt mot modellen.', detail: String(err) });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log('RotorReady AI server kjører på http://localhost:' + port);
});
