const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeContent, jobContent } = req.body;

    if (!resumeContent || !jobContent) {
      return res.status(400).json({ error: "Missing content" });
    }

    const systemInstruction = `
      You are a professional hiring manager. 
      Analyze the resume against the job description.
      You must return ONLY a JSON object with this exact structure:
      {
        "matchScore": number,
        "executiveSummary": "string",
        "strengths": ["list of strings"],
        "gaps": ["list of strings"],
        "keywordsFound": ["list of strings"],
        "keywordsMissing": ["list of strings"],
        "suggestions": ["list of strings"],
        "interviewPrep": ["list of strings"]
      }
    `;

    const userPrompt = `RESUME: ${resumeContent}\nJOB DESCRIPTION: ${jobContent}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        temperature: 0.2,
      },
    });

    const parsedData = JSON.parse(response.text);
    res.json(parsedData);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Failed to analyze data." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
