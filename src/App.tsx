/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LeetCodeProblem, DailyActivity, UserStats } from './types';
import { DEFAULT_PROBLEMS } from './defaultProblems';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProblemList from './components/ProblemList';
import Playground from './components/Playground';
import AILounge from './components/AILounge';
import Tutorial from './components/Tutorial';
import { Activity, CircleCheck, Info, Flame, Trophy } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [problems, setProblems] = useState<LeetCodeProblem[]>([]);
  const [activityLogs, setActivityLogs] = useState<DailyActivity[]>([]);
  
  // Stats
  const [streakDays, setStreakDays] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  
  // Selected Problem for coding playground
  const [selectedProblem, setSelectedProblem] = useState<LeetCodeProblem | null>(null);

  // Success notify popup state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Load data on boot
  useEffect(() => {
    // 1. Load problems database
    const localProbs = localStorage.getItem('leetcode_problems');
    if (localProbs) {
      try {
        const loaded: LeetCodeProblem[] = JSON.parse(localProbs);
        
        // Self-heal: Sanitize any duplicate or empty IDs in existing database
        const uniqueLoaded: LeetCodeProblem[] = [];
        const seenIds = new Set<string>();
        let maxId = 1000;

        // First find the maximum numeric ID
        loaded.forEach(p => {
          const num = parseInt(p.id, 10);
          if (!isNaN(num) && num > maxId) {
            maxId = num;
          }
        });

        loaded.forEach(prob => {
          let cleanId = prob.id;
          if (!cleanId || cleanId.trim() === "" || seenIds.has(cleanId)) {
            maxId++;
            cleanId = String(maxId);
          }
          seenIds.add(cleanId);
          uniqueLoaded.push({
            ...prob,
            id: cleanId
          });
        });

        // Smart merge: Include all 102 beautiful practice tasks to saved database if missing
        DEFAULT_PROBLEMS.forEach(item => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            uniqueLoaded.push(item);
          }
        });

        setProblems(uniqueLoaded);
        localStorage.setItem('leetcode_problems', JSON.stringify(uniqueLoaded));
      } catch (e) {
        console.error("Failed to parse problems, using defaults", e);
        setProblems(DEFAULT_PROBLEMS);
        localStorage.setItem('leetcode_problems', JSON.stringify(DEFAULT_PROBLEMS));
      }
    } else {
      setProblems(DEFAULT_PROBLEMS);
      localStorage.setItem('leetcode_problems', JSON.stringify(DEFAULT_PROBLEMS));
    }

    // 2. Load activity logs
    const localLogs = localStorage.getItem('leetcode_activity_logs');
    if (localLogs) {
      try {
        setActivityLogs(JSON.parse(localLogs));
      } catch (e) {
        console.error("Failed to parse activity logs", e);
        setActivityLogs([]);
      }
    } else {
      setActivityLogs([]);
      localStorage.setItem('leetcode_activity_logs', JSON.stringify([]));
    }

    // 3. Load streak records
    const localStreakObj = localStorage.getItem('leetcode_user_stats');
    if (localStreakObj) {
      try {
        const stats: UserStats = JSON.parse(localStreakObj);
        setStreakDays(stats.streakDays || 0);
        setMaxStreak(stats.maxStreakDays || 0);
      } catch (e) {
        console.error("Failed to parse user statistics", e);
      }
    } else {
      // Setup draft stats
      const draftStats: UserStats = {
        streakDays: 0,
        maxStreakDays: 0,
        totalSubmissions: 0,
        lastActiveDate: null
      };
      localStorage.setItem('leetcode_user_stats', JSON.stringify(draftStats));
    }
  }, []);

  // Sync state helpers
  const triggerNotification = (message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // 1. Update LeetCode Problem progress
  const handleUpdateProblem = (updatedProblem: LeetCodeProblem) => {
    const updatedList = problems.map((prob) => 
      prob.id === updatedProblem.id ? updatedProblem : prob
    );
    setProblems(updatedList);
    localStorage.setItem('leetcode_problems', JSON.stringify(updatedList));

    // Update active selected as well
    if (selectedProblem && selectedProblem.id === updatedProblem.id) {
      setSelectedProblem(updatedProblem);
    }

    triggerNotification(`Đã cập nhật tiến độ bài #${updatedProblem.id}: ${updatedProblem.title}!`, 'success');
  };

  // 2. Bulk import newly parsed list
  const handleImportComplete = (imported: LeetCodeProblem[]) => {
    // Keep track of all used IDs to ensure absolute uniqueness
    const usedIds = new Set(problems.map(p => p.id));
    
    // Track titles to detect exactly duplicated problems
    const existingTitles = new Set(problems.map(p => p.title.toLowerCase()));

    const newProblems: LeetCodeProblem[] = [];
    let dupsCount = 0;

    imported.forEach((prob) => {
      const titleLower = prob.title.toLowerCase();
      
      // If we already have this problem under the exact same title, treat as duplicates
      if (existingTitles.has(titleLower)) {
        dupsCount++;
        return;
      }

      // Check if ID is empty, undefined, or already in use
      let uniqueId = prob.id;
      if (!uniqueId || uniqueId.trim() === "" || usedIds.has(uniqueId)) {
        // Dynamically find next available numeric ID
        let maxNumericId = 1000;
        problems.forEach(p => {
          const num = parseInt(p.id, 10);
          if (!isNaN(num) && num > maxNumericId) {
            maxNumericId = num;
          }
        });
        newProblems.forEach(p => {
          const num = parseInt(p.id, 10);
          if (!isNaN(num) && num > maxNumericId) {
            maxNumericId = num;
          }
        });
        uniqueId = String(maxNumericId + 1);
      }

      // Mark ID and title as used
      usedIds.add(uniqueId);
      existingTitles.add(titleLower);

      newProblems.push({
        ...prob,
        id: uniqueId
      });
    });

    if (newProblems.length > 0) {
      const mergedList = [...problems, ...newProblems];
      setProblems(mergedList);
      localStorage.setItem('leetcode_problems', JSON.stringify(mergedList));
      triggerNotification(`Nhập thành công +${newProblems.length} bài toán thuật giải mới vào thư viện cá nhân!`, 'success');
    } else {
      triggerNotification(`Không tìm thấy bài mới. Đã bỏ qua ${dupsCount} bài trùng tên trong file.`, 'info');
    }
  };

  // 3. Log a new session activity to compile GitHub-style heat-map streak counters
  const handleAddActivityLog = (problemId: string, minutes: number, noteDesc: string) => {
    const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Add activity history log
    let updatedLogs = [...activityLogs];
    const existingLogIdx = updatedLogs.findIndex(log => log.date === todayStr);

    if (existingLogIdx >= 0) {
      const currentLog = updatedLogs[existingLogIdx];
      if (!currentLog.solvedProblemIds.includes(problemId)) {
        currentLog.solvedProblemIds.push(problemId);
      }
      currentLog.minutesSpent += minutes;
      currentLog.notes = noteDesc;
      updatedLogs[existingLogIdx] = currentLog;
    } else {
      updatedLogs.push({
        date: todayStr,
        solvedProblemIds: [problemId],
        minutesSpent: minutes,
        notes: noteDesc
      });
    }

    setActivityLogs(updatedLogs);
    localStorage.setItem('leetcode_activity_logs', JSON.stringify(updatedLogs));

    // Calculate/update streak
    const localStatsStr = localStorage.getItem('leetcode_user_stats');
    let stats: UserStats = {
      streakDays: 0,
      maxStreakDays: 0,
      totalSubmissions: 0,
      lastActiveDate: null
    };

    if (localStatsStr) {
      try {
        stats = JSON.parse(localStatsStr);
      } catch (e) {}
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let newStreak = stats.streakDays;
    
    if (stats.lastActiveDate === yesterdayStr) {
      // Converted consecutively
      newStreak += 1;
    } else if (stats.lastActiveDate === todayStr) {
      // Already active today, streak stays the same
    } else {
      // Broke streak, start anew
      newStreak = 1;
    }

    stats.streakDays = newStreak;
    if (newStreak > stats.maxStreakDays) {
      stats.maxStreakDays = newStreak;
    }
    stats.lastActiveDate = todayStr;
    stats.totalSubmissions += 1;

    setStreakDays(stats.streakDays);
    setMaxStreak(stats.maxStreakDays);
    localStorage.setItem('leetcode_user_stats', JSON.stringify(stats));
  };

  // 4. Wipe history database clean and restore fresh standard set
  const handleClearDatabase = () => {
    localStorage.removeItem('leetcode_problems');
    localStorage.removeItem('leetcode_activity_logs');
    localStorage.removeItem('leetcode_user_stats');

    setProblems(DEFAULT_PROBLEMS);
    setActivityLogs([]);
    setStreakDays(0);
    setMaxStreak(0);
    setSelectedProblem(null);
    setActiveTab('dashboard');

    // Stats draft reset
    const draftStats: UserStats = {
      streakDays: 0,
      maxStreakDays: 0,
      totalSubmissions: 0,
      lastActiveDate: null
    };
    
    localStorage.setItem('leetcode_problems', JSON.stringify(DEFAULT_PROBLEMS));
    localStorage.setItem('leetcode_activity_logs', JSON.stringify([]));
    localStorage.setItem('leetcode_user_stats', JSON.stringify(draftStats));

    triggerNotification("Đã dọn dẹp bộ nhớ và phục hồi danh sách 6 bài LeetCode kinh điển mặc định thành công!", "info");
  };

  // Fast select and launch playground
  const handleSelectProblem = (prob: LeetCodeProblem) => {
    setSelectedProblem(prob);
    setActiveTab('playground');
  };

  const solvedCount = problems.filter(p => p.status === 'Solved').length;

  return (
    <div className="flex h-screen bg-brand-bg font-sans text-[#E0E0E0] overflow-hidden" id="dashboard-app-frame">
      {/* Sidebar navigation control */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        streakDays={streakDays}
        solvedCount={solvedCount}
      />

      {/* Main content body panel */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative bg-brand-bg">
        
        {/* Navigation / Notification overlay alert bar */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`absolute top-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-none border text-xs font-bold uppercase tracking-widest shadow-[4px_4px_0_#000] ${
                notification.type === 'success' 
                  ? 'bg-brand-neon text-black border-brand-neon' 
                  : 'bg-white text-black border-white'
              }`}
            >
              {notification.type === 'success' ? (
                <CircleCheck className="w-4 h-4 text-black shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-black shrink-0" />
              )}
              <span>{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Inner Tab container with animations */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 bg-brand-bg">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <Dashboard 
                  problems={problems}
                  activityLogs={activityLogs}
                  streakDays={streakDays}
                  maxStreak={maxStreak}
                  onSelectProblem={handleSelectProblem}
                />
              </motion.div>
            )}

            {activeTab === 'problems' && (
              <motion.div
                key="problems"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <ProblemList 
                  problems={problems}
                  onImportComplete={handleImportComplete}
                  onSelectProblem={handleSelectProblem}
                  onClearDatabase={handleClearDatabase}
                />
              </motion.div>
            )}

            {activeTab === 'playground' && (
              <motion.div
                key="playground"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
                className="h-full"
              >
                <Playground 
                  problem={selectedProblem}
                  onUpdateProblem={handleUpdateProblem}
                  onAddActivityLog={handleAddActivityLog}
                />
              </motion.div>
            )}

            {activeTab === 'ai' && (
              <motion.div
                key="ai"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <AILounge />
              </motion.div>
            )}

            {activeTab === 'tutorial' && (
              <motion.div
                key="tutorial"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15 }}
              >
                <Tutorial />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
