/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, BookOpen, Terminal, MessageSquare, Code, Flame, Award } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakDays: number;
  solvedCount: number;
}

export default function Sidebar({ activeTab, setActiveTab, streakDays, solvedCount }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Bảng Điều Khiển', icon: LayoutDashboard, desc: 'Tổng quan tiến trình học tập' },
    { id: 'tutorial', name: 'Nhập Môn Lập Trình', icon: Code, desc: 'Học lập trình cơ bản cho người mới' },
    { id: 'problems', name: 'Kho Bài Tập LeetCode', icon: BookOpen, desc: 'Tìm kiếm, lọc & import đề' },
    { id: 'playground', name: 'Phòng Code Thử Nghiệm', icon: Terminal, desc: 'Trình biên soạn & giải thuật' },
    { id: 'ai', name: 'Góc Trợ Lý AI Mentor', icon: MessageSquare, desc: 'Giải thích, gợi ý & tối ưu' },
  ];

  return (
    <div className="w-64 bg-brand-panel border-r border-brand-border text-[#E0E0E0] flex flex-col justify-between shrink-0 h-full select-none font-sans" id="sidebar-panel">
      {/* Brand Header */}
      <div>
        <div className="p-6 border-b border-brand-border flex items-center gap-3 bg-brand-bg">
          <div className="w-8 h-8 bg-brand-neon flex items-center justify-center">
            <span className="text-black font-black text-xl">C</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-[0.15em] uppercase text-brand-neon">LeetCoach</h1>
            <p className="text-[9px] text-[#666] tracking-[0.1em] uppercase font-mono italic">// Terminal Kernel</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="p-4 pt-6">
          <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-4 font-black px-2">// Core Modules</div>
          <div className="space-y-1.5 animate-fade-in">
            {menuItems.map((item, idx) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const serialNum = `[0${idx + 1}]`;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 text-xs font-bold uppercase tracking-wide transition-all border rounded-none cursor-pointer text-left ${
                    isActive
                      ? 'bg-brand-neon text-black border-brand-neon'
                      : 'text-zinc-400 hover:bg-brand-dark hover:text-brand-neon border-transparent'
                  }`}
                  id={`sidebar-item-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono ${isActive ? 'text-black' : 'text-[#555]'}`}>{serialNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Box structured as highly technical monitoring panel */}
      <div className="p-4 border-t border-brand-border bg-brand-bg mt-auto">
        <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-3 px-2 font-black">// Sync Status</div>
        
        <div className="bg-[#111] p-4 border border-brand-border space-y-3 mb-4">
          <div className="flex items-center justify-between text-xs border-b border-brand-border pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-neon animate-pulse" />
              <span className="text-[9px] uppercase tracking-wide text-zinc-500 font-bold">STREAK</span>
            </div>
            <span className="text-brand-neon font-mono font-bold text-xs">{streakDays} DAYS</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#888]" />
              <span className="text-[9px] uppercase tracking-wide text-zinc-500 font-bold">SOLVED</span>
            </div>
            <span className="text-[#FFF] font-mono font-bold text-xs">{solvedCount} PROBS</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-[#444] uppercase px-1">
          <span className="flex items-center gap-1">
            🟢 SYSTEM ONLINE
          </span>
          <span>STABLE</span>
        </div>
      </div>
    </div>
  );
}
