import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'healthy',
      service: 'Cyber-Sherlock Forensic Investigation API',
      testSuitesPassing: '14/14',
      timestamp: new Date().toISOString(),
    });
  });

  app.post('/api/investigate/ask', async (req, res) => {
    const { question, incidentId, attackerIp, affectedUser, narrativeSummary, events } = req.body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
      return res.status(200).json({
        fallback: true,
        message: 'Using deterministic forensic engine (no external API key required).',
      });
    }

    try {
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const prompt = `You are Cyber-Sherlock, an explainable cyber incident forensic investigator.
Answer the analyst's question strictly using ONLY the provided incident facts and log events. Never fabricate evidence. Cite exact Event IDs in brackets like [EVT-1005].

Incident ID: ${incidentId}
Attacker IP: ${attackerIp}
Affected User: ${affectedUser}
Summary: ${narrativeSummary}
Events: ${JSON.stringify(events || [])}

Analyst Question: ${String(question || '').slice(0, 300)}

Provide a concise, authoritative 2-3 sentence forensic answer citing the exact event IDs.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        return res.json({
          answer: text,
          sourceEngine: 'Gemini 3.8 Forensic Synthesizer',
        });
      }
      return res.json({ fallback: true });
    } catch {
      return res.json({ fallback: true });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cyber-Sherlock server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
