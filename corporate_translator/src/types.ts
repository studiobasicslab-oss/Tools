export interface TranslationParameters {
  politeness: number; // 0 = brutally blunt, 100 = extremely courteous
  assertiveness: number; // 0 = hesitant, 100 = commanding
  friendliness: number; // 0 = cold, 100 = warm
  formality: number; // 0 = casual chat, 100 = executive email
  empathy: number; // 0 = emotionally neutral, 100 = highly understanding
  directness: number; // 0 = indirect, 100 = gets straight to the point
  buzzwords: number; // 0 = plain English, 100 = enterprise jargon
  passiveAggressiveness: number; // 0 = none, 100 = professionally sarcastic while remaining workplace appropriate
  humour: number; // 0 = serious, 100 = light-hearted but professional
}

export interface CorporateAnalysis {
  toneDetected: string;
  emotionalIntensity: number; // 0-100%
  confidence: number; // 0-100%
  riskOfMisunderstanding: number; // 0-100%
  hrRisk: number; // 0-100%
  passiveAggressiveScore: number; // 0-100%
  readability: string; // e.g., "Grade 8", "High"
}

export interface ToxicityReport {
  emotionScore: number; // 0-100
  professionalismScore: number; // 0-100
  argumentRisk: number; // 0-100
  hrForwardLikelihood: number; // 0-100
  slackReactions: { emoji: string; count: number }[];
  recommendations: string[];
}

export interface TranslationResult {
  rewrittenMessage: string;
  corporateAnalysis: CorporateAnalysis;
  funnyCommentary: string;
  toxicityReport: ToxicityReport;
  officeSurvivalRating?: OfficeSurvivalRating;
}

export interface OfficeSurvivalRating {
  score: number; // 0-100%
  ignoredLikelihood: number; // 0-100%
  bossLikingLikelihood: number; // 0-100%
  hrCallChance: number; // 0-100%
  buzzwordDensity: string; // e.g. "Low", "Medium", "High"
  emotionalDamage: string; // e.g. "Removed", "Deflected", "Severe"
}

export interface TranslationHistoryItem extends TranslationResult {
  id: string;
  original: string;
  parameters: TranslationParameters;
  context: string;
  timestamp: string;
  isStarred?: boolean;
}

export interface SampleMessage {
  id: string;
  label: string;
  category: "Emotional" | "Slang / Casual" | "Vague / Confusing" | "Direct / Blunt";
  text: string;
  context?: string;
  suggestedParameters?: Partial<TranslationParameters>;
}
