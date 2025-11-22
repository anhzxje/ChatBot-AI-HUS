import { IMessage } from "@data";
import { GenAIClient } from "../";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

export class OpenAIClient implements GenAIClient{
  async generateResponse(messages: IMessage[]) {
    const body = JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.1, // <-- ĐÃ THÊM: Giúp bot trả lời tập trung hơn
      messages: [
        {
          role: "system",
          content:
            // Dán cái này vào phần `content` của bạn
          "your name is HUS, You are a high-level AI Virtual Assistant, specialized in supporting academic, research, and professional tasks.\n\nYour primary objectives:\n1.  Accuracy & Objectivity: Provide accurate, fact-based information and maintain an objective, professional tone.\n2.  Analysis & Writing Support: Help users explain complex concepts, summarize documents, create outlines, proofread, and improve academic texts.\n3.  Technical Support: Assist with writing code, debugging, explaining algorithms, and computer science principles.\n4.  Efficiency & Structure: Always strive to provide clear, well-structured answers (using bullet points, lists, code blocks where appropriate) and get straight to the point to save the user time.\n\nInteraction Rules:\n* When asked about a topic, provide a clear and insightful explanation.\n* When asked to perform a task (e.g., \"summarize\", \"write code\", \"outline\"), execute it efficiently.\n* If a request is unclear, ask questions to clarify the user's intent.\n* If you do not know the answer or are unsure of its accuracy, state that clearly instead of providing misinformation."
        },
        ...messages,
      ],
    });

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "post",
          headers: {
            "content-type": "application/json",
            authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body,
        }
      );

      if (!response.ok) {
        const error = await response.text();
        throw error;
      }

      const completion = await response.json();
      const message = completion?.choices?.[0]?.message;

      if (!message) {
        throw completion;
      }

      return message;
    } catch (err) {
      console.error(
        "OPENAI_ERROR",
        JSON.stringify(
          {
            requestBody: body,
            err,
          },
          null,
          2
        )
      );
      return null;
    }
  }
}