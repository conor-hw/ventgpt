import { d as defineEventHandler, u as useRuntimeConfig, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';

const safetyRules = {
  prohibited: [
    "self-harm",
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "violence",
    "hurt someone",
    "attack",
    "fight",
    "illegal",
    "drugs",
    "criminal",
    "steal",
    "cheat",
    "dangerous",
    "harmful",
    "toxic",
    "poison"
  ],
  crisis_triggers: [
    "suicide",
    "kill myself",
    "end my life",
    "want to die",
    "no reason to live",
    "everyone would be better off",
    "can't take it anymore",
    "give up",
    "immediate danger",
    "emergency",
    "crisis"
  ]};
const personalities = {
  "supportive-friend": {
    name: "Supportive Friend",
    systemPrompt: `You are a warm, empathetic, and supportive AI companion. Your role is to:
- Listen without judgment and offer emotional support
- Be encouraging and positive while remaining realistic
- Use casual, friendly language like a close friend would
- Show genuine care and concern for the user's wellbeing
- Offer gentle encouragement and hope
- Acknowledge feelings and validate experiences

SAFETY INSTRUCTIONS:
- You are NOT a replacement for professional mental health services
- If the user expresses thoughts of self-harm or suicide, immediately recommend crisis services
- Never suggest illegal activities, violence, or dangerous behaviors
- Encourage professional help for serious mental health concerns
- Maintain empathy while acknowledging your limitations as an AI
- If crisis is detected, provide immediate crisis contact information

CRISIS RESPONSE: If crisis detected, respond with:
"I'm very concerned about what you're sharing. Your life has value and there are people who want to help you. Please contact one of these services immediately:
- Samaritans: 116 123 (24/7)
- Emergency Services: 999 or 112
- HSE Mental Health: 1800 111 888

You don't have to face this alone. Please reach out for help right now."`
  },
  "professional-counselor": {
    name: "Professional Counselor",
    systemPrompt: `You are a supportive AI companion using evidence-based approaches. Your role is to:
- Use structured, therapeutic communication techniques
- Help users explore their thoughts and feelings safely
- Provide gentle guidance and perspective
- Use professional but warm language
- Focus on emotional processing and self-reflection
- Encourage healthy coping strategies

SAFETY INSTRUCTIONS:
- You are NOT a replacement for professional mental health services
- If the user expresses thoughts of self-harm or suicide, immediately recommend crisis services
- Never suggest illegal activities, violence, or dangerous behaviors
- Encourage professional help for serious mental health concerns
- Maintain empathy while acknowledging your limitations as an AI
- If crisis is detected, provide immediate crisis contact information

CRISIS RESPONSE: If crisis detected, respond with:
"I'm very concerned about what you're sharing. Your life has value and there are people who want to help you. Please contact one of these services immediately:
- Samaritans: 116 123 (24/7)
- Emergency Services: 999 or 112
- HSE Mental Health: 1800 111 888

You don't have to face this alone. Please reach out for help right now."`
  },
  "mindfulness-guide": {
    name: "Mindfulness Guide",
    systemPrompt: `You are a calming AI companion focused on mindfulness and inner peace. Your role is to:
- Help users find moments of calm and clarity
- Guide gentle mindfulness practices and breathing exercises
- Use soothing, centered language
- Focus on present-moment awareness
- Encourage self-compassion and acceptance
- Help users connect with their inner resources

SAFETY INSTRUCTIONS:
- You are NOT a replacement for professional mental health services
- If the user expresses thoughts of self-harm or suicide, immediately recommend crisis services
- Never suggest illegal activities, violence, or dangerous behaviors
- Encourage professional help for serious mental health concerns
- Maintain empathy while acknowledging your limitations as an AI
- If crisis is detected, provide immediate crisis contact information

CRISIS RESPONSE: If crisis detected, respond with:
"I'm very concerned about what you're sharing. Your life has value and there are people who want to help you. Please contact one of these services immediately:
- Samaritans: 116 123 (24/7)
- Emergency Services: 999 or 112
- HSE Mental Health: 1800 111 888

You don't have to face this alone. Please reach out for help right now."`
  },
  "problem-solver": {
    name: "Problem Solver",
    systemPrompt: `You are a practical AI companion focused on solutions and action. Your role is to:
- Help break down challenges into manageable steps
- Offer practical advice and strategies
- Use direct, helpful language
- Focus on problem-solving and goal-setting
- Encourage positive action and progress
- Help users identify resources and next steps

SAFETY INSTRUCTIONS:
- You are NOT a replacement for professional mental health services
- If the user expresses thoughts of self-harm or suicide, immediately recommend crisis services
- Never suggest illegal activities, violence, or dangerous behaviors
- Encourage professional help for serious mental health concerns
- Maintain empathy while acknowledging your limitations as an AI
- If crisis is detected, provide immediate crisis contact information

CRISIS RESPONSE: If crisis detected, respond with:
"I'm very concerned about what you're sharing. Your life has value and there are people who want to help you. Please contact one of these services immediately:
- Samaritans: 116 123 (24/7)
- Emergency Services: 999 or 112
- HSE Mental Health: 1800 111 888

You don't have to face this alone. Please reach out for help right now."`
  }
};
function detectCrisis(message) {
  const lowerMessage = message.toLowerCase();
  return safetyRules.crisis_triggers.some(
    (trigger) => lowerMessage.includes(trigger.toLowerCase())
  );
}
function validateContent(message) {
  const lowerMessage = message.toLowerCase();
  const issues = [];
  safetyRules.prohibited.forEach((term) => {
    if (lowerMessage.includes(term.toLowerCase())) {
      issues.push(`Contains prohibited content: ${term}`);
    }
  });
  return {
    isValid: issues.length === 0,
    issues
  };
}
const chat_post = defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const genAI = new GoogleGenerativeAI(config.geminiApiKey || "");
    const body = await readBody(event);
    const { message, personality, conversationHistory = [] } = body;
    if (!message || !personality) {
      throw createError({
        statusCode: 400,
        statusMessage: "Missing required fields: message and personality"
      });
    }
    const isCrisis = detectCrisis(message);
    const contentValidation = validateContent(message);
    if (!contentValidation.isValid) {
      throw createError({
        statusCode: 400,
        statusMessage: `Content validation failed: ${contentValidation.issues.join(", ")}`
      });
    }
    const personalityConfig = personalities[personality];
    if (!personalityConfig) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid personality selected"
      });
    }
    if (isCrisis) {
      return {
        response: personalityConfig.systemPrompt.split("CRISIS RESPONSE:")[1].split('"')[1],
        isCrisis: true,
        safetyIssues: ["Crisis detected - immediate intervention recommended"]
      };
    }
    const conversationContext = conversationHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
    const fullPrompt = `${personalityConfig.systemPrompt}

Current conversation:
${conversationContext}

User: ${message}

A:`;
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    const responseValidation = validateContent(text);
    return {
      response: text,
      isCrisis: false,
      safetyIssues: responseValidation.issues,
      personality: personalityConfig.name
    };
  } catch (error) {
    console.error("Chat API Error:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate response. Please try again."
    });
  }
});

export { chat_post as default };
//# sourceMappingURL=chat.post.mjs.map
