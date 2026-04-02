import { NextRequest, NextResponse } from "next/server";
import {
  buildFallbackPassageAssistantReply,
  buildPassageAssistantContext,
  PassageAssistantMessage,
  PassageAssistantReply,
} from "@/lib/passage-assistant";

export const runtime = "nodejs";

type PassageAssistantRequest = {
  reference?: string;
  primaryText?: string;
  question?: string;
  history?: PassageAssistantMessage[];
};

function sanitizeHistory(history: PassageAssistantMessage[] | undefined) {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (item): item is PassageAssistantMessage =>
        Boolean(item) &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim().length > 0,
    )
    .slice(-8);
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";

  const outputText =
    "output_text" in payload && typeof payload.output_text === "string"
      ? payload.output_text
      : "";

  if (outputText) return outputText;

  if (!("output" in payload) || !Array.isArray(payload.output)) {
    return "";
  }

  const textBlocks = payload.output.flatMap((item) => {
    if (!item || typeof item !== "object" || !("content" in item) || !Array.isArray(item.content)) {
      return [];
    }

    return item.content
      .map((entry: unknown) => {
        if (!entry || typeof entry !== "object") return "";
        if ("text" in entry && typeof entry.text === "string") return entry.text;
        return "";
      })
      .filter(Boolean);
  });

  return textBlocks.join("\n").trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as PassageAssistantRequest;
    const reference = body.reference?.trim();
    const primaryText = body.primaryText?.trim();
    const question = body.question?.trim();

    if (!reference || !primaryText || !question) {
      return NextResponse.json(
        { error: "Reference, primary text, and question are required." },
        { status: 400 },
      );
    }

    const history = sanitizeHistory(body.history);
    const context = buildPassageAssistantContext(reference, primaryText);
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      const reply = buildFallbackPassageAssistantReply(question, context);
      return NextResponse.json({
        reply,
        provider: "local-fallback",
      });
    }

    const model = process.env.OPENAI_MODEL || "gpt-5-mini";
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are Christian Study Guide's grounded Bible study assistant. Answer only from the supplied passage context packet and recent conversation. Do not invent facts, theology, historical claims, or cross references that are not present in the packet. If the packet is not enough to answer fully, say so plainly. Keep the tone pastoral, clear, and concise.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: JSON.stringify({
                  task: "Answer the user's latest question about the passage using only the provided grounding packet and conversation.",
                  latestQuestion: question,
                  conversationHistory: history,
                  groundingPacket: context,
                  responseRequirements: {
                    answerStyle:
                      "Explain the text in context, cite which packet sections you used, and offer 2-3 follow-up questions.",
                    citeOnlyFrom: [
                      "Passage text",
                      "Commentary layer",
                      "Cross references",
                      "Original-language tools",
                      "Book context",
                      "Timeline context",
                      "Dictionary",
                      "Atlas characters",
                      "Atlas locations",
                      "Reflection prompts",
                    ],
                  },
                }),
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "passage_study_reply",
            strict: true,
            schema: {
              type: "object",
              properties: {
                title: { type: "string" },
                answer: { type: "string" },
                supports: {
                  type: "array",
                  items: { type: "string" },
                },
                followUpQuestions: {
                  type: "array",
                  items: { type: "string" },
                },
                citations: {
                  type: "array",
                  items: { type: "string" },
                },
                limitation: { type: "string" },
              },
              required: [
                "title",
                "answer",
                "supports",
                "followUpQuestions",
                "citations",
                "limitation",
              ],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      const reply = buildFallbackPassageAssistantReply(question, context);
      return NextResponse.json(
        {
          reply,
          provider: "local-fallback",
          error: `OpenAI request failed: ${errorText}`,
        },
        { status: 200 },
      );
    }

    const payload = (await response.json()) as unknown;
    const outputText = extractOutputText(payload);
    const parsedReply = JSON.parse(outputText) as PassageAssistantReply;

    return NextResponse.json({
      reply: parsedReply,
      provider: "openai",
      model,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to complete passage assistant request.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
