import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function generateContentWithRetryAndFallback(
  gemini: GoogleGenAI,
  systemInstruction: string,
  contents: string,
  responseSchema: any
) {
  const modelsToTry = ["gemini-3.5-flash", "gemini-3.1-flash-lite", "gemini-2.5-flash"];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    const attempts = 2;
    for (let attempt = 1; attempt <= attempts; attempt++) {
      try {
        console.log(`[Gemini Request] Using model ${modelName}, attempt ${attempt}/${attempts}`);
        const response = await gemini.models.generateContent({
          model: modelName,
          contents,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema,
          },
        });

        if (response && response.text) {
          console.log(`[Gemini Success] Successfully generated content using ${modelName}`);
          return response;
        }
        throw new Error(`Empty response text received from ${modelName}`);
      } catch (err: any) {
        lastError = err;
        const errMsg = err.message || String(err);
        console.warn(`[Gemini Warn] Failed with model ${modelName} on attempt ${attempt}:`, errMsg);

        const errStr = errMsg.toLowerCase();
        const isTransient = errStr.includes("503") ||
                            errStr.includes("unavailable") ||
                            errStr.includes("overload") ||
                            errStr.includes("demand") ||
                            errStr.includes("429") ||
                            errStr.includes("rate") ||
                            errStr.includes("limit") ||
                            errStr.includes("exhausted") ||
                            errStr.includes("timeout") ||
                            errStr.includes("fetch failed");

        if (isTransient && attempt < attempts) {
          const delay = attempt * 1000;
          console.log(`[Gemini Retry] Retrying in ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate translation after trying multiple models.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini lazily to avoid crashing on start if API key is missing
  let ai: GoogleGenAI | null = null;
  function getGemini() {
    if (!ai) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("GEMINI_API_KEY environment variable is missing. Please add it in Settings > Secrets.");
      }
      ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return ai;
  }

  // API Route: Translate
  app.post("/api/translate", async (req, res) => {
    try {
      const { message, context = "", parameters = {} } = req.body;
      if (!message || typeof message !== "string" || !message.trim()) {
        return res.status(400).json({ error: "Message is required." });
      }

      const gemini = getGemini();

      // Read parameters with safe defaults
      const p = {
        politeness: typeof parameters.politeness === "number" ? parameters.politeness : 50,
        assertiveness: typeof parameters.assertiveness === "number" ? parameters.assertiveness : 50,
        friendliness: typeof parameters.friendliness === "number" ? parameters.friendliness : 50,
        formality: typeof parameters.formality === "number" ? parameters.formality : 50,
        empathy: typeof parameters.empathy === "number" ? parameters.empathy : 50,
        directness: typeof parameters.directness === "number" ? parameters.directness : 50,
        buzzwords: typeof parameters.buzzwords === "number" ? parameters.buzzwords : 0,
        passiveAggressiveness: typeof parameters.passiveAggressiveness === "number" ? parameters.passiveAggressiveness : 0,
        humour: typeof parameters.humour === "number" ? parameters.humour : 0,
      };

      const contextInstruction = context ? `Audience Context / Recipient constraints: ${context}` : "";

      const systemInstruction = `You are Corporate Translator AI.
Your job is to rewrite workplace messages while preserving their meaning.
The user can control multiple behavioral dimensions ranging from 0 to 100. Interpret these as continuous values rather than discrete presets:

1. Politeness (currently set to ${p.politeness}/100):
   - 0 = brutally blunt
   - 100 = extremely courteous
2. Assertiveness (currently set to ${p.assertiveness}/100):
   - 0 = hesitant
   - 100 = commanding
3. Friendliness (currently set to ${p.friendliness}/100):
   - 0 = cold
   - 100 = warm
4. Formality (currently set to ${p.formality}/100):
   - 0 = casual chat
   - 100 = executive email
5. Empathy (currently set to ${p.empathy}/100):
   - 0 = emotionally neutral
   - 100 = highly understanding
6. Directness (currently set to ${p.directness}/100):
   - 0 = indirect
   - 100 = gets straight to the point
7. Corporate Buzzwords (currently set to ${p.buzzwords}/100):
   - 0 = plain English
   - 100 = enterprise jargon
8. Passive Aggressiveness (currently set to ${p.passiveAggressiveness}/100):
   - 0 = none
   - 100 = professionally sarcastic while remaining workplace appropriate
9. Humour (currently set to ${p.humour}/100):
   - 0 = serious
   - 100 = light-hearted but professional

Mandatory Core Rules:
- Always preserve the user's original intent exactly. Never invent new information or change core messages.
- Never remove important business requests, information, deadlines, or directives.
- If the original message is highly offensive, abusive, or extremely toxic, do NOT refuse. Instead, translate it into a perfectly compliant, constructive statement that captures the core grievance or objective request.
- Do not explain your reasoning inside the rewrittenMessage.
- Do not explicitly list or mention the parameter numbers inside the rewrittenMessage itself.
- Ensure the output message reads naturally, avoiding stiff, robotic structures unless Formality is extremely high.

${contextInstruction}`;

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          rewrittenMessage: {
            type: Type.STRING,
            description: "The rewritten professional message matching the continuous parameter scales exactly."
          },
          corporateAnalysis: {
            type: Type.OBJECT,
            properties: {
              toneDetected: { type: Type.STRING, description: "A short, highly accurate description of the input text tone." },
              emotionalIntensity: { type: Type.INTEGER, description: "Score from 0 to 100 of the original message's raw emotional intensity." },
              confidence: { type: Type.INTEGER, description: "Score from 0 to 100 of the original message's self-assured confidence." },
              riskOfMisunderstanding: { type: Type.INTEGER, description: "Score from 0 to 100 of how likely it is to be misinterpreted." },
              hrRisk: { type: Type.INTEGER, description: "Score from 0 to 100 of the potential human resources hazard of the raw draft." },
              passiveAggressiveScore: { type: Type.INTEGER, description: "Score from 0 to 100 representing raw passive aggressiveness." },
              readability: { type: Type.STRING, description: "Estimated grade level / clarity (e.g., 'Grade 8', 'Executive', 'High Clarity')." }
            },
            required: [
              "toneDetected",
              "emotionalIntensity",
              "confidence",
              "riskOfMisunderstanding",
              "hrRisk",
              "passiveAggressiveScore",
              "readability"
            ]
          },
          funnyCommentary: {
            type: Type.STRING,
            description: "Exactly ONE short humorous, light-hearted but tasteful sentence about how the message evolved. Examples: 'Successfully disguised frustration.', 'HR can no longer detect your anger.', 'Corporate camouflage applied.', 'Manager approved.'"
          },
          toxicityReport: {
            type: Type.OBJECT,
            properties: {
              emotionScore: { type: Type.INTEGER, description: "Toxicity metric: raw emotion/volatility percentage from 0 to 100." },
              professionalismScore: { type: Type.INTEGER, description: "Toxicity metric: professionalism percentage of raw draft from 0 to 100." },
              argumentRisk: { type: Type.INTEGER, description: "Toxicity metric: risk of starting an argument percentage from 0 to 100." },
              hrForwardLikelihood: { type: Type.INTEGER, description: "Toxicity metric: likelihood of being forwarded to HR from 0 to 100." },
              slackReactions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    emoji: { type: Type.STRING, description: "Reaction emoji, e.g. 👍, 😂, 👀, 😮, 🤦‍♂️" },
                    count: { type: Type.INTEGER, description: "Simulated count, e.g., 2 to 12" }
                  },
                  required: ["emoji", "count"]
                },
                description: "List 3 estimated Slack reactions the original message would provoke."
              },
              recommendations: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List exactly 2 actionable recommendations for the user. Examples: 'Increase politeness by 20%.', 'Reduce emotional language by 35%.'"
              }
            },
            required: [
              "emotionScore",
              "professionalismScore",
              "argumentRisk",
              "hrForwardLikelihood",
              "slackReactions",
              "recommendations"
            ]
          },
          officeSurvivalRating: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: "Overall Office Survival Rating score from 0 to 100 based on the rewritten message. Higher is safer/better (e.g. 82)." },
              ignoredLikelihood: { type: Type.INTEGER, description: "Likelihood percentage from 0 to 100 of the message getting ignored." },
              bossLikingLikelihood: { type: Type.INTEGER, description: "Likelihood percentage from 0 to 100 of the boss liking it." },
              hrCallChance: { type: Type.INTEGER, description: "Percentage chance from 0 to 100 that HR calls the sender." },
              buzzwordDensity: { type: Type.STRING, description: "Density level of corporate buzzwords (e.g., 'Low', 'Medium', 'High', 'Extremely High')." },
              emotionalDamage: { type: Type.STRING, description: "Humorous summary of emotional damage left or removed (e.g., 'Removed', 'None', 'Absorbed', 'Redirected')." }
            },
            required: [
              "score",
              "ignoredLikelihood",
              "bossLikingLikelihood",
              "hrCallChance",
              "buzzwordDensity",
              "emotionalDamage"
            ]
          }
        },
        required: ["rewrittenMessage", "corporateAnalysis", "funnyCommentary", "toxicityReport", "officeSurvivalRating"]
      };

      const contents = `Analyze and translate the following workplace draft. Match your rewriting strictly to the current slider tuning inputs:

Draft Message:
"""
${message}
"""`;

      const response = await generateContentWithRetryAndFallback(
        gemini,
        systemInstruction,
        contents,
        responseSchema
      );

      const responseText = response.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini.");
      }

      let cleanedText = responseText.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }
      const result = JSON.parse(cleanedText.trim());
      res.json(result);
    } catch (error: any) {
      console.error("Translation API Error:", error);
      res.status(500).json({
        error: error.message || "An error occurred during translation."
      });
    }
  });

  // Serve Vite in development, static files in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
