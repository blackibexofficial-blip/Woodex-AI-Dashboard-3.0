import { GoogleGenAI } from "@google/genai";
import { Message } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateDraftReply = async (conversationContext: string): Promise<string> => {
  if (!apiKey) return "Suggested: Thank you for your message. I will look into this and get back to you shortly with the details.";

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      You are a professional, helpful, and concise CRM assistant for Woodex AI, a premium furniture brand.
      Based on the conversation history below, draft a natural, polite, and helpful reply for the agent (or bot).
      
      Guidelines:
      - Keep it under 50 words if possible.
      - If the user asks about price/quotes, mention the "E-Quotation" system.
      - If the user is angry, be empathetic and offer a resolution.
      - Maintain a professional but approachable tone.

      Conversation History:
      ${conversationContext}
      
      Draft Reply (Text only):
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "Could not generate draft.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Thank you for your inquiry. An agent will respond shortly.";
  }
};

export const analyzeDashboard = async (dataSummary: string): Promise<string> => {
  if (!apiKey) return "Insights unavailable (No API Key).";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this dashboard summary for Woodex AI and provide 3 bullet points of executive insights:\n${dataSummary}`,
    });
    return response.text || "No insights available.";
  } catch (error) {
    return "Error analyzing data.";
  }
};

export const analyzeConversation = async (messages: Message[]): Promise<{ summary: string; suggestions: string[] }> => {
  // Robust Fallback for Demo
  if (!apiKey) {
    const lastMsg = messages[messages.length - 1]?.text.toLowerCase() || '';
    let intent = "General Inquiry";
    let suggestions = ["Send Catalog", "Schedule Call", "Ask for Details"];

    if (lastMsg.includes('price') || lastMsg.includes('quote') || lastMsg.includes('cost')) {
      intent = "Pricing Inquiry";
      suggestions = ["Generate E-Quotation", "Check Stock Availability", "Offer Bulk Discount"];
    } else if (lastMsg.includes('delivery') || lastMsg.includes('shipping')) {
      intent = "Logistics";
      suggestions = ["Check Delivery Status", "Share Shipping Policy", "Confirm Address"];
    } else if (lastMsg.includes('bad') || lastMsg.includes('late') || lastMsg.includes('broken')) {
      intent = "Complaint";
      suggestions = ["Escalate to Manager", "Offer Refund/Exchange", "Apologize & Resolve"];
    }

    return {
      summary: `Customer appears to be interested in ${intent}. Recent engagement suggests active interest.`,
      suggestions: suggestions
    };
  }

  try {
    const context = messages.map(m => `${m.sender}: ${m.text}`).join('\n');
    const prompt = `
      Analyze this customer conversation for Woodex AI (Furniture brand).
      
      Conversation:
      ${context}
      
      Task:
      1. Summarize the current status/need in 1 sentence.
      2. Provide 3 short, actionable next steps for the agent (max 3-4 words each).
      
      Output JSON format: { "summary": "...", "suggestions": ["...", "...", "..."] }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      config: { responseMimeType: 'application/json' },
      contents: prompt,
    });

    const json = JSON.parse(response.text || '{}');
    return {
      summary: json.summary || "Analysis unavailable.",
      suggestions: json.suggestions || ["Review Request"]
    };
  } catch (error) {
    console.error("Gemini Analysis Error", error);
    return {
      summary: "Error analyzing conversation.",
      suggestions: ["Check Manual Details"]
    };
  }
};