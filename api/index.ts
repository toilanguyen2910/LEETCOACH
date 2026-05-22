import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json({ limit: "50mb" }));

// Dynamic initialization helper to prevent startup crash if API key is missing
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY is not configured in the application environment.");
  }
  return new GoogleGenAI({
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// API Route: Check if AI capabilities are available
app.get("/api/ai/status", (req, res) => {
  res.json({
    configured: !!process.env.GEMINI_API_KEY,
  });
});

// API Route: AI Mentor assistance
app.post("/api/ai/mentor", async (req, res) => {
  try {
    const { prompt, systemInstruction } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Yêu cầu cung cấp câu hỏi hoặc đề bài." });
    }

    const client = getGeminiClient();
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "Bạn là một Mentor lập trình AI người Việt thân thiện, nhiệt tình và chuyên môn cao. Bạn giúp lập trình viên phân tích bài toán LeetCode, tìm ra giải thuật tối ưu, gợi ý hướng giải quyết (tránh đưa lời giải đầy đủ ngay lập tức trừ khi được yêu cầu), phân tích độ phức tạp thời gian/không gian (Big O), và hướng dẫn cách viết code tốt hơn.",
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("AI Mentor Error:", err);
    res.status(500).json({ 
      error: err.message || "Đã xảy ra lỗi khi kết nối với AI Mentor. Vui lòng thử lại sau.",
      isConfigError: !process.env.GEMINI_API_KEY
    });
  }
});

export default app;
