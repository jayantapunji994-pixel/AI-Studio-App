
import express from "express";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: "1mb" }));

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({
        error: "Please enter your idea."
      });
    }

    const response = await client.responses.create({
      model: "gpt-5.5",
      instructions: `You are NEXORA AI, an expert website developer.
Create a complete, working, responsive HTML website.
Return ONLY the complete HTML code.
Do not use markdown code fences.`,
      input: prompt
    });

    res.json({
      code: response.output_text
    });

  } catch (error) {
    console.error("AI Error:", error.message);

    res.status(500).json({
      error: "AI generation failed. Check API key, billing and server logs."
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("NEXORA AI running on port " + PORT);
});
