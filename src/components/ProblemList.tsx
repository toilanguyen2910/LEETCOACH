/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LeetCodeProblem, ProblemDifficulty, ProblemStatus } from '../types';
import ImportPanel from './ImportPanel';
import { Search, Filter, BookOpen, ExternalLink, Code2, PlusCircle, CheckCircle2, Circle, RefreshCw, X } from 'lucide-react';

interface ProblemListProps {
  problems: LeetCodeProblem[];
  onImportComplete: (importedProblems: LeetCodeProblem[]) => void;
  onSelectProblem: (problem: LeetCodeProblem) => void;
  onClearDatabase: () => void;
}

export default function ProblemList({ problems, onImportComplete, onSelectProblem, onClearDatabase }: ProblemListProps) {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<ProblemDifficulty | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus | 'All'>('All');
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [showImporter, setShowImporter] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  // Extract all unique tags for filter option
  const allTags = Array.from(
    new Set(problems.flatMap((p) => p.tags || []))
  ).sort();

  // Filter problems based on inputs
  const filteredProblems = problems.filter((prob) => {
    const matchesSearch = prob.title.toLowerCase().includes(search.toLowerCase()) || 
                          prob.id.includes(search) ||
                          (prob.description && prob.description.toLowerCase().includes(search.toLowerCase()));
    
    const matchesDifficulty = selectedDifficulty === 'All' || prob.difficulty === selectedDifficulty;
    const matchesStatus = selectedStatus === 'All' || prob.status === selectedStatus;
    const matchesTag = selectedTag === 'All' || (prob.tags && prob.tags.includes(selectedTag));

    return matchesSearch && matchesDifficulty && matchesStatus && matchesTag;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="problem-list-container">
      {/* Search and Filters Header */}
      <div className="bg-brand-panel border border-brand-border p-6 shadow-[3px_3px_0_var(--color-brand-border-val)] space-y-4">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h2 className="text-sm font-black text-brand-text flex items-center gap-2 uppercase tracking-wider">
              <BookOpen className="w-5 h-5 text-brand-neon" />
              Thư Viện Bài Lập Trình ({problems.length} Bài)
            </h2>
            <p className="text-[10px] text-brand-text-muted uppercase font-mono tracking-tight mt-1">// Quản lý, tìm lọc bộ đề & nạp thêm cấu trúc bên ngoài.</p>
          </div>
          
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setShowImporter(!showImporter)}
              className={`px-4 py-2.5 text-[10px] font-black uppercase tracking-wider border rounded-none flex items-center gap-1.5 transition-all cursor-pointer ${
                showImporter 
                  ? 'bg-brand-dark text-brand-neon border-brand-neon' 
                  : 'bg-brand-neon text-brand-neon-text border-brand-neon hover:bg-brand-text hover:text-brand-panel'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{showImporter ? 'Đóng panel import' : 'Import danh sách'}</span>
            </button>

            <button
              onClick={() => setShowConfirmClear(true)}
              className="px-3.5 py-2.5 text-[10px] font-black uppercase tracking-wider border border-red-500/40 text-red-400 hover:bg-red-500/10 rounded-none transition-all cursor-pointer"
            >
              Đặt lại dữ liệu
            </button>
          </div>
        </div>

        {/* Clear Library Dialog */}
        {showConfirmClear && (
          <div className="bg-red-500/5 border border-red-500/20 text-red-200 p-4 rounded-none flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 animate-ping"></span>
              <div>
                <strong className="font-bold uppercase text-red-400 text-[11px] tracking-wide">Xác Nhận Xoá Sạch Bộ Nhớ?</strong>
                <p className="text-zinc-400 mt-0.5 text-[11px]">Hành động này sẽ khôi phục 6 bài LeetCode kinh điển mặc định ban đầu và dọn dẹp các tệp đã nạp.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => { onClearDatabase(); setShowConfirmClear(false); }} 
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-[10px] uppercase rounded-none cursor-pointer"
              >
                Xóa Vĩnh Viễn
              </button>
              <button 
                onClick={() => setShowConfirmClear(false)} 
                className="px-3 py-1.5 bg-brand-dark border border-brand-border text-zinc-400 font-bold text-[10px] uppercase rounded-none hover:text-white cursor-pointer"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}

        {/* Collapsible Importer Panel */}
        {showImporter && (
          <div className="border border-dashed border-brand-neon bg-brand-neon/5 rounded-none p-4.5">
            <ImportPanel 
              onImportComplete={(probs) => {
                onImportComplete(probs);
                setShowImporter(false);
              }}
              existingProblemsCount={problems.length}
            />
          </div>
        )}

        {/* Search Input and Filters selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {/* Text Search container */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Gõ mã số hoặc tên bài..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-10 pr-8 py-2.5 rounded-none border border-brand-border focus:outline-none focus:border-brand-neon bg-brand-dark text-brand-text placeholder-zinc-500 font-mono"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-3.5 hover:text-white text-zinc-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Difficulty */}
          <div className="relative">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as any)}
              className="w-full text-xs pl-3.5 pr-8 py-2.5 rounded-none border border-brand-border focus:outline-none focus:border-brand-neon bg-brand-dark text-brand-text appearance-none font-mono cursor-pointer"
            >
              <option value="All">TẤT CẢ ĐỘ KHÓ</option>
              <option value="Easy">EASY (DỄ)</option>
              <option value="Medium">MEDIUM (TRUNG BÌNH)</option>
              <option value="Hard">HARD (KHÓ)</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-brand-text-muted/65">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Filter Status */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full text-xs pl-3.5 pr-8 py-2.5 rounded-none border border-brand-border focus:outline-none focus:border-brand-neon bg-brand-dark text-brand-text appearance-none font-mono cursor-pointer"
            >
              <option value="All">TẤT CẢ TRẠNG THÁI</option>
              <option value="Todo">CHƯA LÀM (TODO)</option>
              <option value="In Progress">ĐANG GIẢI</option>
              <option value="Solved">ĐÃ HOÀN THÀNH</option>
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-brand-text-muted/65">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Filter Tags */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="w-full text-xs pl-3.5 pr-8 py-2.5 rounded-none border border-brand-border focus:outline-none focus:border-brand-neon bg-brand-dark text-brand-text appearance-none font-mono cursor-pointer"
            >
              <option value="All">🏷️ CHỦ ĐỀ: TẤT CẢ</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag.toUpperCase()}</option>
              ))}
            </select>
            <div className="absolute right-3.5 top-3.5 pointer-events-none text-brand-text-muted/65">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Problems List Grid Table views */}
      <div className="bg-brand-panel border border-brand-border rounded-none overflow-hidden shadow-[4px_4px_0px_var(--color-brand-border-val)]" id="problems-table">
        {filteredProblems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-brand-dark border-b border-brand-border text-[10px] font-black text-brand-text-muted/80 select-none uppercase tracking-widest font-mono">
                  <th className="py-4 px-6 w-24">MÃ SỐ</th>
                  <th className="py-4 px-4 min-w-[200px]">TÊN BÀI ÔN LUYỆN</th>
                  <th className="py-4 px-4 w-32 text-center">ĐỘ KHÓ</th>
                  <th className="py-4 px-4">CHỦ ĐỀ</th>
                  <th className="py-4 px-4 w-32 text-center">ĐÃ GIẢI</th>
                  <th className="py-4 px-6 w-32 text-right">ÔN LUYỆN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-border text-xs text-brand-text">
                {filteredProblems.map((prob) => {
                  return (
                    <tr 
                      key={prob.id} 
                      className="hover:bg-brand-dark/50 transition-colors group"
                    >
                      {/* ID with status marker */}
                      <td className="py-4 px-6 font-bold font-mono text-brand-text-muted">
                        <div className="flex items-center gap-2">
                          {prob.status === 'Solved' ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" title="Đã giải xong" />
                          ) : prob.status === 'In Progress' ? (
                            <RefreshCw className="w-4 h-4 text-amber-500 dark:text-amber-400 shrink-0 stroke-[2.5px] animate-spin" title="Đang ôn giải" />
                          ) : (
                            <Circle className="w-4 h-4 text-brand-text-muted/40 shrink-0" title="Chưa làm" />
                          )}
                          <span>#{prob.id}</span>
                        </div>
                      </td>

                      {/* Title */}
                      <td className="py-4 px-4 text-brand-text">
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => onSelectProblem(prob)}
                            className="hover:text-brand-neon hover:underline text-left leading-normal font-extrabold uppercase tracking-tight cursor-pointer"
                          >
                            {prob.title}
                          </button>
                          
                          {prob.url && (
                            <a
                              href={prob.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-650 hover:text-brand-neon p-0.5 inline-block md:opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Mở đề bài gốc"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                        {prob.lastSolvedAt && (
                          <p className="text-[9.5px] text-zinc-550 font-mono uppercase mt-1 leading-none">
                            // last solved: {new Date(prob.lastSolvedAt).toLocaleDateString('vi')}
                          </p>
                        )}
                      </td>

                      {/* Difficulty pill */}
                      <td className="py-4 px-4 text-center">
                        <span className={`inline-block text-[9px] font-mono font-black tracking-wider px-2 py-0.5 border ${
                          prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20' :
                          prob.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20'
                        }`}>
                          {prob.difficulty.toUpperCase()}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-4 px-4">
                        <div className="flex flex-wrap gap-1">
                          {prob.tags && prob.tags.length > 0 ? (
                            prob.tags.slice(0, 3).map((tag, idx) => (
                              <span 
                                key={idx}
                                className="text-[9.5px] font-mono bg-brand-dark text-brand-text-muted/80 px-2 py-0.5 border border-brand-border max-w-[110px] truncate"
                              >
                                //{tag.toLowerCase()}
                              </span>
                            ))
                          ) : (
                            <span className="text-brand-text-muted/50">-</span>
                          )}
                        </div>
                      </td>

                      {/* Solved count */}
                      <td className="py-4 px-4 text-center font-mono text-brand-text-muted font-bold">
                        {prob.solvedCount || 0}x
                      </td>

                      {/* Action trigger button */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => onSelectProblem(prob)}
                          className={`px-3.5 py-1.5 rounded-none text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 ml-auto transition-all cursor-pointer ${
                            prob.status === 'Solved' 
                              ? 'bg-brand-dark border border-brand-border hover:text-brand-neon hover:border-brand-neon text-brand-text-muted' 
                              : 'bg-brand-neon text-brand-neon-text hover:bg-brand-text hover:text-brand-panel border border-brand-neon'
                          }`}
                        >
                          <Code2 className="w-3.5 h-3.5" />
                          <span>{prob.status === 'Solved' ? 'Xem lại' : 'Luyện tập'}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-zinc-500 flex flex-col items-center">
            <BookOpen className="w-12 h-12 text-zinc-700 mb-3 animate-pulse" />
            <p className="text-xs font-bold uppercase tracking-wider text-white">Không có dữ liệu phù hợp</p>
            <p className="text-[10.5px] text-zinc-600 font-mono mt-1">// Thử tinh chỉnh bộ lọc hoặc nhập file JSON khác.</p>
          </div>
        )}
      </div>
    </div>
  );
}
