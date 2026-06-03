/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ActiveView = 
  | 'onboarding' 
  | 'login' 
  | 'dashboard' 
  | 'labs' 
  | 'progress' 
  | 'ref' 
  | 'lesson-ppe' 
  | 'drill-quiz'
  | 'chat'
  | 'admin';

export type OnboardingStep = 1 | 2 | 3;

export type ThemeMode = 'light' | 'dark' | 'system';

export interface UserState {
  name: string;
  email: string;
  avatarUrl: string;
  level: number;
  xp: number;
  xpNextLevel: number;
  streakDays: number;
  unlockedBadges: string[]; // IDs
  labProgress: {
    chemistry: number; // percentage
    microbiology: number; // percentage
  };
  masteryScores: {
    general: number; // percentage
    biological: number; // percentage
    chemical: number; // percentage
    fire: number; // percentage
  };
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  duration: string;
  description: string;
  progress: number;
}

export interface ReferenceDocument {
  id: string;
  title: string;
  type: 'SDS' | 'SOP' | 'OSHA' | 'CDC' | 'MANUAL';
  description: string;
  version: string;
  date: string;
  internal: boolean;
  source: string;
  downloadable: boolean;
  url?: string;
  pdfUrl?: string;
}

export interface ScenarioQuestion {
  id: string;
  title: string;
  scenarioText: string;
  imageUrl: string;
  options: {
    id: string;
    text: string;
    explanation: string;
  }[];
  correctOptionId: string;
  standardCitation: string;
  dangerAlert?: {
    title: string;
    text: string;
  };
}
