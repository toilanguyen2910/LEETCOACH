/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LeetCodeProblem, DailyActivity } from '../types';
import ContributionGrid from './ContributionGrid';
import { Play, Calendar, Star, CheckCircle2 } from 'lucide-react';

interface DashboardProps {
  problems: LeetCodeProblem[];
  activityLogs: DailyActivity[];
  streakDays: number;
  maxStreak: number;
  onSelectProblem: (problem: LeetCodeProblem) => void;
}

export default function Dashboard({ problems, activityLogs, streakDays, maxStreak, onSelectProblem }: DashboardProps) {
  
  // Recommend a problem today: Find the first unsolved problem (Priority: Easy/Medium)
  const getDailyRecommendation = (): LeetCodeProblem | null => {
    // 1st Priority: Easy 'Todo'
    const easyTodo = problems.find(p => p.difficulty === 'Easy' && p.status === 'Todo');
    if (easyTodo) return easyTodo;

    // 2nd Priority: Medium 'Todo'
    const mediumTodo = problems.find(p => p.difficulty === 'Medium' && p.status === 'Todo');
    if (mediumTodo) return mediumTodo;

    // 3rd Priority: Any 'Todo'
    const anyTodo = problems.find(p => p.status === 'Todo');
    if (anyTodo) return anyTodo;

    // Fallback: Any problem
    return problems.length > 0 ? problems[0] : null;
  };

  const recommendation = getDailyRecommendation();

  // Get recently solved problems with dates
  const getRecentSolved = () => {
    const solved = problems
      .filter(p => p.status === 'Solved' && p.lastSolvedAt)
      .sort((a, b) => new Date(b.lastSolvedAt!).getTime() - new Date(a.lastSolvedAt!).getTime())
      .slice(0, 5);
    return solved;
  };

  const recentSolved = getRecentSolved();

  // Local tips list
  const optimizationTips = [
    { title: "Luôn đặt tiêu chí tối ưu hóa bộ nhớ và hiệu năng lên hàng đầu", text: "Tránh tạo thêm mảng phụ không đáng có. Ưu tiên các giải thuật Two Pointers, Sliding Window hoặc mài giũa cấu trúc Hash Map trước khi thử Dynamic Programming." },
    { title: "Khai thác tối đa thế mạnh của Binary Search (Tìm kiếm nhị phân)", text: "Hễ gặp bài toán mảng đã được sắp xếp (Sorted Array), câu hỏi tìm kiếm ngưỡng trị (Min/Max value), hãy lập tức suy nghĩ đến độ phức tạp O(log N) bằng Binary Search." },
    { title: "Phát hiện chu kỳ lặp lại bằng kỹ thuật Fast & Slow Pointers", text: "Khi giải quyết các bài liên quan đến danh sách liên kết (Linked List) hoặc xác định chu kỳ số học, giải thuật rùa và thỏ Floyd's Cycle Detection là chiếc phao cứu sinh toàn diện." }
  ];

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Welcome Banner */}
      <div className="bg-brand-panel text-[#E0E0E0] rounded-none p-6 border border-brand-border relative overflow-hidden shadow-[4px_4px_0px_#000000]">
        <div className="absolute top-0 right-0 p-4 font-mono text-[90px] font-black leading-none text-zinc-900 select-none pointer-events-none">
          {problems.length < 10 ? `0${problems.length}` : problems.length}
        </div>
        <div className="max-w-2xl relative z-10">
          <span className="bg-brand-neon text-black font-black uppercase px-2.5 py-1 text-[9px] tracking-widest">
            ACTIVE SESSION
          </span>
          <h2 className="text-2xl font-black text-white mt-4 uppercase italic tracking-tight">
            Chào mừng bạn quay lại hệ thống ôn luyện LeetCode!
          </h2>
          <p className="text-zinc-400 mt-2.5 text-xs font-light leading-relaxed">
            Hôm nay là một ngày tuyệt vời để rèn luyện tư duy thuật toán. Hãy nhập tệp từ Local Archive, mài giũa giải thuật và xin ý kiến từ <span className="text-brand-neon font-bold">Mentor AI v3.5-Flash</span> khi phân tích các góc biên (corner cases).
          </p>
        </div>
      </div>

      {/* Main Grid: Heatmap + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: General Stats and Contribution map */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <ContributionGrid 
            problems={problems}
            activityLogs={activityLogs}
            streakDays={streakDays}
            maxStreak={maxStreak}
          />

          {/* Core Tips Card */}
          <div className="bg-brand-panel border border-brand-border rounded-none p-6 shadow-[3px_3px_0_#000]">
            <h3 className="font-bold text-brand-neon text-xs uppercase tracking-widest flex items-center gap-2 mb-5 border-b border-brand-border pb-3">
              <Star className="w-4 h-4 text-brand-neon" />
              Mẹo Ôn Luyện Thuật Toán Hiệu Quả
            </h3>

            <div className="space-y-4">
              {optimizationTips.map((tip, idx) => (
                <div key={idx} className="flex gap-3 text-xs leading-relaxed">
                  <div className="w-6 h-6 bg-brand-dark border border-brand-border-light text-brand-neon flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs">{tip.title}</h4>
                    <p className="text-zinc-400 text-[11px] mt-1 leading-relaxed border-l-2 border-brand-neon/20 pl-2">
                      {tip.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Recommendation & Activity Logs */}
        <div className="space-y-6">
          {/* Daily 추천 Challenge */}
          {recommendation && (
            <div className="bg-[#0D0D0D] border border-brand-border p-5 rounded-none shadow-[3px_3px_0_#000]" id="daily-recommendation">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] bg-brand-neon text-black font-extrabold px-2.5 py-0.5 uppercase tracking-wider">
                  Đề xuất hôm nay
                </span>
                <span className={`text-[9px] font-mono font-black px-2 py-0.5 uppercase tracking-wide border ${
                  recommendation.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  recommendation.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  #{recommendation.difficulty}
                </span>
              </div>

              <h4 className="font-extrabold text-white text-base tracking-tight mb-2 uppercase italic">
                {recommendation.title}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-3 leading-relaxed mb-4">
                {recommendation.description.replace(/```[\s\S]*?```/g, '').replace(/[\#*`]/g, '')}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {recommendation.tags?.slice(0, 3).map((tag, i) => (
                  <span key={i} className="text-[9px] font-mono bg-brand-dark text-zinc-500 px-2 py-0.5 border border-brand-border">
                    //{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => onSelectProblem(recommendation)}
                className="w-full bg-brand-neon hover:bg-white text-black font-black uppercase text-xs px-4 py-3 rounded-none flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 text-black fill-black" />
                <span>Bắt đầu chiến ngay</span>
              </button>
            </div>
          )}

          {/* Recent History log */}
          <div className="bg-brand-panel border border-brand-border p-5 rounded-none shadow-[3px_3px_0_#000]">
            <h3 className="font-bold text-brand-neon text-xs uppercase tracking-widest flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
              <Calendar className="w-4 h-4 text-brand-neon" />
              Lịch Sử Gần Đây
            </h3>

            {recentSolved.length > 0 ? (
              <div className="space-y-3">
                {recentSolved.map((prob) => (
                  <div 
                    key={prob.id} 
                    className="p-3 bg-brand-dark border border-brand-border text-xs flex flex-col gap-1.5 relative overflow-hidden group hover:border-brand-neon transition-all"
                  >
                    <div className="flex justify-between items-start gap-2">
                      <button 
                        onClick={() => onSelectProblem(prob)}
                        className="font-bold text-white hover:text-brand-neon hover:underline text-left truncate leading-tight uppercase"
                      >
                        {prob.title}
                      </button>
                      <span className={`text-[9px] font-mono font-bold px-1.5 py-0.2 border ${
                        prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/10' :
                        prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-400 border-amber-500/10' :
                        'bg-red-500/10 text-red-400 border-red-500/10'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Đã giải: {new Date(prob.lastSolvedAt!).toLocaleDateString('vi', {day: 'numeric', month: 'short'})}</span>
                    </div>

                    {prob.customNotes && (
                      <p className="text-[10px] text-zinc-400 italic mt-0.5 line-clamp-1 border-l border-brand-neon/30 pl-1.5">
                        "{prob.customNotes}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-zinc-500 italic bg-brand-dark border border-brand-border text-xs">
                <p>Chưa có bài giải gần đây.</p>
                <p className="text-[10px] mt-1 text-zinc-600">// Thử ngay với LeetCoach</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
