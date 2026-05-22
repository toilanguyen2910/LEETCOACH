/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, MessageSquare, AlertTriangle, Play, Flame, HelpCircle, RefreshCw } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function AILounge() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Xin chào bạn thân mến! Tôi là Mentor Lập Trình AI của riêng bạn.\n\nTôi ở đây để giúp bạn định hướng tư duy thuật giải, lên kế hoạch ôn đề hàng ngày, mổ xẻ tường tận các lý thuyết phức tạp (đồ thị Graph, cây Segment Tree, hoặc DP), hay bồi dưỡng phản xạ trả lời trực diện.\n\nHôm nay bạn có chủ đề thuật toán hay tệp đề thi nào muốn thảo luận không? Chọn nhanh chủ đề bên dưới hoặc gõ trực tiếp cho tôi!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const presetQuestions = [
    { title: "🗺️ LỘ TRÌNH 75 BÀI", prompt: "Hãy xây dựng giúp tôi một lộ trình ôn luyện 75 bài LeetCode kinh điển (Blind 75) phân chia theo nhóm chủ đề dễ đến khó, kèm mục tiêu cho từng tuần học nhé!" },
    { title: "🧩 MẸO QUY HOẠCH ĐỘNG (DP)", prompt: "Tôi rất sợ dạng bài Quy hoạch động (Dynamic Programming). Bạn có mẹo học hay quy trình tư duy từng bước nào để bẻ gãy mọi bài toán dạng này không?" },
    { title: "🎤 BÍ QUYẾT PHỎNG VẤN BIGTECH", prompt: "Chia sẻ cho tôi những lưu ý đặc biệt, cách trình bày tư duy thuật toán (từ Brute Force lên Optimal) bằng lời khi phỏng vấn coding trực tiếp với các kĩ sư Big Tech." },
    { title: "💾 SPACE VS TIME BIG-O TRADE-OFF", prompt: "Hãy giải thích sự đánh đổi (trade-off) giữa tối ưu hóa Thời gian và Không gian bộ nhớ trong thuật toán, cho tôi ví dụ thực tế minh họa." }
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = (customPrompt || input).trim();
    if (!textToSend || loading) return;

    // Save user message to chat state
    const newMessages = [...messages, { role: 'user', content: textToSend } as Message];
    setMessages(newMessages);
    setInput('');
    setLoading(true);
    setErrorCode(null);

    try {
      const response = await fetch('/api/ai/mentor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToSend })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Gặp sự cố kết nối tới Mentor.");
      }

      setMessages([...newMessages, { role: 'assistant', content: data.text }]);
    } catch (err: any) {
      console.error(err);
      setErrorCode(err.message || "Không thể kết nối đến hệ thống AI. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-panel border border-brand-border flex flex-col h-[650px] shadow-[4px_4px_0_var(--color-brand-border-val)] rounded-none text-brand-text" id="ai-lounge-room">
      {/* Lounge Header */}
      <div className="px-6 py-4 border-b border-brand-border bg-brand-dark flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-panel border border-brand-border flex items-center justify-center">
            <Bot className="w-5.5 h-5.5 text-brand-neon" />
          </div>
          <div>
            <h2 className="text-xs font-black text-brand-text flex items-center gap-1.5 uppercase tracking-widest">
              Góc AI Mentor Luyện Giải Thuật
              <Sparkles className="w-4 h-4 text-brand-neon animate-pulse" />
            </h2>
            <p className="text-[10px] text-brand-text-muted/65 font-mono uppercase mt-0.5">// Logic, Complexity analysis, Big Tech Coding Interviews</p>
          </div>
        </div>

        <div className="text-[9.5px] font-mono text-brand-text-muted font-bold bg-brand-dark px-2.5 py-0.5 rounded-none border border-brand-border">
          MODEL: GEMINI-2.5-FLASH
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-brand-code-bg" id="chat-scroller">
        {messages.map((msg, index) => {
          const isAI = msg.role === 'assistant';
          return (
            <div 
              key={index} 
              className={`flex gap-3 text-xs leading-relaxed max-w-4xl ${
                isAI ? '' : 'flex-row-reverse ml-auto'
              }`}
            >
              {/* Avatar Icon */}
              <div className={`w-8 h-8 rounded-none border flex items-center justify-center shrink-0 ${
                isAI ? 'bg-brand-panel border-brand-neon text-brand-neon' : 'bg-brand-dark border-brand-border text-brand-text'
              }`}>
                {isAI ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message bubble */}
              <div className={`p-4 rounded-none border whitespace-pre-wrap leading-relaxed shadow-[2px_2px_0_var(--color-brand-border-val)] font-mono text-[11.5px] ${
                isAI 
                  ? 'bg-brand-panel border-brand-border text-brand-text' 
                  : 'bg-brand-dark border-brand-neon/30 text-brand-text'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 text-xs max-w-4xl">
            <div className="w-8 h-8 bg-brand-panel border border-brand-neon rounded-none text-brand-neon shrink-0 flex items-center justify-center animate-bounce">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-none bg-brand-panel border border-brand-border text-brand-text-muted shadow-[2px_2px_0_var(--color-brand-border-val)] flex items-center gap-2 select-none font-mono">
              <span className="w-2.5 h-2.5 rounded-none bg-brand-neon animate-ping"></span>
              <span>Mentor đang rà soát thuật giải và biên soạn phản hồi...</span>
            </div>
          </div>
        )}

        {errorCode && (
          <div className="p-4.5 bg-red-950/20 border border-red-900/30 rounded-none text-red-400 text-xs flex items-start gap-2.5 max-w-md mx-auto">
            <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5 text-red-400" />
            <div>
              <strong className="font-extrabold uppercase tracking-wide">Lỗi Kết Nối AI Mentor</strong>
              <p className="mt-1 leading-relaxed text-[11px] font-mono">{errorCode}</p>
              <p className="mt-2 text-[10.5px] text-zinc-500 font-mono leading-relaxed">// Cần đăng ký GEMINI_API_KEY trong mục Secrets của hệ thống để sử dụng đầy đủ tính năng AI.</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset quick actions list */}
      <div className="px-6 py-3 bg-brand-dark border-t border-brand-border overflow-x-auto whitespace-nowrap flex gap-2 shrink-0 scrollbar-none select-none">
        {presetQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q.prompt)}
            disabled={loading}
            className="text-[10px] font-mono font-bold uppercase tracking-wider bg-brand-panel hover:bg-brand-border border border-brand-border text-brand-text-muted hover:text-brand-neon px-3 py-1.5 rounded-none transition-colors cursor-pointer disabled:opacity-50"
          >
            {q.title}
          </button>
        ))}
      </div>

      {/* Input controls box */}
      <div className="p-4 border-t border-brand-border bg-brand-dark shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
          className="flex gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            placeholder="Gửi câu hỏi, nhờ phân tích phân đoạn code hoặc yêu cầu lộ trình..."
            className="flex-1 text-xs px-4 py-3 border border-brand-border rounded-none focus:outline-none focus:border-brand-neon bg-brand-panel text-brand-text placeholder-zinc-750 font-mono"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="px-5 bg-brand-neon hover:bg-white text-black font-black uppercase text-xs rounded-none flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4.5 h-4.5 text-black" />
          </button>
        </form>
      </div>
    </div>
  );
}
