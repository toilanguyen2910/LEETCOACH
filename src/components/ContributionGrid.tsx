/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LeetCodeProblem, DailyActivity } from '../types';
import { Flame, Trophy, Target } from 'lucide-react';

interface ContributionGridProps {
  problems: LeetCodeProblem[];
  activityLogs: DailyActivity[];
  streakDays: number;
  maxStreak: number;
}

export default function ContributionGrid({ problems, activityLogs, streakDays, maxStreak }: ContributionGridProps) {
  // Compute difficulty metrics
  const total = problems.length;
  const solvedList = problems.filter((p) => p.status === 'Solved');
  const solvedCount = solvedList.length;

  const easyTotal = problems.filter((p) => p.difficulty === 'Easy').length;
  const easySolved = solvedList.filter((p) => p.difficulty === 'Easy').length;

  const mediumTotal = problems.filter((p) => p.difficulty === 'Medium').length;
  const mediumSolved = solvedList.filter((p) => p.difficulty === 'Medium').length;

  const hardTotal = problems.filter((p) => p.difficulty === 'Hard').length;
  const hardSolved = solvedList.filter((p) => p.difficulty === 'Hard').length;

  const getPercent = (solved: number, totalNum: number) => {
    if (totalNum === 0) return 0;
    return Math.round((solved / totalNum) * 100);
  };

  // Generate date list for past 150 days to construct the grid
  const generateDatesForGrid = () => {
    const arr: { dateStr: string; solvedCount: number; active: boolean }[] = [];
    const today = new Date();
    
    // We want the grid of 21 columns (weeks) representing 147 days
    const totalDays = 147;
    
    // Shift start till the previous Sunday so the grid aligns nicely
    const currentDayOfWeek = today.getDay(); // 0 is Sun, 6 is Sat
    const daysToGenerate = totalDays + currentDayOfWeek;
    
    for (let i = daysToGenerate - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Match activities count
      const matchLog = activityLogs.find(log => log.date === dateStr);
      const solved = matchLog ? matchLog.solvedProblemIds.length : 0;
      
      arr.push({
        dateStr,
        solvedCount: solved,
        active: solved > 0
      });
    }
    
    return arr;
  };

  const datesArr = generateDatesForGrid();

  // Helper to resolve green color shade depending on total count
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-brand-dark/80 hover:bg-brand-border-light/80 border border-brand-border';
    if (count === 1) return 'bg-brand-neon/30 hover:bg-brand-neon/40 border border-brand-neon/10';
    if (count === 2) return 'bg-brand-neon/60 hover:bg-brand-neon/85 border border-brand-neon/30 hover:scale-105';
    return 'bg-brand-neon hover:bg-white border border-[#CCFF00] hover:scale-110';
  };

  return (
    <div className="space-y-6" id="stats-contribution">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total stats card */}
        <div className="bg-brand-panel p-5 rounded-none border border-brand-border shadow-[3px_3px_0_var(--color-brand-border-val)] flex items-center gap-4 transition-colors duration-200">
          <div className="w-11 h-11 bg-brand-dark border border-brand-border-light flex items-center justify-center shrink-0">
            <Trophy className="w-5.5 h-5.5 text-brand-neon" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">// Học lực tổng quát</p>
            <p className="text-xl font-black text-brand-text mt-0.5">
              {solvedCount} <span className="text-xs text-brand-text-muted font-bold">/ {total} bài</span>
            </p>
            <div className="w-24 bg-brand-dark h-1 border border-brand-border mt-1.5 overflow-hidden">
              <div 
                className="bg-brand-neon h-full transition-all duration-500" 
                style={{ width: `${getPercent(solvedCount, total)}%` }} 
              />
            </div>
            <p className="text-[9px] text-brand-neon font-bold tracking-tight uppercase mt-1">Luyện {getPercent(solvedCount, total)}%</p>
          </div>
        </div>

        {/* Streaks Card */}
        <div className="bg-brand-panel p-5 rounded-none border border-brand-border shadow-[3px_3px_0_var(--color-brand-border-val)] flex items-center gap-4 transition-colors duration-200">
          <div className="w-11 h-11 bg-brand-dark border border-brand-border-light flex items-center justify-center shrink-0">
            <Flame className="w-5.5 h-5.5 text-brand-neon animate-pulse" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">// Luyện thuật toán</p>
            <p className="text-xl font-black text-brand-text mt-0.5">
              {streakDays} <span className="text-xs text-brand-text-muted font-mono">ngày</span>
            </p>
            <p className="text-[9px] text-brand-text-muted/80 font-mono mt-1 uppercase tracking-tight">
              Kỷ lục cao nhất: <span className="text-brand-neon font-bold">{maxStreak} ngày</span>
            </p>
          </div>
        </div>

        {/* Difficulty Easy + Medium progress */}
        <div className="bg-brand-panel p-5 rounded-none border border-brand-border shadow-[3px_3px_0_var(--color-brand-border-val)] col-span-1 md:col-span-2 transition-colors duration-200">
          <h4 className="text-[10px] font-black uppercase text-brand-text-muted/70 tracking-widest mb-3">// Tiến độ theo độ khó</h4>
          <div className="space-y-2.5">
            {/* Easy Bar */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="font-bold text-emerald-500 dark:text-emerald-400 flex items-center gap-1">
                  🟢 EASY (DỄ)
                </span>
                <span className="text-brand-text-muted font-bold">{easySolved}/{easyTotal} ({getPercent(easySolved, easyTotal)}%)</span>
              </div>
              <div className="w-full bg-brand-dark h-1 border border-brand-border overflow-hidden">
                <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${getPercent(easySolved, easyTotal)}%` }}></div>
              </div>
            </div>

            {/* Medium Bar */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="font-bold text-amber-500 dark:text-amber-400 flex items-center gap-1">
                  🟡 MEDIUM (TRUNG BÌNH)
                </span>
                <span className="text-brand-text-muted font-bold">{mediumSolved}/{mediumTotal} ({getPercent(mediumSolved, mediumTotal)}%)</span>
              </div>
              <div className="w-full bg-brand-dark h-1 border border-brand-border overflow-hidden">
                <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${getPercent(mediumSolved, mediumTotal)}%` }}></div>
              </div>
            </div>

            {/* Hard Bar */}
            <div>
              <div className="flex justify-between items-center text-[10px] font-mono mb-1">
                <span className="font-bold text-red-500 dark:text-red-400 flex items-center gap-1">
                  🔴 HARD (KHÓ)
                </span>
                <span className="text-brand-text-muted font-bold">{hardSolved}/{hardTotal} ({getPercent(hardSolved, hardTotal)}%)</span>
              </div>
              <div className="w-full bg-brand-dark h-1 border border-brand-border overflow-hidden">
                <div className="bg-red-500 h-full transition-all duration-300" style={{ width: `${getPercent(hardSolved, hardTotal)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contribution Calendar Heatmap card */}
      <div className="bg-brand-panel p-6 rounded-none border border-brand-border shadow-[3px_3px_0_var(--color-brand-border-val)] transition-colors duration-200" id="activity-heatmap">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 border-b border-brand-border pb-3.5">
          <div>
            <h3 className="text-xs font-black text-brand-text uppercase tracking-widest flex items-center gap-1.5 leading-none">
              <Target className="w-4 h-4 text-brand-neon" />
              Lịch Luyện Code // 150 Ngày Qua
            </h3>
            <p className="text-[10px] text-brand-text-muted mt-1 uppercase font-mono tracking-tight leading-none">
              Khối lượng rèn luyện thuật toán hàng ngày dựa trên tổng số bài đã nộp.
            </p>
          </div>
          
          <div className="flex items-center gap-1 text-[10.5px] font-mono text-brand-text-muted/80">
            <span className="mr-1">KHÔ KHAN</span>
            <span className="w-3.5 h-3.5 bg-brand-dark/80 border border-brand-border"></span>
            <span className="w-3.5 h-3.5 bg-brand-neon/30 border border-brand-neon/10"></span>
            <span className="w-3.5 h-3.5 bg-brand-neon/60 border border-brand-neon/30"></span>
            <span className="w-3.5 h-3.5 bg-brand-neon border border-emerald-300"></span>
            <span className="ml-1">PRO</span>
          </div>
        </div>

        {/* Heatmap Grid implementation */}
        <div className="flex flex-col overflow-x-auto select-none pt-2 scrollbar-none">
          <div className="flex gap-[4px] min-w-[700px] pb-1">
            {/* Days indicator column */}
            <div className="flex flex-col justify-between text-[9px] text-brand-text-muted/65 font-mono pr-2 pb-4 leading-none h-[120px] w-6 shrink-0 pt-0.5 font-bold uppercase">
              <span>CN</span>
              <span>T2</span>
              <span>T4</span>
              <span>T6</span>
              <span>T7</span>
            </div>

            {/* Weeks columns container */}
            <div className="flex flex-wrap flex-col gap-[4px] h-[120px] w-full content-start">
              {datesArr.map((item, index) => (
                <div
                  key={index}
                  title={`${item.dateStr}: Giải được ${item.solvedCount} bài`}
                  className={`w-[13px] h-[13px] rounded-none cursor-pointer transition-all duration-150 ${getColorClass(item.solvedCount)}`}
                />
              ))}
            </div>
          </div>
          
          {/* Months indicator row */}
          <div className="flex pl-10 text-[9px] font-mono text-brand-text-muted/60 justify-between pr-4 mt-2 leading-none font-bold uppercase tracking-widest">
            <span>4 tháng trước</span>
            <span>3 tháng trước</span>
            <span>2 tháng trước</span>
            <span>Tháng trước</span>
            <span>Tháng này (Trực Tuyến)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
