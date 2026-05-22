/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { Upload, FileCode, CheckCircle, AlertTriangle, FileSpreadsheet, FileText, HelpCircle } from 'lucide-react';
import { LeetCodeProblem, ProblemDifficulty } from '../types';

interface ImportPanelProps {
  onImportComplete: (importedProblems: LeetCodeProblem[]) => void;
  existingProblemsCount: number;
}

export default function ImportPanel({ onImportComplete, existingProblemsCount }: ImportPanelProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [importSummary, setImportSummary] = useState<{
    total: number;
    new: number;
    duplicates: number;
    byDifficulty: { Easy: number; Medium: number; Hard: number };
  } | null>(null);
  const [parsedProblems, setParsedProblems] = useState<LeetCodeProblem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag over action
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  // Helper function to standardise difficulty strings
  const parseDifficulty = (diffStr: string): ProblemDifficulty => {
    const clean = diffStr.toLowerCase().trim();
    if (clean.includes('easy') || clean.includes('dễ') || clean.includes('1')) return 'Easy';
    if (clean.includes('hard') || clean.includes('khó') || clean.includes('3')) return 'Hard';
    return 'Medium'; // Default to Medium
  };

  // Smart parser for text file formats (e.g. lists of links, titles)
  const parseTextFileContent = (text: string): LeetCodeProblem[] => {
    const lines = text.split('\n');
    const problems: LeetCodeProblem[] = [];
    let currentId = 1000;

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.length < 3) return;

      // Skip common markdown headers or metadata
      if (trimmed.startsWith('#') || trimmed.startsWith('//') || trimmed.startsWith('/*')) return;

      let id = String(currentId++);
      let title = trimmed;
      let difficulty: ProblemDifficulty = 'Medium';
      let url = '';
      let tags: string[] = [];

      // Check if it's a URL-only line
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
        url = trimmed;
        // Try to extract title from url like https://leetcode.com/problems/two-sum/
        const match = trimmed.match(/\/problems\/([^/]+)/);
        if (match && match[1]) {
          title = match[1]
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
        }
      } else {
        // Try to match patterns like: "1. Two Sum [Easy]" or "136 Single Number (Easy) - url" or "3Sum (Medium)"
        // Extract standard LeetCode numbers: "123. Title" or "123 Title"
        const numMatch = trimmed.match(/^(\d+)[\s.]+(.+)$/);
        if (numMatch) {
          id = numMatch[1];
          title = numMatch[2].trim();
        }

        // Search for difficulty indicator inside parentheses or brackets
        const diffMatch = title.match(/[[(](easy|medium|hard|dễ|trung bình|khó)[\])]/i);
        if (diffMatch) {
          difficulty = parseDifficulty(diffMatch[1]);
          title = title.replace(diffMatch[0], '').trim();
        } else {
          // Detect simple Vietnamese keyword
          if (title.toLowerCase().includes('dễ')) difficulty = 'Easy';
          if (title.toLowerCase().includes('khó')) difficulty = 'Hard';
        }

        // Check for trailing URLs
        const urlMatch = title.match(/(https?:\/\/[^\s]+)/);
        if (urlMatch) {
          url = urlMatch[1];
          title = title.replace(urlMatch[0], '').replace(/[-–—:|]+$/, '').trim();
        }
      }

      // Cleanup formatting
      title = title.replace(/^[-–—\s]+/, '').trim();
      if (title.length > 2) {
        problems.push({
          id,
          title,
          difficulty,
          description: `Bài tập này được import tự động từ danh sách của bạn.\n\nTên bài tập: **${title}**\nĐộ khó: **${difficulty}**.\n\nHãy bấm vào liên kết gốc bên dưới (nếu có) để giải, hoặc tự viết code vào khung soạn thảo bên cạnh để ôn tập và lưu tiến độ nhé!`,
          codeTemplate: "function solve() {\n    // Viết code giải thuật của bạn ở đây\n\n}",
          status: 'Todo',
          solvedCount: 0,
          url: url || undefined,
          tags: tags.length > 0 ? tags : ['Imported'],
          userCode: "function solve() {\n    // Viết code giải thuật của bạn ở đây\n\n}"
        });
      }
    });

    return problems;
  };

  // Smart parser for CSV file contents
  const parseCSVFileContent = (text: string): LeetCodeProblem[] => {
    // Basic CSV parser that handles quotes
    const lines: string[] = [];
    let currentLine = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === '\n' && !inQuotes) {
        lines.push(currentLine);
        currentLine = '';
      } else {
        currentLine += char;
      }
    }
    if (currentLine) lines.push(currentLine);

    if (lines.length < 2) return [];

    // Detect header mapping
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    
    const titleIdx = headers.findIndex(h => h.includes('title') || h.includes('tên') || h.includes('name'));
    const diffIdx = headers.findIndex(h => h.includes('diff') || h.includes('độ khó') || h.includes('level') || h.includes('difficulty'));
    const idIdx = headers.findIndex(h => h.includes('id') || h.includes('num') || h.includes('số') || h.includes('index'));
    const descIdx = headers.findIndex(h => h.includes('desc') || h.includes('mô tả') || h.includes('content') || h.includes('body'));
    const urlIdx = headers.findIndex(h => h.includes('url') || h.includes('link') || h.includes('href'));
    const tagsIdx = headers.findIndex(h => h.includes('tag') || h.includes('nhãn') || h.includes('category'));

    const problems: LeetCodeProblem[] = [];
    let serialId = 2000;

    for (let i = 1; i < lines.length; i++) {
      const row = lines[i];
      if (!row.trim()) continue;

      // Smart Split commas, respecting quotes
      const cells: string[] = [];
      let cell = '';
      let isCellInQuotes = false;
      for (let j = 0; j < row.length; j++) {
        const char = row[j];
        if (char === '"') {
          isCellInQuotes = !isCellInQuotes;
        } else if (char === ',' && !isCellInQuotes) {
          cells.push(cell.trim());
          cell = '';
        } else {
          cell += char;
        }
      }
      cells.push(cell.trim());

      const getVal = (idx: number, fallback: string = '') => {
        if (idx === -1 || idx >= cells.length) return fallback;
        return cells[idx].replace(/^"|"$/g, '').trim();
      };

      const title = getVal(titleIdx);
      if (!title) continue;

      const id = getVal(idIdx, String(serialId++));
      const difficulty = parseDifficulty(getVal(diffIdx, 'Medium'));
      const description = getVal(descIdx, `Mô tả bài toán **${title}**.\nĐộ khó: **${difficulty}**.`);
      const url = getVal(urlIdx);
      const rawTags = getVal(tagsIdx);
      const tags = rawTags ? rawTags.split(/[;|]/).map(t => t.trim()) : ['CSV-Imported'];

      problems.push({
        id,
        title,
        difficulty,
        description,
        url: url || undefined,
        tags,
        status: 'Todo',
        solvedCount: 0,
        codeTemplate: "function solve() {\n    // Viết code giải thuật của bạn ở đây\n\n}",
        userCode: "function solve() {\n    // Viết code giải thuật của bạn ở đây\n\n}"
      });
    }

    return problems;
  };

  // Main file processor
  const processFile = (file: File) => {
    setError(null);
    setImportSummary(null);

    const reader = new FileReader();
    const extension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        const textContent = e.target?.result as string;
        let importedList: LeetCodeProblem[] = [];

        if (extension === 'json') {
          let json = JSON.parse(textContent);
          
          // Handle { data: [...] } or { problems: [...] } structures
          if (!Array.isArray(json)) {
            if (json.problems && Array.isArray(json.problems)) {
              json = json.problems;
            } else if (json.data && Array.isArray(json.data)) {
              json = json.data;
            } else {
              throw new Error("Cấu trúc file JSON không được phản hồi dưới dạng danh sách mảng (array).");
            }
          }

          importedList = json.map((item: any, idx: number) => {
            const title = item.title || item.name || `Problem ${idx + 1}`;
            const id = String(item.id || item.number || item.index || (idx + 1));
            const difficulty = parseDifficulty(item.difficulty || item.level || 'Medium');
            const description = item.description || item.content || item.body || `Mô tả cho ${title}.`;
            return {
              id,
              title,
              difficulty,
              description,
              codeTemplate: item.codeTemplate || item.template || "function solve() {\n    // Viết code của bạn\n}",
              solution: item.solution || item.solutionCode || "",
              tags: Array.isArray(item.tags) ? item.tags : (item.tags ? [item.tags] : (item.category ? [item.category] : ['Imported'])),
              url: item.url || item.link || undefined,
              status: 'Todo',
              solvedCount: 0,
              userCode: item.codeTemplate || item.template || "function solve() {\n    // Viết code của bạn\n}"
            };
          });

        } else if (extension === 'csv') {
          importedList = parseCSVFileContent(textContent);
        } else {
          // Standard text parser fallback (.txt, .md, custom, etc)
          importedList = parseTextFileContent(textContent);
        }

        if (importedList.length === 0) {
          setError("Không tìm thấy dữ liệu bài tập lập trình hợp lệ nào trong tệp này. Vui lòng kiểm tra lại cấu trúc file.");
          return;
        }

        // Validate duplicates count logic
        // Get already stored items to compare duplication
        const existingDataStr = localStorage.getItem('leetcode_problems');
        let currentProblems: LeetCodeProblem[] = [];
        if (existingDataStr) {
          try {
            currentProblems = JSON.parse(existingDataStr);
          } catch(e) {}
        }

        const existingKeys = new Set(currentProblems.map(p => `${p.id}-${p.title.toLowerCase()}`));
        
        let newCount = 0;
        let dupCount = 0;
        const byDiff = { Easy: 0, Medium: 0, Hard: 0 };

        importedList.forEach(prob => {
          const key = `${prob.id}-${prob.title.toLowerCase()}`;
          if (existingKeys.has(key)) {
            dupCount++;
          } else {
            newCount++;
            byDiff[prob.difficulty]++;
          }
        });

        setParsedProblems(importedList);
        setImportSummary({
          total: importedList.length,
          new: newCount,
          duplicates: dupCount,
          byDifficulty: byDiff
        });

      } catch (err: any) {
        console.error("Error parsing file:", err);
        setError(`Lỗi phân tích file: ${err.message || "Vui lòng xem lại định dạng file bài leetcode."}`);
      }
    };

    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const confirmImport = () => {
    onImportComplete(parsedProblems);
    setImportSummary(null);
    setParsedProblems([]);
  };

  const cancelImport = () => {
    setImportSummary(null);
    setParsedProblems([]);
  };

  return (
    <div className="bg-brand-panel border border-brand-border p-6 rounded-none text-[#E0E0E0]" id="import-dashboard">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 border-b border-brand-border pb-3">
        <div>
          <h2 className="text-sm font-black text-white flex items-center gap-2 uppercase tracking-wide">
            <Upload className="w-5 h-5 text-brand-neon" />
            Nạp tệp thuật toán // Personal Archive Import
          </h2>
          <p className="text-[10.5px] text-zinc-500 font-mono uppercase mt-1 leading-normal">
            Hỗ trợ nạp tệp `.json`, `.csv`, `.txt`, hoặc `.md` chứa bộ đề thuật toán của riêng bạn.
          </p>
        </div>
      </div>

      {!importSummary ? (
        <div>
          <div
            className={`cursor-pointer border-2 border-dashed rounded-none p-10 flex flex-col items-center justify-center transition-all ${
              isDragActive
                ? 'border-brand-neon bg-brand-neon/10'
                : 'border-brand-border hover:border-brand-border-light bg-brand-dark/80 hover:bg-brand-dark'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            id="dropzone"
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".json,.csv,.txt,.md"
              onChange={handleFileInputChange}
            />

            <div className="w-12 h-12 bg-zinc-900 border border-brand-border rounded-none flex items-center justify-center mb-4">
              <Upload className="w-5 h-5 text-[#CCFF00] animate-pulse" />
            </div>

            <p className="font-extrabold text-[#FFF] text-xs uppercase tracking-wider">
              Kéo thả file đề bài của bạn vào đây hoặc <span className="text-[#CCFF00] hover:underline">Ấn chọn từ thiết bị</span>
            </p>
            <p className="text-[10px] text-zinc-500 mt-2 font-mono uppercase">
              // JSON / CSV / TXT / MD LISTS
            </p>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-950/20 text-red-400 rounded-none flex items-start gap-2.5 border border-red-900/30 text-xs">
              <AlertTriangle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Guide templates */}
          <div className="mt-6 pt-6 border-t border-brand-border">
            <h3 className="font-bold text-white text-xs uppercase tracking-wide flex items-center gap-1.5 mb-4">
              <HelpCircle className="w-4 h-4 text-brand-neon" />
              Hướng dẫn cấu trúc tệp dữ liệu mẫu:
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] font-mono">
              <div className="bg-brand-dark p-4 border border-brand-border rounded-none">
                <span className="flex items-center gap-1.5 font-bold text-white mb-2 uppercase">
                  <FileCode className="w-4 h-4 text-[#FFCC00]" /> TỆP JSON (Gợi ý)
                </span>
                <pre className="text-zinc-400 overflow-x-auto text-[9px] bg-black p-3.5 border border-brand-border">
{`[
  {
    "id": "1",
    "title": "Two Sum",
    "difficulty": "Easy",
    "description": "...",
    "url": "https://..."
  }
]`}
                </pre>
              </div>

              <div className="bg-brand-dark p-4 border border-brand-border rounded-none flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 font-bold text-white mb-2 uppercase">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> TỆP CSV
                  </span>
                  <p className="text-zinc-400 leading-relaxed">
                    Xây dựng bảng tính Excel/Sheets gồm 5 dòng thuộc tính đầu: <strong>id, title, difficulty, description, url</strong> rồi kết xuất ra file định dạng `.csv`.
                  </p>
                </div>
                <div className="text-[9px] text-[#FFCC00] mt-4 uppercase tracking-wider font-bold">// CƠ CHẾ PARSE THÔNG MINH</div>
              </div>

              <div className="bg-brand-dark p-4 border border-brand-border rounded-none flex flex-col justify-between">
                <div>
                  <span className="flex items-center gap-1.5 font-bold text-white mb-2 uppercase">
                    <FileText className="w-4 h-4 text-cyan-400" /> TỰ DO (.txt / .md)
                  </span>
                  <p className="text-zinc-400 leading-relaxed">
                    Chỉ gom mỗi dòng một bài kèm độ khó trong dấu ngoạc. Trình bóc tách sẽ tự bổ sung thông tin tự động!
                  </p>
                </div>
                <div className="bg-black p-2 border border-brand-border text-[9px] text-zinc-500 mt-3 truncate">
                  1. Reverse String [Easy] <br />
                  15. 3Sum [Medium]
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-brand-dark border border-brand-border p-5 rounded-none" id="import-preview-box">
          <div className="flex items-center gap-2 mb-4 border-b border-brand-border pb-3">
            <h4 className="font-bold text-brand-neon uppercase text-xs tracking-wider">
              Kiểm Tra Dữ Liệu Phân Tích Trước Khi Import
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4 font-mono">
            <div className="bg-brand-panel p-3.5 border border-brand-border text-center">
              <p className="text-[10px] text-zinc-500 font-bold uppercase">TỔNG QUÉT ĐƯỢC</p>
              <p className="text-xl font-black text-white mt-1">{importSummary.total}</p>
              <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Bài Toán</p>
            </div>
            
            <div className="bg-[#00FF66]/5 p-3.5 border border-[#00FF66]/20 text-center">
              <p className="text-[10px] text-emerald-400 font-bold uppercase">CÓ THỂ IMPORT</p>
              <p className="text-xl font-black text-emerald-300 mt-1">+{importSummary.new}</p>
              <p className="text-[9px] text-[#00FF66]/60 uppercase mt-0.5">Bài mới tinh</p>
            </div>

            <div className="bg-brand-panel p-3.5 border border-brand-border text-center">
              <p className="text-[10px] text-zinc-550 font-bold uppercase">TRÙNG BỊ LOẠI</p>
              <p className="text-xl font-black text-zinc-400 mt-1">{importSummary.duplicates}</p>
              <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Đã thuộc thư viện</p>
            </div>

            <div className="bg-[#CCFF00]/5 p-3.5 border border-[#CCFF00]/10 text-center">
              <p className="text-[10px] text-brand-neon font-bold uppercase">SẴN CÓ TRƯỚC</p>
              <p className="text-xl font-black text-brand-neon mt-1">{existingProblemsCount}</p>
              <p className="text-[9px] text-zinc-500 uppercase mt-0.5">Trong Archive</p>
            </div>
          </div>

          <div className="bg-brand-panel p-4 border border-brand-border mb-5 text-[11px] font-mono text-zinc-400">
            <h5 className="font-bold text-white mb-2 uppercase tracking-wide">// Độ khó các bài mới phân giải được:</h5>
            <div className="flex gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                DỄ: <strong className="text-[#00FF66]">{importSummary.byDifficulty.Easy}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                VỪA: <strong className="text-[#FFCC00]">{importSummary.byDifficulty.Medium}</strong>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-400"></span>
                KHÓ: <strong className="text-[#FF3366]">{importSummary.byDifficulty.Hard}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={cancelImport}
              className="px-4 py-2 bg-brand-panel border border-brand-border text-zinc-400 text-xs font-black uppercase tracking-wider rounded-none hover:bg-brand-dark transition-colors cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              onClick={confirmImport}
              className="px-4 py-2 bg-brand-neon text-black text-xs font-black uppercase tracking-wider rounded-none flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
              disabled={importSummary.new === 0}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Nạp ngay ({importSummary.new})</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
