/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Todo' | 'In Progress' | 'Solved';

export interface LeetCodeProblem {
  id: string; // Unique ID (e.g. "1", "15", or generated "custom-1")
  title: string;
  difficulty: ProblemDifficulty;
  description: string;
  codeTemplate?: string;
  solution?: string;
  tags?: string[];
  url?: string;
  
  // User progress fields
  status: ProblemStatus;
  userCode?: string;
  language?: string;
  customNotes?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  lastSolvedAt?: string | null; // ISO Date String
  solvedCount: number;
}

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  solvedProblemIds: string[];
  minutesSpent: number;
  notes?: string;
}

export interface UserStats {
  streakDays: number;
  maxStreakDays: number;
  totalSubmissions: number;
  lastActiveDate: string | null; // YYYY-MM-DD
}

export interface ImportPreview {
  success: boolean;
  problems: Omit<LeetCodeProblem, 'status' | 'solvedCount'>[];
  duplicateCount: number;
  newCount: number;
  message: string;
}
