/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { LayoutDashboard, BookOpen, Terminal, MessageSquare, Code, Flame, Award, Sun, Moon } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  streakDays: number;
  solvedCount: number;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export default function Sidebar({ activeTab, setActiveTab, streakDays, solvedCount, theme, setTheme }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', name: 'Bảng Điều Khiển', icon: LayoutDashboard, desc: 'Tổng quan tiến trình học tập' },
    { id: 'tutorial', name: 'Nhập Môn Lập Trình', icon: Code, desc: 'Học lập trình cơ bản cho người mới' },
    { id: 'problems', name: 'Kho Bài Tập LeetCode', icon: BookOpen, desc: 'Tìm kiếm, lọc & import đề' },
    { id: 'playground', name: 'Phòng Code Thử Nghiệm', icon: Terminal, desc: 'Trình biên soạn & giải thuật' },
    { id: 'ai', name: 'Góc Trợ Lý AI Mentor', icon: MessageSquare, desc: 'Giải thích, gợi ý & tối ưu' },
  ];

  return (
    <div className="w-64 bg-brand-panel border-r border-brand-border text-brand-text flex flex-col justify-between shrink-0 h-full select-none font-sans transition-all duration-300" id="sidebar-panel">
      {/* Brand Header with Theme Switcher inline */}
      <div>
        <div className="p-6 border-b border-brand-border flex items-center justify-between bg-brand-bg transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-brand-neon flex items-center justify-center transition-all duration-300 border border-brand-border">
              <span className="text-brand-neon-text font-black text-xl">C</span>
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-[0.15em] uppercase text-brand-neon transition-colors duration-300">LeetCoach</h1>
              <p className="text-[9px] text-brand-text-muted/60 tracking-[0.1em] uppercase font-mono italic">// Terminal Kernel</p>
            </div>
          </div>

          {/* Theme Toggler Switcher */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-1.5 border border-brand-border hover:border-brand-neon bg-brand-panel hover:bg-brand-dark text-brand-text hover:text-brand-neon cursor-pointer transition-all duration-200 rounded-none flex items-center justify-center shadow-[2px_2px_0_#000] dark:shadow-none"
            title={theme === 'dark' ? "Chuyển sang Giao diện Sáng (High Contrast)" : "Chuyển sang Giao diện Tối (Brutalist Dark)"}
            id="sidebar-theme-toggle"
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5" />
            ) : (
              <Moon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Navigation Section */}
        <div className="p-4 pt-6">
          <div className="text-[10px] text-brand-text-muted/70 uppercase tracking-[0.2em] mb-4 font-black px-2">// Core Modules</div>
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
                      ? 'bg-brand-neon text-brand-neon-text border-brand-neon shadow-[3px_3px_0_var(--brand-border)]'
                      : 'text-brand-text-muted hover:bg-brand-dark hover:text-brand-neon border-transparent'
                  }`}
                  id={`sidebar-item-${item.id}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  <span className={`text-[9px] font-mono ${isActive ? 'text-brand-neon-text' : 'text-brand-text-muted/40'}`}>{serialNum}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info Box structured as highly technical monitoring panel */}
      <div className="p-4 border-t border-brand-border bg-brand-bg mt-auto transition-colors duration-300">
        <div className="text-[10px] text-brand-text-muted/70 uppercase tracking-[0.2em] mb-3 px-2 font-black">// Sync Status</div>
        
        <div className="bg-brand-dark/60 p-4 border border-brand-border space-y-3 mb-4 transition-colors duration-300">
          <div className="flex items-center justify-between text-xs border-b border-brand-border pb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-brand-neon animate-pulse" />
              <span className="text-[9px] uppercase tracking-wide text-brand-text-muted font-bold">STREAK</span>
            </div>
            <span className="text-brand-neon font-mono font-bold text-xs">{streakDays} DAYS</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-text-muted" />
              <span className="text-[9px] uppercase tracking-wide text-brand-text-muted font-bold">SOLVED</span>
            </div>
            <span className="text-brand-text font-mono font-bold text-xs">{solvedCount} PROBS</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono text-brand-text-muted/60 uppercase px-1">
          <span className="flex items-center gap-1 font-bold">
            🟢 SYSTEM ONLINE
          </span>
          <span className="font-bold">STABLE</span>
        </div>
      </div>
    </div>
  );
}
