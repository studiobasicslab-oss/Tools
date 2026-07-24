import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  History, 
  Star, 
  ArrowRight, 
  AlertCircle, 
  Layers, 
  Share2, 
  BookOpen,
  ArrowUpDown,
  Lock,
  Compass,
  FileCheck,
  RotateCcw,
  Flame,
  ThumbsUp,
  Smile,
  ShieldAlert,
  Sliders,
  Sparkle
} from "lucide-react";
import { TranslationParameters, TranslationResult, TranslationHistoryItem } from "./types";
import { SAMPLE_MESSAGES } from "./samples";

const LOADING_MESSAGES = [
  "Mapping linguistic structures to enterprise parameters...",
  "Applying continuous behavioral feedback filters...",
  "Neutralizing emotional spikes & de-escalating frustration...",
  "Formatting corporate camouflage metrics & slack reactions...",
  "Polishing final professional draft..."
];

const PARAMETER_CONFIG = [
  {
    key: "politeness" as const,
    label: "Politeness",
    minLabel: "brutally blunt",
    maxLabel: "extremely courteous",
    color: "bg-emerald-500",
    textClass: "text-emerald-600",
    borderColor: "border-emerald-100",
  },
  {
    key: "assertiveness" as const,
    label: "Assertiveness",
    minLabel: "hesitant",
    maxLabel: "commanding",
    color: "bg-indigo-500",
    textClass: "text-indigo-600",
    borderColor: "border-indigo-100",
  },
  {
    key: "friendliness" as const,
    label: "Friendliness",
    minLabel: "cold",
    maxLabel: "warm",
    color: "bg-amber-500",
    textClass: "text-amber-600",
    borderColor: "border-amber-100",
  },
  {
    key: "formality" as const,
    label: "Formality",
    minLabel: "casual chat",
    maxLabel: "executive email",
    color: "bg-blue-500",
    textClass: "text-blue-600",
    borderColor: "border-blue-100",
  },
  {
    key: "empathy" as const,
    label: "Empathy",
    minLabel: "emotionally neutral",
    maxLabel: "highly understanding",
    color: "bg-pink-500",
    textClass: "text-pink-600",
    borderColor: "border-pink-100",
  },
  {
    key: "directness" as const,
    label: "Directness",
    minLabel: "indirect",
    maxLabel: "gets straight to the point",
    color: "bg-violet-500",
    textClass: "text-violet-600",
    borderColor: "border-violet-100",
  },
  {
    key: "buzzwords" as const,
    label: "Corporate Buzzwords",
    minLabel: "plain English",
    maxLabel: "enterprise jargon",
    color: "bg-sky-500",
    textClass: "text-sky-600",
    borderColor: "border-sky-100",
  },
  {
    key: "passiveAggressiveness" as const,
    label: "Passive Aggressiveness",
    minLabel: "none",
    maxLabel: "workplace sarcasm",
    color: "bg-rose-500",
    textClass: "text-rose-600",
    borderColor: "border-rose-100",
  },
  {
    key: "humour" as const,
    label: "Humour",
    minLabel: "serious",
    maxLabel: "light-hearted",
    color: "bg-cyan-500",
    textClass: "text-cyan-600",
    borderColor: "border-cyan-100",
  }
];

const PRESETS = [
  {
    id: "balanced",
    label: "Balanced",
    desc: "Standard executive standard",
    params: {
      politeness: 80,
      assertiveness: 60,
      friendliness: 70,
      formality: 75,
      empathy: 75,
      directness: 70,
      buzzwords: 30,
      passiveAggressiveness: 0,
      humour: 10,
    }
  },
  {
    id: "executive",
    label: "Executive Email",
    desc: "Highly formal and polished",
    params: {
      politeness: 90,
      assertiveness: 75,
      friendliness: 50,
      formality: 95,
      empathy: 40,
      directness: 80,
      buzzwords: 60,
      passiveAggressiveness: 0,
      humour: 0,
    }
  },
  {
    id: "diplomatic",
    label: "Diplomatic Shield",
    desc: "Conflict mitigation",
    params: {
      politeness: 95,
      assertiveness: 50,
      friendliness: 55,
      formality: 85,
      empathy: 80,
      directness: 65,
      buzzwords: 40,
      passiveAggressiveness: 0,
      humour: 5,
    }
  },
  {
    id: "direct_concise",
    label: "Direct & Concise",
    desc: "Action-focused and quick",
    params: {
      politeness: 70,
      assertiveness: 85,
      friendliness: 40,
      formality: 75,
      empathy: 30,
      directness: 95,
      buzzwords: 25,
      passiveAggressiveness: 0,
      humour: 0,
    }
  },
  {
    id: "camouflage",
    label: "Corporate Sarcasm",
    desc: "Camouflaged sarcasm",
    params: {
      politeness: 85,
      assertiveness: 80,
      friendliness: 30,
      formality: 85,
      empathy: 20,
      directness: 70,
      buzzwords: 80,
      passiveAggressiveness: 90,
      humour: 35,
    }
  }
];

export default function App() {
  // Input fields state
  const [message, setMessage] = useState("");
  const [context, setContext] = useState("");
  
  // Continuous Tuning Parameters
  const [parameters, setParameters] = useState<TranslationParameters>({
    politeness: 75,
    assertiveness: 60,
    friendliness: 65,
    formality: 70,
    empathy: 60,
    directness: 75,
    buzzwords: 30,
    passiveAggressiveness: 0,
    humour: 10,
  });

  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [history, setHistory] = useState<TranslationHistoryItem[]>([]);
  const [filterStarred, setFilterStarred] = useState(false);
  const [activeTab, setActiveTab] = useState<"translate" | "samples" | "rules">("translate");

  // Interaction feedback states
  const [copiedInput, setCopiedInput] = useState(false);
  const [copiedOutput, setCopiedOutput] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Client-side API Key configuration
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  // Loading animation stage interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      setLoadingStage(0);
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem("corporate_translator_history_v2");
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to load translation history:", e);
    }
  }, []);

  // Save history to localStorage helper
  const saveHistoryToStorage = (newHistory: TranslationHistoryItem[]) => {
    try {
      localStorage.setItem("corporate_translator_history_v2", JSON.stringify(newHistory));
      setHistory(newHistory);
    } catch (e) {
      console.error("Failed to save translation history:", e);
    }
  };

  // Trigger professional translation call
  const handleTranslate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    if (!apiKey) {
      setError("Please configure your Gemini API Key first. Click the key lock icon in the top right to configure it.");
      setIsSettingsOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);
    setActiveHistoryId(null);

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
      type: "OBJECT",
      properties: {
        rewrittenMessage: {
          type: "STRING",
          description: "The rewritten professional message matching the continuous parameter scales exactly."
        },
        corporateAnalysis: {
          type: "OBJECT",
          properties: {
            toneDetected: { type: "STRING", description: "A short, highly accurate description of the input text tone." },
            emotionalIntensity: { type: "INTEGER", description: "Score from 0 to 100 of the original message's raw emotional intensity." },
            confidence: { type: "INTEGER", description: "Score from 0 to 100 of the original message's self-assured confidence." },
            riskOfMisunderstanding: { type: "INTEGER", description: "Score from 0 to 100 of how likely it is to be misinterpreted." },
            hrRisk: { type: "INTEGER", description: "Score from 0 to 100 of the potential human resources hazard of the raw draft." },
            passiveAggressiveScore: { type: "INTEGER", description: "Score from 0 to 100 representing raw passive aggressiveness." },
            readability: { type: "STRING", description: "Estimated grade level / clarity (e.g., 'Grade 8', 'Executive', 'High Clarity')." }
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
          type: "STRING",
          description: "Exactly ONE short humorous, light-hearted but tasteful sentence about how the message evolved. Examples: 'Successfully disguised frustration.', 'HR can no longer detect your anger.', 'Corporate camouflage applied.', 'Manager approved.'"
        },
        toxicityReport: {
          type: "OBJECT",
          properties: {
            emotionScore: { type: "INTEGER", description: "Toxicity metric: raw emotion/volatility percentage from 0 to 100." },
            professionalismScore: { type: "INTEGER", description: "Toxicity metric: professionalism percentage of raw draft from 0 to 100." },
            argumentRisk: { type: "INTEGER", description: "Toxicity metric: risk of starting an argument percentage from 0 to 100." },
            hrForwardLikelihood: { type: "INTEGER", description: "Toxicity metric: likelihood of being forwarded to HR from 0 to 100." },
            slackReactions: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  emoji: { type: "STRING", description: "Reaction emoji, e.g. 👍, 😂, 👀, 😮, 🤦‍♂️" },
                  count: { type: "INTEGER", description: "Simulated count, e.g., 2 to 12" }
                },
                required: ["emoji", "count"]
              },
              description: "List 3 estimated Slack reactions the original message would provoke."
            },
            recommendations: {
              type: "ARRAY",
              items: { type: "STRING" },
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
          type: "OBJECT",
          properties: {
            score: { type: "INTEGER", description: "Overall Office Survival Rating score from 0 to 100 based on the rewritten message. Higher is safer/better (e.g. 82)." },
            ignoredLikelihood: { type: "INTEGER", description: "Likelihood percentage from 0 to 100 of the message getting ignored." },
            bossLikingLikelihood: { type: "INTEGER", description: "Likelihood percentage from 0 to 100 of the boss liking it." },
            hrCallChance: { type: "INTEGER", description: "Percentage chance from 0 to 100 that HR calls the sender." },
            buzzwordDensity: { type: "STRING", description: "Density level of corporate buzzwords (e.g., 'Low', 'Medium', 'High', 'Extremely High')." },
            emotionalDamage: { type: "STRING", description: "Humorous summary of emotional damage left or removed (e.g., 'Removed', 'None', 'Absorbed', 'Redirected')." }
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

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Analyze and translate the following workplace draft. Match your rewriting strictly to the current slider tuning inputs:

Draft Message:
"""
${message}
"""`
            }]
          }],
          systemInstruction: {
            parts: [{
              text: systemInstruction
            }]
          },
          generationConfig: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Translation failed with status ${response.status}`);
      }

      const resData = await response.json();
      const responseText = resData?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!responseText) {
        throw new Error("Empty response received from Gemini API.");
      }

      let cleanedText = responseText.trim();
      if (cleanedText.startsWith("```")) {
        cleanedText = cleanedText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
      }

      const data: TranslationResult = JSON.parse(cleanedText);
      setResult(data);

      // Save to history
      const historyItem: TranslationHistoryItem = {
        ...data,
        id: crypto.randomUUID(),
        original: message.trim(),
        parameters,
        context: context.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isStarred: false,
      };

      const updatedHistory = [historyItem, ...history];
      saveHistoryToStorage(updatedHistory);
      setActiveHistoryId(historyItem.id);
    } catch (err: any) {
      console.error("Translation error:", err);
      setError(err.message || "An unexpected error occurred. Please verify your network connection and API key.");
    } finally {
      setIsLoading(false);
    }
  };

  // Set preset
  const handleApplyPreset = (presetParams: typeof PRESETS[0]["params"]) => {
    setParameters({ ...presetParams });
  };

  // Load sample message
  const handleLoadSample = (sample: typeof SAMPLE_MESSAGES[0]) => {
    setMessage(sample.text);
    setContext(sample.context || "");
    if (sample.suggestedParameters) {
      setParameters({
        politeness: sample.suggestedParameters.politeness ?? 50,
        assertiveness: sample.suggestedParameters.assertiveness ?? 50,
        friendliness: sample.suggestedParameters.friendliness ?? 50,
        formality: sample.suggestedParameters.formality ?? 50,
        empathy: sample.suggestedParameters.empathy ?? 50,
        directness: sample.suggestedParameters.directness ?? 50,
        buzzwords: sample.suggestedParameters.buzzwords ?? 0,
        passiveAggressiveness: sample.suggestedParameters.passiveAggressiveness ?? 0,
        humour: sample.suggestedParameters.humour ?? 0,
      });
    }
    setError(null);
    setResult(null);
    setActiveHistoryId(null);
    setActiveTab("translate");
  };

  // Reset sliders to default values
  const handleResetSliders = () => {
    setParameters({
      politeness: 50,
      assertiveness: 50,
      friendliness: 50,
      formality: 50,
      empathy: 50,
      directness: 50,
      buzzwords: 0,
      passiveAggressiveness: 0,
      humour: 0,
    });
  };

  // Load old history item back to main view
  const handleLoadHistoryItem = (item: TranslationHistoryItem) => {
    setMessage(item.original);
    setContext(item.context);
    setParameters(item.parameters || {
      politeness: 50,
      assertiveness: 50,
      friendliness: 50,
      formality: 50,
      empathy: 50,
      directness: 50,
      buzzwords: 0,
      passiveAggressiveness: 0,
      humour: 0,
    });
    setResult({
      rewrittenMessage: item.rewrittenMessage,
      corporateAnalysis: item.corporateAnalysis,
      funnyCommentary: item.funnyCommentary,
      toxicityReport: item.toxicityReport,
      officeSurvivalRating: item.officeSurvivalRating,
    });
    setActiveHistoryId(item.id);
    setError(null);
    setActiveTab("translate");
  };

  // Toggle star
  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.map((item) => {
      if (item.id === id) {
        return { ...item, isStarred: !item.isStarred };
      }
      return item;
    });
    saveHistoryToStorage(updatedHistory);
  };

  // Delete history item
  const handleDeleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updatedHistory = history.filter((item) => item.id !== id);
    saveHistoryToStorage(updatedHistory);
    if (activeHistoryId === id) {
      setActiveHistoryId(null);
      setResult(null);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your translation history?")) {
      saveHistoryToStorage([]);
      setActiveHistoryId(null);
      setResult(null);
    }
  };

  // Copy to clipboard helpers
  const handleCopy = (text: string, type: "input" | "output" | "share") => {
    navigator.clipboard.writeText(text);
    if (type === "input") {
      setCopiedInput(true);
      setTimeout(() => setCopiedInput(false), 2000);
    } else if (type === "output") {
      setCopiedOutput(true);
      setTimeout(() => setCopiedOutput(false), 2000);
    } else if (type === "share") {
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  // Dynamic progress blocks generator
  const getCharBlocks = (percentage: number) => {
    const totalBlocks = 10;
    const activeBlocks = Math.round((percentage / 100) * totalBlocks);
    const inactiveBlocks = totalBlocks - activeBlocks;
    return `${"█".repeat(activeBlocks)}${"░".repeat(inactiveBlocks)}`;
  };

  // Dynamic Office Survival Rating generator with robust fallbacks for backward compatibility
  const getSurvivalRating = (res: any) => {
    if (res?.officeSurvivalRating) return res.officeSurvivalRating;
    
    // Calculate deterministic fallbacks based on existing report metrics
    const hrRisk = res?.corporateAnalysis?.hrRisk ?? 0;
    const argumentRisk = res?.toxicityReport?.argumentRisk ?? 0;
    const emotionScore = res?.toxicityReport?.emotionScore ?? 0;
    const professionalism = res?.toxicityReport?.professionalismScore ?? 100;
    
    const score = Math.max(10, Math.min(100, Math.round(100 - (hrRisk * 0.4 + argumentRisk * 0.3 + emotionScore * 0.3))));
    const ignoredLikelihood = Math.round((100 - professionalism) * 0.4 + (parameters?.directness ? (100 - parameters.directness) * 0.3 : 15));
    const bossLikingLikelihood = Math.round(professionalism * 0.7 + (parameters?.politeness ? parameters.politeness * 0.2 : 10));
    const hrCallChance = hrRisk;
    const buzzwordDensity = parameters?.buzzwords > 60 ? "High" : parameters?.buzzwords > 30 ? "Medium" : "Low";
    const emotionalDamage = emotionScore > 70 ? "Severe" : emotionScore > 40 ? "Moderate" : "Removed";
    
    return {
      score,
      ignoredLikelihood: Math.max(0, Math.min(100, ignoredLikelihood)),
      bossLikingLikelihood: Math.max(0, Math.min(100, bossLikingLikelihood)),
      hrCallChance: Math.max(0, Math.min(100, hrCallChance)),
      buzzwordDensity,
      emotionalDamage
    };
  };

  const charCount = message.length;
  const survival = result ? getSurvivalRating(result) : null;

  return (
    <div className="flex flex-col min-h-screen w-full bg-slate-50 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      
      {/* Header Panel */}
      <header id="app-header" className="h-16 bg-slate-900 flex items-center justify-between px-6 sm:px-8 shrink-0 shadow-lg z-10">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center shadow-md">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div className="text-left">
            <h1 className="text-white font-bold text-base sm:text-lg tracking-tight font-display">
              CORPORATE TRANSLATOR
            </h1>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest font-mono">
              Refinement Engine v3.0
            </p>
          </div>
        </div>

        {/* Top Tab Navigation & Settings */}
        <div className="flex items-center space-x-4">
          <nav className="flex space-x-4 sm:space-x-6 text-xs sm:text-sm font-medium text-slate-300">
            <button
              id="nav-btn-translate"
              onClick={() => setActiveTab("translate")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "translate"
                  ? "text-blue-400 border-b-2 border-blue-400 font-semibold"
                  : "hover:text-white"
              }`}
            >
              Translator
            </button>
            <button
              id="nav-btn-samples"
              onClick={() => setActiveTab("samples")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "samples"
                  ? "text-blue-400 border-b-2 border-blue-400 font-semibold"
                  : "hover:text-white"
              }`}
            >
              Draft Library
            </button>
            <button
              id="nav-btn-rules"
              onClick={() => setActiveTab("rules")}
              className={`pb-1 cursor-pointer transition-all ${
                activeTab === "rules"
                  ? "text-blue-400 border-b-2 border-blue-400 font-semibold"
                  : "hover:text-white"
              }`}
            >
              Conduct Rules
            </button>
          </nav>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer flex items-center justify-center"
            title="API Settings"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Container Frame */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 sm:p-8 gap-6 sm:gap-8 max-w-7xl w-full mx-auto">
        
        {/* Left Side: Translation Workspace */}
        <div className="flex-1 flex flex-col gap-6">
          
          <AnimatePresence mode="wait">
            {activeTab === "translate" && (
              <motion.div
                key="workspace-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="flex-1 flex flex-col gap-6"
              >
                {/* Text Boxes Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[340px]">
                  
                  {/* Left Box: Unfiltered Draft */}
                  <div id="card-raw-input" className="flex flex-col h-full text-left">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-orange-400 rounded-full mr-2 animate-pulse"></span>
                        Raw Draft Input
                      </label>
                      <span className="text-[11px] text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded">
                        CHAR: {charCount}
                      </span>
                    </div>

                    <div className="flex-1 min-h-[250px] bg-white border border-slate-200 rounded-xl shadow-xs p-5 flex flex-col justify-between focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type or paste your unfiltered raw message here (e.g., your raw frustrated thoughts, sarcastic remarks, or vague updates)..."
                        className="w-full flex-1 resize-none text-slate-800 placeholder-slate-400 focus:outline-none leading-relaxed text-sm"
                        disabled={isLoading}
                      />
                      
                      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-3">
                        <span className="text-[10px] text-slate-400 font-mono">
                          Secure end-to-end sandbox
                        </span>
                        {message && (
                          <div className="flex items-center space-x-1">
                            <button
                              id="btn-clear-message"
                              type="button"
                              onClick={() => setMessage("")}
                              className="px-2 py-1 text-[10px] font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                            >
                              Clear
                            </button>
                            <button
                              id="btn-copy-message"
                              type="button"
                              onClick={() => handleCopy(message, "input")}
                              className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer"
                              title="Copy Raw Draft"
                            >
                              {copiedInput ? (
                                <Check className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Box: Professional Output */}
                  <div id="card-professional-output" className="flex flex-col h-full text-left">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs sm:text-sm font-semibold text-slate-700 flex items-center">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
                        Professional Output
                      </label>
                      
                      {result && !isLoading && (
                        <div className="flex items-center space-x-2">
                          <button
                            id="btn-toggle-compare"
                            onClick={() => setIsCompareMode(!isCompareMode)}
                            className={`text-[10px] font-semibold px-2 py-0.5 rounded border transition-all cursor-pointer flex items-center space-x-1 ${
                              isCompareMode
                                ? "bg-blue-600 border-blue-600 text-white"
                                : "bg-white border-slate-200 text-slate-600 hover:border-slate-400"
                            }`}
                          >
                            <ArrowUpDown className="w-2.5 h-2.5" />
                            <span>{isCompareMode ? "Exit Compare" : "Compare View"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-h-[250px] bg-slate-900 border border-slate-800 rounded-xl shadow-inner p-5 flex flex-col justify-between text-left relative overflow-hidden">
                      <AnimatePresence mode="wait">
                        {isLoading ? (
                          /* Enterprise Loader */
                          <motion.div
                            key="loader-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 flex flex-col items-center justify-center py-12"
                          >
                            <div className="relative w-12 h-12 mb-4">
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-slate-700 border-t-blue-500"
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-blue-400 animate-pulse" />
                              </div>
                            </div>
                            <motion.p
                              key={loadingStage}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              className="text-xs text-slate-400 text-center max-w-xs leading-relaxed font-mono"
                            >
                              {LOADING_MESSAGES[loadingStage]}
                            </motion.p>
                          </motion.div>
                        ) : result ? (
                          /* Output Content */
                          <motion.div
                            key="result-view"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col justify-between h-full"
                          >
                            <div className="overflow-y-auto max-h-[260px] pr-1">
                              {isCompareMode && (
                                <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-900/40 text-xs text-red-200">
                                  <span className="font-bold uppercase tracking-wider block mb-1 text-[9px] text-red-400">
                                    Original Draft
                                  </span>
                                  <p className="italic">"{message}"</p>
                                </div>
                              )}

                              <div className="text-blue-100 text-sm sm:text-base leading-relaxed font-medium whitespace-pre-wrap">
                                {result.rewrittenMessage}
                              </div>
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-800 pt-3 mt-3">
                              <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                                <span className="bg-slate-800 px-2.5 py-0.5 rounded text-blue-300 border border-slate-700 uppercase font-mono tracking-wider">
                                  {result.corporateAnalysis?.toneDetected || "Camouflaged"}
                                </span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <button
                                  id="btn-share-log"
                                  onClick={() => handleCopy(`[Original Draft]\n${message}\n\n[Corporate Camouflage Output]\n${result.rewrittenMessage}`, "share")}
                                  className="p-1.5 rounded bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all cursor-pointer"
                                  title="Copy Camouflage Log"
                                >
                                  {copiedShare ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                                  ) : (
                                    <Share2 className="w-3.5 h-3.5" />
                                  )}
                                </button>
                                
                                <button
                                  id="btn-copy-output"
                                  onClick={() => handleCopy(result.rewrittenMessage, "output")}
                                  className="px-3 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center space-x-1 cursor-pointer transition-all"
                                >
                                  {copiedOutput ? (
                                    <>
                                      <Check className="w-3 h-3 text-white" />
                                      <span>Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>Copy Camouflage</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ) : (
                          /* Idle Placeholder */
                          <motion.div
                            key="idle-placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex-1 flex flex-col items-center justify-center text-center py-10"
                          >
                            <div className="w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center mb-3 border border-slate-700">
                              <Sparkles className="w-5 h-5 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-300">
                              Awaiting Refinement Draft
                            </h3>
                            <p className="text-xs text-slate-500 mt-1.5 max-w-[280px] leading-relaxed">
                              Input raw thoughts on the left, fine-tune the parameters below, and trigger <strong className="text-slate-400">REWRITE MESSAGE</strong>.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                </div>

                {/* Continuous Tuning Sliders Panel */}
                <div id="tuning-sliders-panel" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left">
                  
                  {/* Slider Header + Reset */}
                  <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                    <div className="flex items-center space-x-2">
                      <Sliders className="w-4.5 h-4.5 text-blue-600" />
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                        Continuous Style Refinement
                      </h3>
                    </div>
                    <button
                      id="btn-reset-sliders"
                      onClick={handleResetSliders}
                      className="text-[10px] font-bold text-slate-400 hover:text-blue-600 flex items-center space-x-1 cursor-pointer transition-colors"
                      title="Reset parameters to neutral balance"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Reset Sliders</span>
                    </button>
                  </div>

                  {/* Presets Quickbar */}
                  <div className="mb-4">
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-2">
                      Quick Snapping Presets
                    </span>
                    <div className="flex gap-2 flex-wrap">
                      {PRESETS.map((p) => (
                        <button
                          key={p.id}
                          id={`preset-btn-${p.id}`}
                          onClick={() => handleApplyPreset(p.params)}
                          className="px-3 py-1 bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 rounded-full text-xs font-semibold text-slate-700 transition-all cursor-pointer flex flex-col items-start"
                        >
                          <span className="text-slate-800">{p.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sliders Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {PARAMETER_CONFIG.map((param) => {
                      const val = parameters[param.key];
                      return (
                        <div key={param.key} className="p-3 border border-slate-100 rounded-lg hover:border-slate-200 hover:shadow-xs transition-all bg-slate-50/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-slate-700">
                              {param.label}
                            </span>
                            <span className={`text-xs font-mono font-bold ${param.textClass} bg-white px-1.5 py-0.5 rounded shadow-2xs border ${param.borderColor}`}>
                              {val}%
                            </span>
                          </div>
                          
                          <input
                            id={`slider-range-${param.key}`}
                            type="range"
                            min="0"
                            max="100"
                            value={val}
                            onChange={(e) => {
                              const v = parseInt(e.target.value);
                              setParameters(prev => ({ ...prev, [param.key]: v }));
                            }}
                            className={`w-full h-1.5 rounded-lg cursor-pointer appearance-none bg-slate-200 ${param.color}`}
                            disabled={isLoading}
                          />

                          <div className="flex justify-between text-[9px] text-slate-400 font-medium mt-1 font-mono">
                            <span>{param.minLabel}</span>
                            <span>{param.maxLabel}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                </div>

                {/* Live Corporate Analysis Reports Card */}
                {result && !isLoading && survival && (
                  <motion.div
                    id="analysis-reports-section"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Left: 🔥 Corporate Toxicity Report */}
                    <div id="report-toxicity" className="bg-slate-950 text-white border border-slate-800 rounded-xl p-5 shadow-xl text-left relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
                      
                      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
                        <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-orange-400 font-mono">
                          🔥 Corporate Toxicity Report
                        </h4>
                      </div>

                      <div className="space-y-4">
                        {/* Emotion */}
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                            <span>Emotion</span>
                            <span className="font-mono text-slate-200">{result.toxicityReport?.emotionScore ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-orange-500 tracking-tight">
                            {getCharBlocks(result.toxicityReport?.emotionScore ?? 0)}
                          </div>
                        </div>

                        {/* Professionalism */}
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                            <span>Professionalism</span>
                            <span className="font-mono text-slate-200">{result.toxicityReport?.professionalismScore ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-emerald-400 tracking-tight">
                            {getCharBlocks(result.toxicityReport?.professionalismScore ?? 0)}
                          </div>
                        </div>

                        {/* Risk of Starting an Argument */}
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                            <span>Risk of Starting an Argument</span>
                            <span className="font-mono text-slate-200">{result.toxicityReport?.argumentRisk ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-rose-500 tracking-tight">
                            {getCharBlocks(result.toxicityReport?.argumentRisk ?? 0)}
                          </div>
                        </div>

                        {/* Likelihood of Being Forwarded to HR */}
                        <div>
                          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
                            <span>Likelihood of Being Forwarded to HR</span>
                            <span className="font-mono text-slate-200">{result.toxicityReport?.hrForwardLikelihood ?? 0}%</span>
                          </div>
                          <div className="flex items-center gap-1 font-mono text-xs text-purple-400 tracking-tight">
                            {getCharBlocks(result.toxicityReport?.hrForwardLikelihood ?? 0)}
                          </div>
                        </div>

                        {/* Slack Reactions */}
                        <div className="border-t border-slate-800 pt-3 mt-4">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                            Estimated Slack Reactions
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {result.toxicityReport?.slackReactions?.map((react, i) => (
                              <span key={i} className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-300 flex items-center space-x-1.5 shadow-sm hover:border-slate-700 transition-all">
                                <span>{react.emoji}</span>
                                <span className="font-mono font-bold text-slate-200">{react.count}</span>
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Recommendations */}
                        <div className="border-t border-slate-800 pt-3 mt-3">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 font-mono">
                            Recommendations
                          </div>
                          <ul className="text-xs space-y-1.5 text-slate-300 list-disc list-inside">
                            {result.toxicityReport?.recommendations?.map((rec, i) => (
                              <li key={i} className="leading-relaxed font-sans">
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>

                      </div>
                    </div>

                    {/* Right: Corporate Analysis & Funny Commentary */}
                    <div id="report-analysis" className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm text-left flex flex-col justify-between">
                      <div>
                        <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 mb-4">
                          <div className="w-6 h-6 rounded bg-indigo-50 flex items-center justify-center">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 font-display">
                            Corporate Analysis
                          </h4>
                        </div>

                        <div className="space-y-3.5 text-xs text-slate-600 font-sans">
                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Tone Detected</span>
                            <span className="font-semibold text-slate-900 capitalize">
                              {result.corporateAnalysis?.toneDetected || "Unknown"}
                            </span>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Emotional Intensity</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-red-400 rounded-full" style={{ width: `${result.corporateAnalysis?.emotionalIntensity ?? 0}%` }} />
                              </div>
                              <span className="font-mono text-slate-900 font-semibold">{result.corporateAnalysis?.emotionalIntensity ?? 0}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Confidence</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${result.corporateAnalysis?.confidence ?? 0}%` }} />
                              </div>
                              <span className="font-mono text-slate-900 font-semibold">{result.corporateAnalysis?.confidence ?? 0}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Risk of Misunderstanding</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-400 rounded-full" style={{ width: `${result.corporateAnalysis?.riskOfMisunderstanding ?? 0}%` }} />
                              </div>
                              <span className="font-mono text-slate-900 font-semibold">{result.corporateAnalysis?.riskOfMisunderstanding ?? 0}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">HR Risk</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${result.corporateAnalysis?.hrRisk ?? 0}%` }} />
                              </div>
                              <span className="font-mono text-slate-900 font-semibold">{result.corporateAnalysis?.hrRisk ?? 0}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Passive Aggressive Score</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${result.corporateAnalysis?.passiveAggressiveScore ?? 0}%` }} />
                              </div>
                              <span className="font-mono text-slate-900 font-semibold">{result.corporateAnalysis?.passiveAggressiveScore ?? 0}%</span>
                            </div>
                          </div>

                          <div className="flex justify-between py-1.5 border-b border-slate-50">
                            <span className="font-medium text-slate-500">Readability</span>
                            <span className="font-semibold text-slate-900">{result.corporateAnalysis?.readability || "Professional"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Funny Commentary Highlight */}
                      <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-3 mt-4 flex items-start space-x-2.5">
                        <Smile className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <div className="text-left">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block font-mono">
                            Funny Commentary
                          </span>
                          <p className="text-xs text-blue-950 font-medium leading-relaxed italic mt-0.5">
                            "{result.funnyCommentary}"
                          </p>
                        </div>
                      </div>

                    </div>

                    {/* Right: Office Survival Rating Card */}
                    <div id="report-survival-rating" className="bg-emerald-950 text-emerald-50 border border-emerald-900 rounded-xl p-5 shadow-xl text-left relative overflow-hidden flex flex-col justify-between">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />
                      
                      <div>
                        <div className="flex items-center space-x-2 border-b border-emerald-900/60 pb-3 mb-4">
                          <ShieldAlert className="w-5 h-5 text-emerald-400" />
                          <h4 className="text-xs font-extrabold uppercase tracking-widest text-emerald-400 font-mono">
                            🛡️ Office Survival Rating
                          </h4>
                        </div>

                        {/* Large Score with progress blocks */}
                        <div className="bg-emerald-950/80 rounded-lg p-4 border border-emerald-900/60 mb-5">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-1.5 font-mono">
                            Survival Safety Index
                          </div>
                          <div className="flex items-baseline space-x-2">
                            <span className="text-3xl font-extrabold text-white font-display tracking-tight">
                              {survival.score}%
                            </span>
                            <span className="text-xs text-emerald-400 font-mono">
                              {survival.score >= 80 ? "S-TIER SURVIVAL" : survival.score >= 60 ? "STABLE PROGNOSIS" : "HIGH ALERT"}
                            </span>
                          </div>
                          
                          {/* Animated / styled ASCII-like block progress bar */}
                          <div className="font-mono text-xs text-emerald-400 tracking-wider mt-2.5 bg-emerald-950 p-2.5 rounded border border-emerald-900/30 flex items-center justify-between">
                            <span>{getCharBlocks(survival.score)}</span>
                            <span className="font-bold text-white ml-2">{survival.score}%</span>
                          </div>
                        </div>

                        {/* Interactive Survival Indicators */}
                        <div className="space-y-3.5 font-sans">
                          {/* Indicator 1: Likelihood of getting ignored */}
                          <div className="flex flex-col">
                            <div className="flex justify-between text-xs font-semibold text-emerald-300 mb-1">
                              <span>Likelihood of getting ignored</span>
                              <span className="font-mono text-white">{survival.ignoredLikelihood}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-emerald-900/40 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${survival.ignoredLikelihood}%` }} />
                            </div>
                          </div>

                          {/* Indicator 2: Likelihood your boss likes it */}
                          <div className="flex flex-col">
                            <div className="flex justify-between text-xs font-semibold text-emerald-300 mb-1">
                              <span>Likelihood your boss likes it</span>
                              <span className="font-mono text-white">{survival.bossLikingLikelihood}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-emerald-900/40 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${survival.bossLikingLikelihood}%` }} />
                            </div>
                          </div>

                          {/* Indicator 3: Chance HR calls you */}
                          <div className="flex flex-col">
                            <div className="flex justify-between text-xs font-semibold text-emerald-300 mb-1">
                              <span>Chance HR calls you</span>
                              <span className="font-mono text-white">{survival.hrCallChance}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-emerald-900/40 rounded-full overflow-hidden">
                              <div className="h-full bg-rose-500 rounded-full" style={{ width: `${survival.hrCallChance}%` }} />
                            </div>
                          </div>

                          {/* Indicator 4: Buzzword Density */}
                          <div className="flex justify-between items-center py-2 border-t border-emerald-900/40 text-xs text-emerald-200 mt-2">
                            <span className="font-medium">Corporate Buzzword Density</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                              survival.buzzwordDensity.toLowerCase().includes("high") 
                                ? "bg-red-900/60 text-red-200 border border-red-800" 
                                : survival.buzzwordDensity.toLowerCase().includes("medium")
                                  ? "bg-amber-900/60 text-amber-200 border border-amber-800"
                                  : "bg-blue-900/60 text-blue-200 border border-blue-800"
                            }`}>
                              {survival.buzzwordDensity}
                            </span>
                          </div>

                          {/* Indicator 5: Emotional Damage */}
                          <div className="flex justify-between items-center py-2 border-t border-emerald-900/40 text-xs text-emerald-200">
                            <span className="font-medium">Emotional Damage</span>
                            <span className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-mono font-bold ${
                              survival.emotionalDamage.toLowerCase() === "removed" || survival.emotionalDamage.toLowerCase() === "none"
                                ? "bg-emerald-900/60 text-emerald-200 border border-emerald-800"
                                : "bg-red-900/60 text-red-200 border border-red-800"
                            }`}>
                              {survival.emotionalDamage}
                            </span>
                          </div>

                        </div>
                      </div>

                      {/* Tasteful Disclaimer */}
                      <div className="text-[9px] text-emerald-500 font-mono text-center border-t border-emerald-900/40 pt-3 mt-4">
                        Survival probability calculated using AI sentiment containment protocols.
                      </div>
                    </div>

                  </motion.div>
                )}

                {/* Workspace Context and Polish button bar */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row items-center p-5 sm:px-8 justify-between shrink-0 gap-4">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 w-full sm:w-auto text-left">
                    
                    {/* Audience Context Input */}
                    <div className="flex flex-col flex-1 sm:w-80">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1.5">
                        Audience Context / Recipient Constraints (Optional)
                      </span>
                      <input
                        id="input-audience-context"
                        type="text"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder="e.g., Sent to cross-team director, de-escalate frustration"
                        className="text-xs text-slate-700 bg-transparent border-b border-slate-100 pb-1 focus:outline-none focus:border-slate-400 placeholder-slate-400"
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {/* Primary Trigger button */}
                  <button
                    id="btn-trigger-rewrite"
                    onClick={() => handleTranslate()}
                    disabled={isLoading || !message.trim()}
                    className={`w-full sm:w-auto px-8 py-3 font-bold rounded-lg transition-all flex items-center justify-center cursor-pointer ${
                      isLoading || !message.trim()
                        ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 active:scale-95 text-sm"
                    }`}
                  >
                    <svg className="w-4 h-4 mr-2 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                    <span>{isLoading ? "REFRAMING DRAFT..." : "REWRITE MESSAGE"}</span>
                  </button>
                </div>

                {/* Error Banner */}
                {error && (
                  <div id="error-message-banner" className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 flex items-start space-x-2 text-xs text-left">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold block">Linguistic Refinement Warning</span>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Templates/Draft Library Tab */}
            {activeTab === "samples" && (
              <motion.div
                key="templates-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-left"
              >
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                    <Compass className="w-5 h-5 text-blue-600" />
                    <span>Linguistic Drafting Samples</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select a realistic raw communication template to automatically set both the workspace input and continuous parameters to suitable targets.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SAMPLE_MESSAGES.map((sample) => {
                    const categoryColors = {
                      "Emotional": "bg-red-50 text-red-700 border-red-100",
                      "Slang / Casual": "bg-amber-50 text-amber-800 border-amber-100",
                      "Vague / Confusing": "bg-blue-50 text-blue-700 border-blue-100",
                      "Direct / Blunt": "bg-purple-50 text-purple-700 border-purple-100"
                    };

                    return (
                      <div
                        key={sample.id}
                        id={`sample-card-${sample.id}`}
                        onClick={() => handleLoadSample(sample)}
                        className="group border border-slate-200 hover:border-blue-500 hover:shadow-md rounded-xl p-4 cursor-pointer transition-all bg-slate-50/50 hover:bg-white flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                              {sample.label}
                            </span>
                            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${categoryColors[sample.category]}`}>
                              {sample.category}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-3 italic font-sans leading-relaxed">
                            "{sample.text}"
                          </p>
                        </div>
                        <div className="border-t border-slate-100 pt-3 mt-3 flex items-center justify-between text-[10px] text-slate-500">
                          <span>{sample.context}</span>
                          <span className="font-semibold text-blue-600 group-hover:underline flex items-center space-x-1">
                            <span>Insert Draft</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Compliance Conduct Rules Tab */}
            {activeTab === "rules" && (
              <motion.div
                key="rules-panel"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs text-left"
              >
                <div className="mb-6 border-b border-slate-100 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 font-display flex items-center space-x-2">
                    <BookOpen className="w-5 h-5 text-blue-600" />
                    <span>Linguistic Security & Conduct Rules</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Every message processed adheres to standard workplace compliance principles.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 font-display flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                      <span>Intent and Factual Integrity</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Linguistic adjustments strictly preserve business constraints, instructions, and objectives. Under no condition are unverified details added or critical deadlines deleted.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 font-display flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      <span>Continuous Tone Decoupling</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      By mapping communication attributes onto continuous parameter sliders, users decouple emotional triggers (frustration, anxiety, irritation) from the final logical request.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 font-display flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                      <span>Dynamic Campaign Protection</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Instead of refusing inputs containing high hostility, the engine strips malicious frameworks and focuses on translating raw core priorities into standard constructive suggestions.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/60">
                    <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 font-display flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                      <span>Enterprise Jargon & Buzzwords</span>
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Customizable corporate jargon is structured specifically to translate plain, everyday directives into standardized enterprise language suitable for multi-user alignment.
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 mt-6 font-sans">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 font-display">
                    Linguistic Continuous Calibration Metrics
                  </h4>
                  <div className="space-y-3.5 text-xs text-slate-600 leading-relaxed">
                    <p>
                      <strong>Politeness (0 - 100):</strong> Balances raw frankness against diplomatic, socially secure pleasantries. High levels incorporate supportive greetings.
                    </p>
                    <p>
                      <strong>Assertiveness (0 - 100):</strong> Calibrates from hesitant, indirect phrasing up to clear, commanding statements that prioritize responsibility and outcomes.
                    </p>
                    <p>
                      <strong>Friendliness (0 - 100):</strong> Softens formal professional boundaries to introduce warmth, cooperativeness, and positive reinforcement suitable for direct teammates.
                    </p>
                    <p>
                      <strong>Formality (0 - 100):</strong> Shifts style patterns from basic colloquial conversations to executive-level summaries appropriate for steering committees.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Historical Camouflage Archive Log */}
          <div id="camouflage-archive-card" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs text-left">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">
                  Corporate Camouflage Log
                </span>
                {history.length > 0 && (
                  <span className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 rounded-full font-bold font-mono">
                    {history.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center space-x-3 text-xs">
                {history.length > 0 && (
                  <>
                    <button
                      id="btn-filter-starred"
                      onClick={() => setFilterStarred(!filterStarred)}
                      className={`flex items-center space-x-1 px-2 py-1 rounded transition-colors cursor-pointer text-xs ${
                        filterStarred 
                          ? "bg-amber-50 text-amber-700 font-semibold"
                          : "text-slate-500 hover:text-slate-900"
                      }`}
                    >
                      <Star className={`w-3.5 h-3.5 ${filterStarred ? "fill-amber-400 text-amber-500" : ""}`} />
                      <span>Starred Only</span>
                    </button>
                    <button
                      id="btn-purge-archive"
                      onClick={handleClearHistory}
                      className="text-slate-400 hover:text-red-600 transition-colors cursor-pointer text-xs"
                    >
                      Purge Archive
                    </button>
                  </>
                )}
              </div>
            </div>

            {history.length === 0 ? (
              <div className="text-center py-6 text-xs text-slate-400">
                Log archive is empty. Successful camouflage processes persist securely in local storage.
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
                {history
                  .filter((item) => !filterStarred || item.isStarred)
                  .map((item) => (
                    <div
                      key={item.id}
                      id={`archive-item-${item.id}`}
                      onClick={() => handleLoadHistoryItem(item)}
                      className={`p-3 rounded-lg border text-xs transition-all cursor-pointer flex justify-between items-start gap-3 ${
                        activeHistoryId === item.id
                          ? "border-blue-600 bg-blue-50/50 text-slate-800"
                          : "border-slate-100 bg-slate-50/40 hover:bg-slate-50 text-slate-600"
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1 text-[10px]">
                          <span className="font-semibold capitalize px-1.5 py-0.2 rounded bg-white text-slate-500 border border-slate-200">
                            {item.corporateAnalysis?.toneDetected || "Camouflaged"}
                          </span>
                          <span className="text-slate-400">
                            {item.timestamp}
                          </span>
                          {item.context && (
                            <span className="truncate max-w-[150px] text-slate-400 font-medium">
                              • {item.context}
                            </span>
                          )}
                        </div>
                        <p className="truncate italic text-slate-500 mb-0.5">
                          "{item.original}"
                        </p>
                        <p className="line-clamp-1 font-semibold text-slate-800">
                          {item.rewrittenMessage}
                        </p>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 mt-1">
                        <button
                          id={`archive-btn-star-${item.id}`}
                          onClick={(e) => handleToggleStar(item.id, e)}
                          className="p-1 rounded hover:bg-white text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                        >
                          <Star className={`w-3.5 h-3.5 ${item.isStarred ? "fill-amber-400 text-amber-500" : ""}`} />
                        </button>
                        <button
                          id={`archive-btn-delete-${item.id}`}
                          onClick={(e) => handleDeleteHistoryItem(item.id, e)}
                          className="p-1 rounded hover:bg-white text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                {history.filter((item) => !filterStarred || item.isStarred).length === 0 && (
                  <div className="text-center py-4 text-xs text-slate-400">
                    No starred archive logs located.
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Side: Strategy and Compliance Guides */}
        <aside className="w-full lg:w-72 flex flex-col gap-4 shrink-0 text-left">
          
          {/* Strategy Guide */}
          <div id="card-strategy-guide" className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 font-display flex items-center justify-between">
              <span>Enterprise Advice</span>
              <FileCheck className="w-3.5 h-3.5 text-slate-400" />
            </h3>
            
            <ul className="space-y-4 font-sans text-xs">
              {result && !isLoading && result.toxicityReport?.recommendations && result.toxicityReport.recommendations.length > 0 ? (
                result.toxicityReport.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex gap-3 items-start">
                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 text-[10px] font-bold border border-blue-100 font-mono">
                      0{idx + 1}
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                        Camouflage Advice
                      </span>
                      <p className="text-slate-700 leading-normal font-medium">
                        {rec}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 border border-blue-100 font-mono text-[10px] font-bold">
                      01
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                        Emotion Neutralizer
                      </span>
                      <p className="text-slate-600 leading-normal">
                        Neutralizes passive sarcasm to maintain absolute focus on shared goals.
                      </p>
                    </div>
                  </li>
                  <li className="flex gap-3">
                    <div className="w-6 h-6 bg-blue-50 text-blue-600 rounded flex items-center justify-center shrink-0 border border-blue-100 font-mono text-[10px] font-bold">
                      02
                    </div>
                    <div className="flex-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block mb-0.5">
                        Dependency Shielding
                      </span>
                      <p className="text-slate-600 leading-normal">
                        Highlights cross-department dependencies respectfully to reduce client-side resistance.
                      </p>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Humorous Pro Tip Box */}
          <div id="card-pro-tip" className="bg-slate-900 rounded-xl p-5 shadow-xs text-white relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full pointer-events-none animate-pulse" />
            <div className="relative z-10">
              <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest block mb-1 font-mono">
                Corporate Pro Tip
              </span>
              <p className="text-xs text-slate-300 italic leading-relaxed font-medium">
                {result && !isLoading && result.funnyCommentary ? (
                  `"${result.funnyCommentary}"`
                ) : (
                  `"Never click send while your hand is still shaking. Refine the draft continuously until HR can no longer detect your true intentions."`
                )}
              </p>
            </div>
          </div>

          {/* Secure Environment Banner */}
          <div id="card-compliance-badge" className="border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-6 text-center bg-white/50">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mb-2.5 border border-slate-200">
              <Lock className="w-5 h-5 text-slate-400 animate-pulse" />
            </div>
            <p className="text-xs font-bold text-slate-700 font-display">Compliance Safeguards Active</p>
            <p className="text-[10px] text-slate-400 mt-1 max-w-[180px] leading-relaxed">
              Linguistic translations are executed in isolated memory and are fully SOC2 compliant.
            </p>
          </div>

        </aside>

      </main>

      {/* Footer Details */}
      <footer id="app-footer" className="h-auto sm:h-10 py-3 sm:py-0 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between px-6 sm:px-8 text-[10px] text-slate-400 uppercase tracking-widest shrink-0 gap-2 font-mono">
        <div className="flex space-x-6">
          <span>Compliance Level: SOC2 Certified</span>
          <span className="hidden xs:inline">•</span>
          <span>Data Isolation: Encrypted</span>
        </div>
        <div className="flex space-x-6">
          <span>Calibration Code: V3-COMPLIANT</span>
          <span className="hidden xs:inline">•</span>
          <span>SLA Status: 99.9% Online</span>
        </div>
      </footer>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-500" />
                API Configuration
              </h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <p className="text-sm text-slate-600 mb-6">
              To use the Corporate Translator in static preview mode, configure your <strong>Gemini API Key</strong>. The key is saved locally in your browser.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleSaveApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm animate-none"
                />
              </div>
              
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] text-slate-500 block leading-normal">
                  Don't have an API Key? Get one for free from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline inline-flex items-center gap-0.5">Google AI Studio <ArrowRight className="w-3 h-3" /></a>
                </span>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition cursor-pointer"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
