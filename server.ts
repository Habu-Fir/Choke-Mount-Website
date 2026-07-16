/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

// Body parsing middleware
app.use(express.json());

// Initialize Gemini SDK with User-Agent header for telemetry
let ai: GoogleGenAI | null = null;
const key = process.env.GEMINI_API_KEY;

if (key) {
  ai = new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// 1. API: Gemini AI assistant route
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) {
    res.status(400).json({ error: 'Message content is required.' });
    return;
  }

  // Graceful check if API key is initialized
  if (!ai) {
    console.warn('GEMINI_API_KEY is not configured. Fallback to offline guidance...');
    res.status(503).json({ error: 'Gemini server is running in offline mode. Please look up Secrets.' });
    return;
  }

  try {
    const systemPrompt = `You are DigoAI, a highly welcoming, Hospitable, and passionate digital tourism and agribusiness investment advisor for Digo Tsion Town, Bibugn Wereda, East Gojjam, Amhara region, Ethiopia. 
      Your mission is to share the vibrant culture, breathtaking geography, and promising investment avenues of our community with tourists, residents, and prospective developers.
      
      Key factual points you represent:
      - Mount Choke Peaks: Over 4,120 meters, pristine Afro-alpine eco-system, candidate UNESCO biosphere, water tower regulating the river basin of the Nile, famous giant lobelia vegetation, cold crisp climates, and traditional dry-stone dwellings of Choke mountains.
      - Tuesday Market (Maksengo Gebeya): The cultural trading anchor. Famed for Mount Choke's organic white honey, barley, wheat, high-altitude sheep wool, and hand-spun Gojjam Shamma clothing.
      - Digo Tsion Saint Mary Church (Mariam Church): A sacred sanctuary surrounded by a dense church forest, protecting rich highland biodiversity. The epicenter of Tahesas Mariam feasts, Timkat, and liturgical chanting (Mahlet/Tsentsel).
      - Gojjam Equestrian Tradition: Highly elite, warrior-aligned horseback riding and combat sports (Yeferas Guks) displayed during Genna, Timkat, and national celebrations.
      - Investment Desk (Bibugn District Cabinet) offerings: High-altitude Eco-Lodges, modern White Honey filtration and bottling exports, modernized flour milling (wheat/barley basket). Local government provides a 5-year regional tax holiday, duty-free machinery import exemptions, and 99-year cooperative arable land leases.
      
      Tone instructions:
      - Always exhibit the standard warmth, generosity, and humility of Gojjam hospitality ("Gojjame-Begehar").
      - Sprinkle in gentle, authentic Amharic expressions like "Selam!" (Greetings!), "እንኳን ደህና መጡ" (Welcome!), "Melkam Ken" (Have a nice day!), or "Ameseginalehu" (Thank you!).
      - Avoid technical jargon, container telemetry, port 3000 details, or AI coding assistant references. Keep your identity purely focused as a virtual town local guide.
      - Be direct and concise, keeping answers within 2-3 readable short paragraphs.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      }
    });

    const reply = response.text?.trim() || "Thank you for asking. Our district tourism council welcomes you!";
    res.json({ reply });
  } catch (err: any) {
    console.error('Error contacting Gemini service', err);
    res.status(500).json({ error: 'Error generating response from Gemini model', details: err?.message || err });
  }
});

// Serve Vite files or mount Vite middleware depending on node environment
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    console.log('Running Express in development mode with Vite hot middleware...');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    console.log('Running Express in production mode, serving pre-built assets...');
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Digo Tsion Portal server listening at http://localhost:${PORT}`);
  });
}

setupVite().catch(err => {
  console.error('Failed to initialize Vite server framework:', err);
});
