import { SampleMessage } from "./types";

export const SAMPLE_MESSAGES: SampleMessage[] = [
  {
    id: "frustrated-deadline",
    label: "Frustrated about delay",
    category: "Emotional",
    text: "I literally asked for this spreadsheet three times already. I'm blocked from doing my actual job because your team is taking forever. When is it actually going to be ready? I need a straight answer.",
    context: "Sent to a cross-functional partner in Slack",
    suggestedParameters: {
      politeness: 85,
      assertiveness: 75,
      friendliness: 40,
      formality: 80,
      empathy: 45,
      directness: 90,
      buzzwords: 50,
      passiveAggressiveness: 0,
      humour: 10
    }
  },
  {
    id: "blunt-feedback",
    label: "Blunt feedback",
    category: "Direct / Blunt",
    text: "This deck looks terrible and the data doesn't make sense. Redo slides 4 to 8 before we show this to the client. The current layout is a total mess.",
    context: "Commented on a teammate's slide deck draft",
    suggestedParameters: {
      politeness: 75,
      assertiveness: 65,
      friendliness: 60,
      formality: 70,
      empathy: 80,
      directness: 85,
      buzzwords: 30,
      passiveAggressiveness: 0,
      humour: 20
    }
  },
  {
    id: "vague-meeting",
    label: "Vague meeting request",
    category: "Vague / Confusing",
    text: "Hey, we need to talk about stuff tomorrow. Let's meet whenever.",
    context: "Email to a manager",
    suggestedParameters: {
      politeness: 90,
      assertiveness: 55,
      friendliness: 70,
      formality: 85,
      empathy: 50,
      directness: 95,
      buzzwords: 40,
      passiveAggressiveness: 0,
      humour: 0
    }
  },
  {
    id: "slang-update",
    label: "Casual / Slang update",
    category: "Slang / Casual",
    text: "Hey fam, the server totally crashed last night but we clutched up and got it fixed. Ngl it was super sketch for a minute. Everything is chill now though.",
    context: "Slack channel status report",
    suggestedParameters: {
      politeness: 80,
      assertiveness: 70,
      friendliness: 85,
      formality: 65,
      empathy: 60,
      directness: 90,
      buzzwords: 60,
      passiveAggressiveness: 0,
      humour: 50
    }
  },
  {
    id: "passive-aggressive",
    label: "Passive-aggressive pushback",
    category: "Emotional",
    text: "Per my previous email, I already explained this. If anyone had actually read it, we wouldn't be having this meeting right now. Let me know if I need to draw it out.",
    context: "In a group project thread",
    suggestedParameters: {
      politeness: 80,
      assertiveness: 80,
      friendliness: 30,
      formality: 85,
      empathy: 40,
      directness: 75,
      buzzwords: 70,
      passiveAggressiveness: 20,
      humour: 15
    }
  },
  {
    id: "bossy-assignment",
    label: "Bossy delegation",
    category: "Direct / Blunt",
    text: "Drop whatever you are doing and look at this issue right now. It's on you to fix it and I don't want to hear excuses about you being busy.",
    context: "Message from a team lead to a direct report",
    suggestedParameters: {
      politeness: 85,
      assertiveness: 85,
      friendliness: 70,
      formality: 75,
      empathy: 90,
      directness: 80,
      buzzwords: 45,
      passiveAggressiveness: 0,
      humour: 10
    }
  }
];
