import React, { useState, useEffect, useRef } from 'react';
import './styles.css';

const VAPID_PUBLIC_KEY = 'BFqLbcfwvD3Ts4skm1PP0_NnBpifX4zxiFgb65MfL3_oZwyV4HkPqVOD0HLKLYQPOExdpM3Ky-vzUOa--K_-dI0';
const SUPABASE_URL = 'https://kkwcaftgaompuhdkgacg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtrd2NhZnRnYW9tcHVoZGtnYWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwNDE1MDEsImV4cCI6MjA5NTYxNzUwMX0.5GqFBbpw4uiv_rHawQvxngkfvexKwrXbmgrlWJR-83k';

const supabaseRequest = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Prefer': 'return=representation',
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

// ── XP & LEVELS ──
const LEVELS = [
  { level: 1,   xp: 0,      title: 'Beginner' },
  { level: 2,   xp: 60,     title: 'Beginner' },
  { level: 3,   xp: 130,    title: 'Beginner' },
  { level: 4,   xp: 210,    title: 'Novice' },
  { level: 5,   xp: 300,    title: 'Novice' },
  { level: 6,   xp: 400,    title: 'Novice' },
  { level: 7,   xp: 510,    title: 'Novice' },
  { level: 8,   xp: 630,    title: 'Apprentice' },
  { level: 9,   xp: 760,    title: 'Apprentice' },
  { level: 10,  xp: 900,    title: 'Apprentice' },
  { level: 11,  xp: 1050,   title: 'Apprentice' },
  { level: 12,  xp: 1210,   title: 'Intermediate' },
  { level: 13,  xp: 1380,   title: 'Intermediate' },
  { level: 14,  xp: 1560,   title: 'Intermediate' },
  { level: 15,  xp: 1750,   title: 'Intermediate' },
  { level: 16,  xp: 1950,   title: 'Intermediate' },
  { level: 17,  xp: 2160,   title: 'Trained' },
  { level: 18,  xp: 2380,   title: 'Trained' },
  { level: 19,  xp: 2610,   title: 'Trained' },
  { level: 20,  xp: 2850,   title: 'Trained' },
  { level: 21,  xp: 3100,   title: 'Trained' },
  { level: 22,  xp: 3360,   title: 'Advanced' },
  { level: 23,  xp: 3630,   title: 'Advanced' },
  { level: 24,  xp: 3910,   title: 'Advanced' },
  { level: 25,  xp: 4200,   title: 'Advanced' },
  { level: 26,  xp: 4500,   title: 'Advanced' },
  { level: 27,  xp: 4810,   title: 'Skilled' },
  { level: 28,  xp: 5130,   title: 'Skilled' },
  { level: 29,  xp: 5460,   title: 'Skilled' },
  { level: 30,  xp: 5800,   title: 'Skilled' },
  { level: 31,  xp: 6150,   title: 'Skilled' },
  { level: 32,  xp: 6510,   title: 'Expert' },
  { level: 33,  xp: 6880,   title: 'Expert' },
  { level: 34,  xp: 7260,   title: 'Expert' },
  { level: 35,  xp: 7650,   title: 'Expert' },
  { level: 36,  xp: 8050,   title: 'Expert' },
  { level: 37,  xp: 8460,   title: 'Veteran' },
  { level: 38,  xp: 8880,   title: 'Veteran' },
  { level: 39,  xp: 9310,   title: 'Veteran' },
  { level: 40,  xp: 9750,   title: 'Veteran' },
  { level: 41,  xp: 10200,  title: 'Veteran' },
  { level: 42,  xp: 10660,  title: 'Elite' },
  { level: 43,  xp: 11130,  title: 'Elite' },
  { level: 44,  xp: 11610,  title: 'Elite' },
  { level: 45,  xp: 12100,  title: 'Elite' },
  { level: 46,  xp: 12600,  title: 'Elite' },
  { level: 47,  xp: 13110,  title: 'Champion' },
  { level: 48,  xp: 13630,  title: 'Champion' },
  { level: 49,  xp: 14160,  title: 'Champion' },
  { level: 50,  xp: 14700,  title: 'Champion' },
  { level: 51,  xp: 15250,  title: 'Champion' },
  { level: 52,  xp: 15810,  title: 'Master' },
  { level: 53,  xp: 16380,  title: 'Master' },
  { level: 54,  xp: 16960,  title: 'Master' },
  { level: 55,  xp: 17550,  title: 'Master' },
  { level: 56,  xp: 18150,  title: 'Master' },
  { level: 57,  xp: 18760,  title: 'Grand Master' },
  { level: 58,  xp: 19380,  title: 'Grand Master' },
  { level: 59,  xp: 20010,  title: 'Grand Master' },
  { level: 60,  xp: 20650,  title: 'Grand Master' },
  { level: 61,  xp: 21300,  title: 'Grand Master' },
  { level: 62,  xp: 21960,  title: 'Titan' },
  { level: 63,  xp: 22630,  title: 'Titan' },
  { level: 64,  xp: 23310,  title: 'Titan' },
  { level: 65,  xp: 24000,  title: 'Titan' },
  { level: 66,  xp: 24700,  title: 'Titan' },
  { level: 67,  xp: 25410,  title: 'Deity' },
  { level: 68,  xp: 26130,  title: 'Deity' },
  { level: 69,  xp: 26860,  title: 'Deity' },
  { level: 70,  xp: 27600,  title: 'Deity' },
  { level: 71,  xp: 28350,  title: 'Deity' },
  { level: 72,  xp: 29110,  title: 'Immortal' },
  { level: 73,  xp: 29880,  title: 'Immortal' },
  { level: 74,  xp: 30660,  title: 'Immortal' },
  { level: 75,  xp: 31450,  title: 'Immortal' },
  { level: 76,  xp: 32250,  title: 'Immortal' },
  { level: 77,  xp: 33060,  title: 'Ascended' },
  { level: 78,  xp: 33880,  title: 'Ascended' },
  { level: 79,  xp: 34710,  title: 'Ascended' },
  { level: 80,  xp: 35550,  title: 'Ascended' },
  { level: 81,  xp: 36400,  title: 'Ascended' },
  { level: 82,  xp: 37260,  title: 'Mythic' },
  { level: 83,  xp: 38130,  title: 'Mythic' },
  { level: 84,  xp: 39010,  title: 'Mythic' },
  { level: 85,  xp: 39900,  title: 'Mythic' },
  { level: 86,  xp: 40800,  title: 'Mythic' },
  { level: 87,  xp: 41710,  title: 'Transcendent' },
  { level: 88,  xp: 42630,  title: 'Transcendent' },
  { level: 89,  xp: 43560,  title: 'Transcendent' },
  { level: 90,  xp: 44500,  title: 'Transcendent' },
  { level: 91,  xp: 45450,  title: 'Transcendent' },
  { level: 92,  xp: 46410,  title: 'Eternal' },
  { level: 93,  xp: 47380,  title: 'Eternal' },
  { level: 94,  xp: 48360,  title: 'Eternal' },
  { level: 95,  xp: 49350,  title: 'Eternal' },
  { level: 96,  xp: 50350,  title: 'Eternal' },
  { level: 97,  xp: 51360,  title: 'Legend' },
  { level: 98,  xp: 52380,  title: 'Legend' },
  { level: 99,  xp: 53410,  title: 'Legend' },
  { level: 100, xp: 54450,  title: 'Legend' },
];

const XP_REWARDS = {
  SET_COMPLETE: 5,
  WORKOUT_COMPLETE: 50,
  ALL_TIME_PR: 100,
  FIRST_WORKOUT: 100,
  STREAK_7: 200,
  STREAK_30: 500,
};

const getLevelFromXP = (xp) => {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.xp) current = level;
    else break;
  }
  const nextLevel = LEVELS.find(l => l.xp > xp);
  const progress = nextLevel ? ((xp - current.xp) / (nextLevel.xp - current.xp)) * 100 : 100;
  return { ...current, nextLevel, progress, xp };
};

// ── TIERED ACHIEVEMENTS ──
const ACHIEVEMENT_DEFINITIONS = [
  {
    id: 'workouts', icon: '🏋️', name: 'Workout Warrior',
    tiers: [
      { goal: 1,   label: 'Complete 1 workout',    xp: 100 },
      { goal: 5,   label: 'Complete 5 workouts',   xp: 150 },
      { goal: 10,  label: 'Complete 10 workouts',  xp: 200 },
      { goal: 25,  label: 'Complete 25 workouts',  xp: 300 },
      { goal: 50,  label: 'Complete 50 workouts',  xp: 400 },
      { goal: 100, label: 'Complete 100 workouts', xp: 500 },
      { goal: 250, label: 'Complete 250 workouts', xp: 750 },
      { goal: 500, label: 'Complete 500 workouts', xp: 1000 },
    ],
    getValue: (workoutHistory) => workoutHistory.length,
  },
  {
    id: 'prs', icon: '🏆', name: 'Personal Records',
    tiers: [
      { goal: 1,   label: 'Hit 1 all-time PR',    xp: 100 },
      { goal: 5,   label: 'Hit 5 all-time PRs',   xp: 150 },
      { goal: 10,  label: 'Hit 10 all-time PRs',  xp: 200 },
      { goal: 25,  label: 'Hit 25 all-time PRs',  xp: 300 },
      { goal: 50,  label: 'Hit 50 all-time PRs',  xp: 400 },
      { goal: 100, label: 'Hit 100 all-time PRs', xp: 500 },
    ],
    getValue: (workoutHistory, globalPRHistory) =>
      Object.values(globalPRHistory).reduce((a, s) => a + s.length, 0),
  },
  {
    id: 'sets', icon: '💪', name: 'Set Machine',
    tiers: [
      { goal: 10,    label: 'Complete 10 sets',     xp: 50 },
      { goal: 50,    label: 'Complete 50 sets',     xp: 100 },
      { goal: 100,   label: 'Complete 100 sets',    xp: 150 },
      { goal: 500,   label: 'Complete 500 sets',    xp: 250 },
      { goal: 1000,  label: 'Complete 1,000 sets',  xp: 400 },
      { goal: 5000,  label: 'Complete 5,000 sets',  xp: 600 },
      { goal: 10000, label: 'Complete 10,000 sets', xp: 1000 },
    ],
    getValue: (workoutHistory) =>
      workoutHistory.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0),
  },
  {
    id: 'weight', icon: '⚖️', name: 'Iron Hauler',
    tiers: [
      { goal: 1000,    label: 'Lift 1,000kg total',     xp: 100 },
      { goal: 10000,   label: 'Lift 10,000kg total',    xp: 200 },
      { goal: 50000,   label: 'Lift 50,000kg total',    xp: 300 },
      { goal: 100000,  label: 'Lift 100,000kg total',   xp: 400 },
      { goal: 500000,  label: 'Lift 500,000kg total',   xp: 600 },
      { goal: 1000000, label: 'Lift 1,000,000kg total', xp: 1000 },
    ],
    getValue: (workoutHistory) =>
      workoutHistory.reduce((a, w) => a + (w.totalWeight || 0), 0),
  },
  {
    id: 'streak', icon: '🔥', name: 'On Fire',
    tiers: [
      { goal: 3,  label: 'Train 3 days in a row',  xp: 100 },
      { goal: 7,  label: 'Train 7 days in a row',  xp: 200 },
      { goal: 14, label: 'Train 14 days in a row', xp: 350 },
      { goal: 30, label: 'Train 30 days in a row', xp: 500 },
    ],
    getValue: (workoutHistory) => {
      const sortedDates = [...new Set(workoutHistory.map(w => {
        const d = new Date(w.dateTimestamp); d.setHours(0,0,0,0); return d.getTime();
      }))].sort((a,b) => b - a);
      let streak = 0; let prevDay = null;
      const today = new Date(); today.setHours(0,0,0,0);
      for (const day of sortedDates) {
        if (prevDay === null) {
          const diffToday = (today.getTime() - day) / 86400000;
          if (diffToday > 1) break;
          streak = 1;
        } else if (prevDay - day === 86400000) { streak++; }
        else break;
        prevDay = day;
      }
      return streak;
    },
  },
  {
    id: 'consistency', icon: '📅', name: 'Consistent',
    tiers: [
      { goal: 2,  label: 'Train 2 weeks in a row',  xp: 100 },
      { goal: 4,  label: 'Train 4 weeks in a row',  xp: 200 },
      { goal: 8,  label: 'Train 8 weeks in a row',  xp: 350 },
      { goal: 12, label: 'Train 12 weeks in a row', xp: 500 },
      { goal: 26, label: 'Train 26 weeks in a row', xp: 750 },
      { goal: 52, label: 'Train 52 weeks in a row', xp: 1000 },
    ],
    getValue: (workoutHistory) => {
      const weekStarts = new Set();
      workoutHistory.forEach(w => {
        const d = new Date(w.dateTimestamp); const day = d.getDay();
        const monday = new Date(d);
        monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
        monday.setHours(0,0,0,0); weekStarts.add(monday.getTime());
      });
      const sortedWeeks = [...weekStarts].sort((a,b) => b - a);
      let weekStreak = 0;
      for (let i = 0; i < sortedWeeks.length; i++) {
        if (i === 0 || sortedWeeks[i-1] - sortedWeeks[i] === 7 * 86400000) weekStreak++;
        else break;
      }
      return weekStreak;
    },
  },
  {
    id: 'legs', icon: '🦵', name: 'Leg Day Hero',
    tiers: [
      { goal: 5,  label: 'Complete 5 leg workouts',  xp: 100 },
      { goal: 10, label: 'Complete 10 leg workouts', xp: 150 },
      { goal: 25, label: 'Complete 25 leg workouts', xp: 250 },
      { goal: 50, label: 'Complete 50 leg workouts', xp: 400 },
    ],
    getValue: (workoutHistory) => {
      const counts = {};
      workoutHistory.forEach(w => {
        const muscles = new Set(w.exercises.map(e => e.muscleGroup).filter(Boolean));
        muscles.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
      });
      return counts['Legs'] || 0;
    },
  },
  {
    id: 'chest', icon: '🫀', name: 'Chest Champion',
    tiers: [
      { goal: 5,  label: 'Complete 5 chest workouts',  xp: 100 },
      { goal: 10, label: 'Complete 10 chest workouts', xp: 150 },
      { goal: 25, label: 'Complete 25 chest workouts', xp: 250 },
      { goal: 50, label: 'Complete 50 chest workouts', xp: 400 },
    ],
    getValue: (workoutHistory) => {
      const counts = {};
      workoutHistory.forEach(w => {
        const muscles = new Set(w.exercises.map(e => e.muscleGroup).filter(Boolean));
        muscles.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
      });
      return counts['Chest'] || 0;
    },
  },
  {
    id: 'back', icon: '🔙', name: 'Back Builder',
    tiers: [
      { goal: 5,  label: 'Complete 5 back workouts',  xp: 100 },
      { goal: 10, label: 'Complete 10 back workouts', xp: 150 },
      { goal: 25, label: 'Complete 25 back workouts', xp: 250 },
      { goal: 50, label: 'Complete 50 back workouts', xp: 400 },
    ],
    getValue: (workoutHistory) => {
      const counts = {};
      workoutHistory.forEach(w => {
        const muscles = new Set(w.exercises.map(e => e.muscleGroup).filter(Boolean));
        muscles.forEach(m => { counts[m] = (counts[m] || 0) + 1; });
      });
      return counts['Back'] || 0;
    },
  },
  {
    id: 'anniversary', icon: '💎', name: 'Anniversary',
    tiers: [
      { goal: 30,  label: '1 month since first workout',  xp: 200 },
      { goal: 90,  label: '3 months since first workout', xp: 300 },
      { goal: 180, label: '6 months since first workout', xp: 500 },
      { goal: 365, label: '1 year since first workout',   xp: 1000 },
      { goal: 730, label: '2 years since first workout',  xp: 1500 },
    ],
    getValue: (workoutHistory) => {
      if (workoutHistory.length === 0) return 0;
      const first = workoutHistory[workoutHistory.length - 1];
      if (!first?.dateTimestamp) return 0;
      return Math.floor((Date.now() - first.dateTimestamp) / (1000 * 60 * 60 * 24));
    },
  },
];

const computeAchievements = (workoutHistory, globalPRHistory) => {
  return ACHIEVEMENT_DEFINITIONS.map(def => {
    const value = def.getValue(workoutHistory, globalPRHistory);
    let completedTiers = 0;
    for (const tier of def.tiers) {
      if (value >= tier.goal) completedTiers++;
      else break;
    }
    const isFullyComplete = completedTiers >= def.tiers.length;
    const currentTier = isFullyComplete ? def.tiers[def.tiers.length - 1] : def.tiers[completedTiers];
    const prevTier = completedTiers > 0 ? def.tiers[completedTiers - 1] : null;
    const progressValue = isFullyComplete ? 1 : (value - (prevTier?.goal || 0)) / (currentTier.goal - (prevTier?.goal || 0));
    return {
      ...def, value, completedTiers, isFullyComplete, currentTier, prevTier,
      progress: Math.min(Math.max(progressValue, 0), 1),
    };
  });
};

const computeTotalXP = (workoutHistory, globalPRHistory) => {
  let xp = 0;
  const totalWorkouts = workoutHistory.length;
  const totalSets = workoutHistory.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
  const totalPRs = Object.values(globalPRHistory).reduce((a, sessions) => a + sessions.length, 0);
  xp += totalSets * XP_REWARDS.SET_COMPLETE;
  xp += totalWorkouts * XP_REWARDS.WORKOUT_COMPLETE;
  xp += totalPRs * XP_REWARDS.ALL_TIME_PR;
  if (totalWorkouts >= 1) xp += XP_REWARDS.FIRST_WORKOUT;
  const sortedDates = [...new Set(workoutHistory.map(w => {
    const d = new Date(w.dateTimestamp); d.setHours(0,0,0,0); return d.getTime();
  }))].sort((a,b) => b - a);
  let streak = 0; let prevDay = null;
  for (const day of sortedDates) {
    if (prevDay === null || prevDay - day === 86400000) streak++;
    else if (prevDay - day > 86400000) break;
    prevDay = day;
  }
  if (streak >= 30) xp += XP_REWARDS.STREAK_30;
  else if (streak >= 7) xp += XP_REWARDS.STREAK_7;
  const achievements = computeAchievements(workoutHistory, globalPRHistory);
  achievements.forEach(ach => {
    for (let i = 0; i < ach.completedTiers; i++) xp += ach.tiers[i].xp;
  });
  return xp;
};

// ── EXERCISE SUBSTITUTIONS ──
const EXERCISE_SUBSTITUTIONS = {
  'Pull Up (Bodyweight)': {
    reason: 'Requires a pull-up bar',
    icon: '🔄',
    substitutes: [
      { name: 'Dumbbell Row (Dumbbell)', note: 'Best lat substitute with dumbbells — hinge forward and row to hip', equipment: 'Dumbbells' },
      { name: 'Single Arm Dumbbell Row (Dumbbell)', note: 'Great for unilateral lat development — support on a bench or chair', equipment: 'Dumbbells' },
      { name: 'Towel Row (Bodyweight)', note: 'Loop a towel around a door handle, lean back and row your bodyweight', equipment: 'Towel + door' },
      { name: 'Inverted Row (Bodyweight)', note: 'Lie under a sturdy table, grip the edge and row your bodyweight up', equipment: 'Table' },
    ],
  },
  'Chin Up (Bodyweight)': {
    reason: 'Requires a pull-up bar',
    icon: '🔄',
    substitutes: [
      { name: 'Bicep Curl (Dumbbell)', note: 'Targets the biceps which chin-ups heavily recruit — supinate at the top', equipment: 'Dumbbells' },
      { name: 'Dumbbell Row (Dumbbell)', note: 'Hits the lats and biceps together — similar muscle pattern to a chin-up', equipment: 'Dumbbells' },
      { name: 'Towel Row (Bodyweight)', note: 'Loop a towel around a door handle, use a supinated grip to mimic chin-up', equipment: 'Towel + door' },
      { name: 'Inverted Row (Bodyweight)', note: 'Use a supinated grip under a table for a chin-up-like movement', equipment: 'Table' },
    ],
  },
  'Hanging Leg Raise (Bodyweight)': {
    reason: 'Requires a pull-up bar',
    icon: '🔄',
    substitutes: [
      { name: 'Leg Raise (Bodyweight)', note: 'Lie flat on the floor and raise legs to 90° — same movement, no bar needed', equipment: 'None' },
      { name: 'Crunch (Bodyweight)', note: 'Targets the upper abs — no equipment needed at all', equipment: 'None' },
      { name: 'Sit Up (Bodyweight)', note: 'Full range ab movement — anchor feet under a sofa if needed', equipment: 'None' },
      { name: 'Russian Twist (Bodyweight)', note: 'Seated rotation for abs and obliques — no equipment needed', equipment: 'None' },
    ],
  },
  'Ab Wheel Rollout (Bodyweight)': {
    reason: 'Requires an ab wheel',
    icon: '🔄',
    substitutes: [
      { name: 'Plank (Bodyweight)', note: 'Best ab wheel alternative — same anti-extension pattern, no equipment needed', equipment: 'None' },
      { name: 'Leg Raise (Bodyweight)', note: 'Lie flat and raise legs — targets the lower abs heavily', equipment: 'None' },
      { name: 'Crunch (Bodyweight)', note: 'Classic ab exercise — no equipment needed', equipment: 'None' },
      { name: 'Sit Up (Bodyweight)', note: 'Full range of motion for the abs — anchor feet if needed', equipment: 'None' },
    ],
  },
  'Chest Dip (Bodyweight)': {
    reason: 'Requires dip bars or parallel bars',
    icon: '🔄',
    substitutes: [
      { name: 'Push Up (Bodyweight)', note: 'Best chest dip substitute — lean forward slightly to target lower chest', equipment: 'None' },
      { name: 'Bench Press (Dumbbell)', note: 'Targets the same chest muscles with dumbbells', equipment: 'Dumbbells' },
      { name: 'Decline Bench Press (Dumbbell)', note: 'Decline angle closely mimics the chest dip movement pattern', equipment: 'Dumbbells' },
      { name: 'Chest Fly (Dumbbell)', note: 'Isolates the chest — great finishing movement without dip bars', equipment: 'Dumbbells' },
    ],
  },
  'Tricep Dip (Bodyweight)': {
    reason: 'Requires dip bars or a sturdy chair',
    icon: '🔄',
    substitutes: [
      { name: 'Overhead Tricep Extension (Dumbbell)', note: 'Excellent tricep isolation — targets the long head heavily', equipment: 'Dumbbells' },
      { name: 'Skull Crusher (Dumbbell)', note: 'Lying tricep extension — great substitute with dumbbells', equipment: 'Dumbbells' },
      { name: 'Push Up (Bodyweight)', note: 'Narrow grip push up heavily recruits the triceps — no equipment needed', equipment: 'None' },
      { name: 'Single Arm Overhead Tricep Extension (Dumbbell)', note: 'Unilateral version — good for identifying and fixing imbalances', equipment: 'Dumbbells' },
    ],
  },
};
const hasSubstitution = (name) => !!EXERCISE_SUBSTITUTIONS[name];

// ── EXERCISE FORM TIPS ──
const EXERCISE_TIPS = {
  'Bench Press (Barbell)': { muscle: 'Chest (Overall)', tips: ['Retract and depress shoulder blades into the bench throughout the lift', 'Lower the bar to your lower chest — not your neck or upper chest', 'Keep elbows at 45–75° from your torso, not flared to 90°', 'Drive your feet into the floor and maintain a slight natural arch'] },
  'Bench Press (Dumbbell)': { muscle: 'Chest (Overall)', tips: ['At the bottom, dumbbells should be roughly in line with your lower chest', 'Rotate wrists slightly inward at the top to maximise chest squeeze', 'Control the descent — 2-3 seconds down', 'Keep core tight and feet flat on the floor'] },
  'Bench Press (Machine)': { muscle: 'Chest (Overall)', tips: ['Adjust the seat so handles are at lower chest height', 'Keep shoulder blades pulled back against the pad throughout', 'Press through the full range without locking elbows aggressively', 'Exhale on the push, inhale on the return'] },
  'Incline Bench Press (Barbell)': { muscle: 'Chest (Overall)', tips: ['Set bench at 30–45° — higher angles shift more load to shoulders', 'Bar path should be slightly diagonal, lowering to upper chest', 'Keep wrists stacked over elbows', 'Retract shoulder blades to protect the shoulder joint'] },
  'Incline Bench Press (Dumbbell)': { muscle: 'Chest (Overall)', tips: ['Keep the dumbbells in line with your upper chest at the bottom', 'Avoid touching dumbbells at the top — maintain tension', 'Control the eccentric — slow descent builds more muscle', 'Keep a neutral wrist — do not hyperextend backwards'] },
  'Incline Bench Press (Machine)': { muscle: 'Chest (Overall)', tips: ['Adjust seat so handles align with upper chest', 'Keep shoulder blades back and down throughout', 'Do not let the weight pull your shoulders forward at the bottom', 'Full range of motion — do not cut it short'] },
  'Decline Bench Press (Barbell)': { muscle: 'Chest (Overall)', tips: ['Feet should be secured under the pad — do not rely on momentum', 'Lower the bar to your lower chest / sternum area', 'Elbows slightly tucked, not flared', 'Range of motion may feel shorter than flat — that is normal'] },
  'Decline Bench Press (Dumbbell)': { muscle: 'Chest (Overall)', tips: ['Secure feet firmly — balance is more challenging with dumbbells', 'Lower dumbbells to lower chest level', 'Keep elbows slightly tucked for joint safety', 'Control the descent carefully given the declined angle'] },
  'Chest Fly (Dumbbell)': { muscle: 'Chest (Overall)', tips: ['Think of hugging a tree — arms arc outward then inward', 'Maintain a slight fixed bend in the elbow throughout', 'Do not go lower than shoulder level — protects the shoulder joint', 'Squeeze the chest hard at the top before slowly returning'] },
  'Chest Fly (Cable)': { muscle: 'Chest (Overall)', tips: ['Set cables at chest or shoulder height for flat fly', 'Keep a consistent elbow bend throughout the movement', 'Focus on squeezing the chest, not pulling with the arms', 'Pause and squeeze at the centre before returning slowly'] },
  'Chest Fly (Machine)': { muscle: 'Chest (Overall)', tips: ['Adjust the seat so handles are at chest height', 'Keep your back flat against the pad — do not lean forward', 'Control the return — do not let the weight slam back', 'Focus on feeling the stretch at the fully open position'] },
  'Push Up (Bodyweight)': { muscle: 'Chest (Overall)', tips: ['Hands slightly wider than shoulder-width, fingers forward', 'Keep a straight line from head to heels — no sagging hips', 'Lower chest to just above the floor for full range', 'Elbows at 45° from torso — not flared or fully tucked'] },
  'Chest Dip (Bodyweight)': { muscle: 'Chest (Overall)', tips: ['Lean your torso forward to emphasise chest over triceps', 'Lower until shoulders are slightly below elbows', 'Control the descent — do not drop quickly', 'Elbows should flare slightly outward for chest focus'] },
  'Cable Crossover (Cable)': { muscle: 'Chest (Overall)', tips: ['Set cables above head height for standard crossover', 'Keep a slight elbow bend — do not straighten arms', 'Pull the cables down and inward in an arcing motion', 'Squeeze the chest at the bottom — hands can overlap slightly'] },
  'Pull Up (Bodyweight)': { muscle: 'Lats', tips: ['Start from a dead hang with arms fully extended', 'Pull elbows down and back — think "elbows to hips"', 'Chest should come close to the bar at the top', 'Lower slowly — the eccentric phase builds significant back strength'] },
  'Chin Up (Bodyweight)': { muscle: 'Lats', tips: ['Supinated grip (palms facing you) increases bicep recruitment', 'Pull until your chin clears the bar', 'Avoid swinging or kipping for strict reps', 'Fully extend at the bottom between each rep'] },
  'Barbell Row (Barbell)': { muscle: 'Upper Back', tips: ['Hinge at the hips to about 45°, spine neutral', 'Pull bar to your lower ribcage — not your stomach or upper chest', 'Squeeze shoulder blades together at the top', 'Control the descent — do not let the bar drop'] },
  'Dumbbell Row (Dumbbell)': { muscle: 'Upper Back', tips: ['Support yourself with the opposite hand on the bench', 'Pull the dumbbell to your hip — not your shoulder', 'Allow the shoulder to drop at the bottom for full stretch', 'Keep hips level — do not rotate excessively'] },
  'Single Arm Dumbbell Row (Dumbbell)': { muscle: 'Upper Back', tips: ['Brace your core to prevent lower back rotation', 'Drive the elbow back and up — think "elbow to ceiling"', 'Fully extend the arm at the bottom for maximum lat stretch', 'Keep the working shoulder packed — do not shrug'] },
  'Seated Cable Row (Cable)': { muscle: 'Upper Back', tips: ['Sit tall — do not round your lower back', 'Pull the handle to your lower ribcage', 'Squeeze shoulder blades together at the peak contraction', 'Let the cable stretch your back forward slightly between reps'] },
  'Lat Pulldown (Cable)': { muscle: 'Lats', tips: ['Grip slightly wider than shoulder-width', 'Pull the bar to your upper chest — not behind the neck', 'Lean back slightly and open the chest as you pull', 'Control the return — do not let the bar snap up'] },
  'Lat Pulldown (Machine)': { muscle: 'Lats', tips: ['Adjust the thigh pad to lock your legs in place', 'Pull handles to upper chest level', 'Think of pulling your elbows to your hips', 'Slow return — the stretch at the top is valuable'] },
  'Deadlift (Barbell)': { muscle: 'Upper Back', tips: ['Bar over mid-foot, hip-width stance', 'Push the floor away rather than pulling the bar up', 'Keep the bar close to your body — scrape your shins', 'Lock out by driving hips forward, not hyperextending the back'] },
  'Romanian Deadlift (Barbell)': { muscle: 'Hamstrings', tips: ['Push your hips back — not down — as you hinge', 'Maintain a soft bend in the knees throughout', 'Lower until you feel a strong hamstring stretch', 'Keep the bar close to your legs the entire movement'] },
  'Romanian Deadlift (Dumbbell)': { muscle: 'Hamstrings', tips: ['Hold dumbbells in front of thighs, palms facing you', 'Hinge at the hips with a flat back', 'Let the dumbbells travel down the front of your legs', 'Squeeze glutes and drive hips forward to return to standing'] },
  'Face Pull (Cable)': { muscle: 'Rear Delts', tips: ['Set cable at face height or above', 'Pull the rope to your face — elbows high and wide', 'Externally rotate at the top — thumbs pointing behind you', 'Use light weight and focus on the rear delt contraction'] },
  'Straight Arm Pulldown (Cable)': { muscle: 'Lats', tips: ['Use a rope or straight bar attachment set high', 'Keep arms straight with a very slight elbow bend', 'Pull the bar down to your thighs in an arc', 'Squeeze the lats hard at the bottom before returning slowly'] },
  'Overhead Press (Barbell)': { muscle: 'Front Delts', tips: ['Grip just outside shoulder width, elbows slightly forward', 'Press the bar straight up — not in front of your face', 'Squeeze glutes and brace core to protect lower back', 'At the top, shrug slightly to fully engage the traps'] },
  'Overhead Press (Dumbbell)': { muscle: 'Front Delts', tips: ['Start with dumbbells at shoulder height, palms forward', 'Press up and slightly in — dumbbells nearly touch at top', 'Do not arch your lower back excessively', 'Control the descent — 2 seconds down'] },
  'Overhead Press (Machine)': { muscle: 'Front Delts', tips: ['Adjust seat so handles start at shoulder height', 'Press straight up without shrugging your neck', 'Keep core engaged to protect the spine', 'Full range — fully extend without locking elbows'] },
  'Lateral Raise (Dumbbell)': { muscle: 'Side Delts', tips: ['Lead with your elbows, not your hands', 'Raise to just above shoulder height — no higher needed', 'Slight forward lean and external rotation (pinky slightly up)', 'Control the descent — do not let gravity do all the work'] },
  'Lateral Raise (Cable)': { muscle: 'Side Delts', tips: ['Cable provides constant tension unlike dumbbells', 'Cross your body — the cable should come from the opposite side', 'Keep elbow slightly bent and lead with the elbow', 'Pause briefly at shoulder height before returning'] },
  'Lateral Raise (Machine)': { muscle: 'Side Delts', tips: ['Adjust the pad to sit against your elbow, not your wrist', 'Raise to shoulder height — machine limits cheating', 'Control the return — do not let the weight drop freely', 'Keep your torso upright and stationary'] },
  'Single Arm Lateral Raise (Dumbbell)': { muscle: 'Side Delts', tips: ['Hold a fixed object with the other hand for stability', 'Lead with the elbow — imagine pouring a jug of water', 'Lean slightly away from the working arm for a better stretch', 'Control the eccentric portion carefully'] },
  'Single Arm Lateral Raise (Cable)': { muscle: 'Side Delts', tips: ['Stand side-on to the cable stack', 'The working arm is the one furthest from the machine', 'Keep a slight elbow bend throughout', 'Pause at shoulder height for maximum tension'] },
  'Front Raise (Dumbbell)': { muscle: 'Front Delts', tips: ['Keep a slight bend in the elbow throughout', 'Raise to shoulder height — no need to go higher', 'Avoid swinging — control with your front delts', 'Alternate arms or do both simultaneously'] },
  'Front Raise (Barbell)': { muscle: 'Front Delts', tips: ['Use a pronated grip (overhand)', 'Raise the bar to shoulder height', 'Keep your core braced to avoid leaning back', 'Lower slowly — 2-3 seconds on the way down'] },
  'Front Raise (Cable)': { muscle: 'Front Delts', tips: ['Set cable at the lowest pulley position', 'Use a straight bar or rope attachment', 'Keep movement controlled — cable provides constant tension', 'Raise to shoulder height and hold briefly'] },
  'Single Arm Front Raise (Dumbbell)': { muscle: 'Front Delts', tips: ['Alternate arms for control and balance', 'Keep the working arm slightly bent at the elbow', 'Raise to shoulder height — parallel to the floor', 'Avoid leaning your torso back as weight increases'] },
  'Single Arm Front Raise (Cable)': { muscle: 'Front Delts', tips: ['Set cable at lowest position', 'Stand facing away from the machine', 'Raise arm forward to shoulder height with control', 'Cable provides constant tension unlike dumbbells'] },
  'Rear Delt Fly (Dumbbell)': { muscle: 'Rear Delts', tips: ['Hinge forward to about 90° with a flat back', 'Keep a slight elbow bend throughout', 'Lead with your elbows — raise them up and out', 'Do not shrug or use momentum — use light weight'] },
  'Rear Delt Fly (Cable)': { muscle: 'Rear Delts', tips: ['Cross cables — left hand holds right cable and vice versa', 'Pull arms apart in a wide arc', 'Keep elbows slightly bent and at shoulder height', 'Squeeze shoulder blades together at peak contraction'] },
  'Rear Delt Fly (Machine)': { muscle: 'Rear Delts', tips: ['Set the handles so arms are outstretched at shoulder height', 'Pull handles apart in a wide arc — reverse pec deck motion', 'Keep your chest against the pad for stability', 'Squeeze rear delts hard at peak — do not just use momentum'] },
  'Single Arm Rear Delt Fly (Dumbbell)': { muscle: 'Rear Delts', tips: ['Hinge forward and brace with your free hand', 'Keep a slight elbow bend throughout', 'Raise arm out to the side at shoulder height', 'Focus on feeling the rear delt — use light weight'] },
  'Single Arm Rear Delt Fly (Cable)': { muscle: 'Rear Delts', tips: ['Set cable at shoulder height', 'Cross body — working arm pulls from the opposite side', 'Arc the arm out and back in a wide sweep', 'Squeeze the rear delt at peak and return with control'] },
  'Arnold Press (Dumbbell)': { muscle: 'Front Delts', tips: ['Start with palms facing you at shoulder height', 'As you press up, rotate palms to face forward', 'Reverse the rotation on the way down', 'Full range of motion — maximises shoulder recruitment'] },
  'Shrug (Barbell)': { muscle: 'Upper Back', tips: ['Hold bar in front, arms straight', 'Shrug straight up — do not roll shoulders forward or back', 'Hold the top position briefly for maximum trap contraction', 'Use straps if grip is limiting the weight you can use'] },
  'Shrug (Dumbbell)': { muscle: 'Upper Back', tips: ['Hold dumbbells at your sides', 'Shrug straight up as high as possible', 'Pause at the top for a 1-2 second squeeze', 'Keep arms straight — this is not a bicep curl'] },
  'Bicep Curl (Barbell)': { muscle: 'Biceps', tips: ['Keep elbows pinned to your sides — do not let them drift forward', 'Full range — fully extend at the bottom, curl fully at the top', 'Avoid swinging — use a weight you can control', 'Supinate your wrists slightly at the top for peak contraction'] },
  'Bicep Curl (Dumbbell)': { muscle: 'Biceps', tips: ['Alternate or simultaneous — both are effective', 'Supinate (rotate palms up) as you curl for full bicep contraction', 'Control the descent — negative phase builds strength', 'Do not let elbows swing forward at the top'] },
  'Bicep Curl (Cable)': { muscle: 'Biceps', tips: ['Cable provides constant tension even at full extension', 'Use a straight bar or EZ bar attachment', 'Keep elbows tucked and stationary', 'Squeeze hard at the top and lower with control'] },
  'Bicep Curl (Machine)': { muscle: 'Biceps', tips: ['Adjust seat so elbows rest at the pad comfortably', 'Full range — extend fully, curl fully', 'Machine removes cheating — focus on the squeeze', 'Control the return — do not let weight drop freely'] },
  'Single Arm Bicep Curl (Dumbbell)': { muscle: 'Biceps', tips: ['Brace your torso to prevent rotation', 'Fully supinate (rotate palm up) at the top', 'Fully extend at the bottom for maximum stretch', 'Focus on mind-muscle connection with one arm at a time'] },
  'Single Arm Bicep Curl (Cable)': { muscle: 'Biceps', tips: ['Stand facing the cable stack', 'Elbow stays stationary throughout', 'Squeeze the bicep hard at the top', 'Lower slowly — cables are excellent for controlled eccentrics'] },
  'Hammer Curl (Dumbbell)': { muscle: 'Biceps', tips: ['Neutral grip (palms facing each other) throughout', 'Targets the brachialis and brachioradialis in addition to biceps', 'Keep elbows tucked to your sides', 'Do not rotate the wrist — maintain neutral grip all the way up'] },
  'Hammer Curl (Cable)': { muscle: 'Biceps', tips: ['Use a rope attachment for neutral grip', 'Pull the rope up with thumbs pointing toward the ceiling', 'Keep elbows stationary at your sides', 'Good for building forearm and overall arm thickness'] },
  'Single Arm Hammer Curl (Dumbbell)': { muscle: 'Biceps', tips: ['Neutral grip — palms facing the body throughout', 'Curl to shoulder height and squeeze', 'Perform each arm independently for balanced development', 'Control the descent with a 2-second eccentric'] },
  'Single Arm Hammer Curl (Cable)': { muscle: 'Biceps', tips: ['Use a single D-handle attachment', 'Neutral wrist position throughout', 'Stand perpendicular to the cable for a natural arc', 'Squeeze at the top for 1 second'] },
  'Preacher Curl (Barbell)': { muscle: 'Biceps', tips: ['Elbows should rest on the pad — do not grip the top', 'Full extension at the bottom — feel the stretch', 'Do not swing or heave the weight up', 'The pad eliminates cheating — use a lighter weight than standing curls'] },
  'Preacher Curl (Dumbbell)': { muscle: 'Biceps', tips: ['One arm at a time for better focus', 'Full stretch at the bottom of each rep', 'Supinate at the top for peak contraction', 'Control the negative — this is where much of the growth stimulus comes'] },
  'Preacher Curl (Machine)': { muscle: 'Biceps', tips: ['Adjust seat so upper arms rest flat on the pad', 'Full range of motion — do not cut the top or bottom short', 'Squeeze at the top and lower slowly', 'Machine variation is very strict — great for isolation'] },
  'Tricep Pushdown (Cable)': { muscle: 'Triceps', tips: ['Keep elbows pinned to your sides throughout', 'Fully extend the arms at the bottom — lock out the triceps', 'Lean slightly forward for better engagement', 'Control the return — do not let the cable pull elbows up'] },
  'Tricep Pushdown (Machine)': { muscle: 'Triceps', tips: ['Adjust seat or pad so elbows are at a comfortable height', 'Push straight down to full extension', 'Squeeze the triceps at the fully extended position', 'Slow return — do not let the stack crash down'] },
  'Single Arm Tricep Pushdown (Cable)': { muscle: 'Triceps', tips: ['Use a D-handle or rope attachment', 'Keep the upper arm stationary — only the forearm moves', 'Fully extend at the bottom and squeeze', 'One arm at a time helps identify and fix strength imbalances'] },
  'Skull Crusher (Barbell)': { muscle: 'Triceps', tips: ['Lower the bar to your forehead — or just behind your head', 'Keep elbows pointing toward the ceiling — do not let them flare', 'Use a slightly wider than shoulder-width grip for comfort', 'Control the eccentric carefully — high-risk movement if rushed'] },
  'Skull Crusher (Dumbbell)': { muscle: 'Triceps', tips: ['Lower dumbbells to the sides of your head', 'Elbows stay pointed upward and stationary', 'Extend fully at the top — squeeze the triceps', 'Dumbbell version allows slightly more natural wrist rotation'] },
  'Overhead Tricep Extension (Dumbbell)': { muscle: 'Triceps', tips: ['Hold one dumbbell with both hands behind your head', 'Keep elbows narrow and pointing toward the ceiling', 'Extend fully overhead — full range of motion is key', 'Stretch position is excellent for long head of triceps'] },
  'Overhead Tricep Extension (Cable)': { muscle: 'Triceps', tips: ['Set cable at the lowest position, face away from the machine', 'Keep upper arms parallel to the floor or angled up', 'Extend forearms forward to full lockout', 'Cable version provides continuous tension through the range'] },
  'Single Arm Overhead Tricep Extension (Dumbbell)': { muscle: 'Triceps', tips: ['Keep elbow pointing straight up throughout', 'Support the working arm at the elbow with the other hand if needed', 'Full extension at the top, full stretch at the bottom', 'Excellent for targeting the long head of the triceps'] },
  'Single Arm Overhead Tricep Extension (Cable)': { muscle: 'Triceps', tips: ['Face away from cable set at low position', 'Keep upper arm stationary and pointing upward', 'Extend the forearm fully on each rep', 'Great for constant tension through the stretched position'] },
  'Tricep Dip (Bodyweight)': { muscle: 'Triceps', tips: ['Keep torso upright to target triceps over chest', 'Lower until upper arms are parallel to the floor', 'Keep elbows pointing backward — not flaring outward', 'Add weight using a dip belt once bodyweight becomes easy'] },
  'Squat (Barbell)': { muscle: 'Quads', tips: ['Bar rests on upper traps or rear delts — not on your neck', 'Feet shoulder-width apart, toes angled out 15–30°', 'Squat to depth where hips break below knees', 'Drive through your whole foot — not just your heels or toes'] },
  'Squat (Machine)': { muscle: 'Quads', tips: ['Adjust the pad to rest comfortably on your upper traps', 'Feet placement determines muscle emphasis — higher = more glutes', 'Control the descent — 2-3 seconds down', 'Push your knees out in line with your toes throughout'] },
  'Squat (Bodyweight)': { muscle: 'Quads', tips: ['Feet shoulder-width apart, toes angled out slightly', 'Keep your chest up and torso as upright as possible', 'Squat until hips break below parallel — do not cut it short', 'Drive knees out in line with toes on the way up'] },
  'Front Squat (Barbell)': { muscle: 'Quads', tips: ['Bar rests on front delts, elbows high — parallel to floor', 'More upright torso than back squat — demands ankle mobility', 'Squat deep — front squats reward full depth', 'Core must be extremely tight to prevent forward lean'] },
  'Leg Press (Machine)': { muscle: 'Quads', tips: ['Foot placement higher = more glutes/hamstrings; lower = more quads', 'Do not lock out your knees at the top — keep slight tension', 'Lower to 90° or beyond without your lower back lifting off the pad', 'Push through your full foot evenly'] },
  'Leg Curl (Machine)': { muscle: 'Hamstrings', tips: ['Adjust pad to rest just above your heels', 'Curl as far as possible — full range of motion matters', 'Avoid lifting your hips off the pad during the curl', 'Control the eccentric — lower the weight slowly'] },
  'Leg Curl (Dumbbell)': { muscle: 'Hamstrings', tips: ['Lie face down and hold the dumbbell between your feet', 'Curl the dumbbell toward your glutes', 'Keep hips pressed into the floor to isolate hamstrings', 'A partner can help position the weight safely'] },
  'Leg Extension (Machine)': { muscle: 'Quads', tips: ['Adjust the seat back so your knee joint aligns with the machine pivot', 'Extend fully — squeeze quads hard at the top', 'Control the descent — do not let the weight crash down', 'Point toes slightly inward to emphasise inner quads'] },
  'Calf Raise (Machine)': { muscle: 'Calves', tips: ['Use a full range of motion — full stretch at the bottom', 'Pause at the top for a 1-2 second squeeze', 'Do not bounce at the bottom — control the stretch', 'Try both straight-leg and bent-knee variations'] },
  'Calf Raise (Dumbbell)': { muscle: 'Calves', tips: ['Stand on the edge of a step for full range', 'Hold dumbbells at your sides for added resistance', 'Rise as high as possible onto your toes', 'Lower heels fully below the step level for a complete stretch'] },
  'Calf Raise (Barbell)': { muscle: 'Calves', tips: ['Bar rests on upper traps — same as squat position', 'Stand on a raised surface for full range of motion', 'Full stretch at the bottom — heels below platform level', 'Squeeze hard at the top on every rep'] },
  'Single Arm Calf Raise (Dumbbell)': { muscle: 'Calves', tips: ['Hold one dumbbell on the same side as the working leg', 'Use a step or elevated surface for full range', 'Balance on one foot — this also improves ankle stability', 'Full stretch at the bottom on every rep'] },
  'Lunges (Barbell)': { muscle: 'Quads', tips: ['Take a long enough stride so front shin stays vertical', 'Lower your back knee toward — but not touching — the floor', 'Keep your torso upright and core braced', 'Push through your front heel to return to standing'] },
  'Lunges (Dumbbell)': { muscle: 'Quads', tips: ['Hold dumbbells at your sides for a natural feel', 'Step forward and lower the back knee toward the floor', 'Front knee should not cave inward — push it out in line with toes', 'Alternate legs or complete all reps on one side first'] },
  'Lunges (Bodyweight)': { muscle: 'Quads', tips: ['Great for warmup or high-rep conditioning work', 'Focus on a long stride for maximum range', 'Keep your torso upright — do not lean forward', 'Walking lunges add a balance and coordination challenge'] },
  'Hip Thrust (Barbell)': { muscle: 'Glutes', tips: ['Upper back rests on the bench at shoulder-blade level', 'Bar sits in hip crease — use a pad for comfort', 'Drive through your heels and squeeze glutes hard at the top', 'At the top, shins should be vertical — adjust foot position if not'] },
  'Hip Thrust (Machine)': { muscle: 'Glutes', tips: ['Adjust so the pad hits your hip crease, not your waist', 'Drive hips up and forward — squeeze glutes at the top', 'Hold the top position for 1-2 seconds on each rep', 'Keep your chin tucked — do not hyperextend your neck'] },
  'Plank (Bodyweight)': { muscle: 'Abs', tips: ['Elbows directly under shoulders', 'Keep hips level — do not let them sag or pike up', 'Brace your core as if bracing for a punch', 'Breathe normally — do not hold your breath'] },
  'Crunch (Bodyweight)': { muscle: 'Abs', tips: ['Lift shoulder blades off the floor — not a full sit-up', 'Hands behind head but do not pull on your neck', 'Exhale as you crunch up, inhale on the way down', 'Keep lower back in contact with the floor throughout'] },
  'Sit Up (Bodyweight)': { muscle: 'Abs', tips: ['Anchor your feet or have a partner hold them', 'Come all the way up — chest to knees for full range', 'Cross arms on chest or hands behind head', 'Control the descent — the eccentric matters'] },
  'Leg Raise (Bodyweight)': { muscle: 'Abs', tips: ['Lie flat, hands under your glutes for lower back support', 'Keep legs straight or with a slight bend', 'Lower legs to just above the floor — do not touch down', 'Tilt your pelvis slightly to keep lower back pressed down'] },
  'Russian Twist (Bodyweight)': { muscle: 'Abs', tips: ['Sit with knees bent, feet elevated or on the floor', 'Lean back slightly to engage core', 'Rotate fully from side to side — touch the floor on each side', 'Keep the movement controlled — do not throw your arms'] },
  'Russian Twist (Dumbbell)': { muscle: 'Abs', tips: ['Hold the dumbbell with both hands at chest level', 'Rotate slowly — do not use momentum', 'Keep feet elevated to increase difficulty', 'Keep your back straight — do not round the spine'] },
  'Ab Wheel Rollout (Bodyweight)': { muscle: 'Abs', tips: ['Start on knees for beginner, toes for advanced', 'Roll out until your body is nearly parallel to the floor', 'Keep core extremely braced — prevent hip sagging', 'Pull back using your abs — not just your arms or hip flexors'] },
  'Cable Crunch (Cable)': { muscle: 'Abs', tips: ['Kneel facing the cable stack, rope pulled behind head', 'Crunch down by rounding the spine — not bending at the hip', 'Hold the contracted position briefly at the bottom', 'Keep hips stationary — all movement from the abs'] },
  'Hanging Leg Raise (Bodyweight)': { muscle: 'Abs', tips: ['Hang from a pull-up bar with a shoulder-width grip', 'Raise legs to 90° or higher — tuck knees if straight-leg is too hard', 'Control the descent — do not swing', 'Posterior pelvic tilt at the top maximises ab engagement'] },
  'Treadmill (Machine)': { muscle: 'Cardio', tips: ['Stand tall — do not hold the handrails for easy sessions', 'Land midfoot, not on your heels', 'Keep a consistent cadence — around 170–180 steps per minute is efficient', 'For incline walking, lean slightly forward from the ankles'] },
  'Rowing Machine (Machine)': { muscle: 'Cardio', tips: ['Drive sequence: legs first, then lean back, then arms pull', 'Return sequence is the reverse: arms, body, legs', 'Keep a strong core throughout the stroke', 'Aim for 24–28 strokes per minute for steady state effort'] },
  'Cycling (Machine)': { muscle: 'Cardio', tips: ['Adjust seat height so knee has a slight bend at the bottom of the stroke', 'Pedal through the full circle — not just pushing down', 'Keep your upper body relatively still — power comes from the legs', 'Higher cadence with lower resistance is easier on the knees'] },
  'Jump Rope (Bodyweight)': { muscle: 'Cardio', tips: ['Stay on the balls of your feet — do not flat-foot land', 'Keep jumps small — just enough clearance for the rope', 'Elbows close to your body, wrists drive the rope', 'Start with 30-second intervals if you are new to it'] },
  'Stair Climber (Machine)': { muscle: 'Cardio', tips: ['Do not lean on the handrails — it reduces calorie burn significantly', 'Take full steps — do not take tiny half-steps', 'Keep an upright posture — do not hunch forward', 'Moderate pace sustained is more effective than sprinting and stopping'] },
  'Hip 90/90 Stretch': { muscle: 'Hip Mobility', tips: ['Sit with both legs in a 90° position — front and back', 'Keep your spine tall — do not round forward', 'Lean gently toward the front shin for a deeper stretch', 'Hold each side for 30–60 seconds and breathe deeply'] },
  'Thoracic Rotation': { muscle: 'Thoracic Spine', tips: ['Lie on your side with hips stacked and knees bent to 90°', 'Rotate the top arm open toward the ceiling and beyond', 'Keep hips stacked — the rotation is all through the upper back', 'Breathe out as you open and hold briefly at the end range'] },
  "World's Greatest Stretch": { muscle: 'Full Body', tips: ['Start in a lunge, drop your elbow to the floor inside the front foot', 'Rotate your arm up toward the ceiling, following with your eyes', 'Return to hands on the floor and push back into a hip stretch', 'Move slowly and breathe through each position'] },
  'Pigeon Pose': { muscle: 'Glutes / Hip Flexors', tips: ['Front shin as parallel to the top of the mat as flexibility allows', 'Keep hips squared — do not let one side drop', 'Fold forward over the front leg for a deeper stretch', 'Hold for 60–90 seconds per side — breathe through discomfort'] },
  'Cat-Cow': { muscle: 'Spine', tips: ['On hands and knees — wrists under shoulders, knees under hips', 'Cat: round the back and tuck the chin and pelvis', 'Cow: drop the belly, lift the head and tailbone', 'Move slowly and coordinate with your breath — inhale cow, exhale cat'] },
  "Child's Pose": { muscle: 'Lats / Lower Back', tips: ['Knees wide or together — both variations are useful', 'Reach arms forward and let the chest sink toward the floor', 'Breathe deeply into your back body', 'Hold for 60–90 seconds for full benefit'] },
  'Downward Dog': { muscle: 'Hamstrings / Calves / Shoulders', tips: ['Push the floor away — do not just hang from your arms', 'Pedal your heels alternately to warm up the calves', 'Aim for a straight line from wrists to hips', 'Keep your head relaxed between your arms'] },
  'Hip Flexor Stretch': { muscle: 'Hip Flexors', tips: ['Low lunge position — back knee on the floor', 'Drive your hips forward and down gently', 'Keep your torso upright — do not lean forward', 'Tuck the pelvis slightly for a deeper stretch'] },
  'Butterfly Stretch': { muscle: 'Inner Thighs / Hips', tips: ['Sit with soles of feet together, knees dropped to the sides', 'Hold your feet and gently push knees toward the floor with elbows', 'Sit tall — do not round your spine', 'Hold for 30–60 seconds and breathe'] },
  'Hamstring Stretch': { muscle: 'Hamstrings', tips: ['Sit with one leg extended, one leg bent inward', 'Reach toward your foot while keeping your spine long', 'Do not round your back — hinge from the hip', 'Hold for 30–60 seconds per side'] },
  'Calf Stretch': { muscle: 'Calves', tips: ['Place hands on a wall, step one foot back', 'Keep back heel flat on the floor — do not let it rise', 'Lean forward gently — feel the stretch in the calf', 'Bend the back knee slightly to stretch the soleus (deeper calf muscle)'] },
  'Neck Side Stretch': { muscle: 'Neck / Upper Traps', tips: ['Sit or stand tall with shoulders relaxed and down', 'Tilt your ear toward your shoulder — do not rotate', 'Use your hand to gently add a little extra stretch if needed', 'Hold 20–30 seconds each side — never force it'] },
  'Chest Opener Stretch': { muscle: 'Chest / Front Shoulders', tips: ['Clasp hands behind your back and squeeze shoulder blades together', 'Lift your hands away from your body and open the chest', 'Look slightly up but do not hyperextend the neck', 'Hold 30 seconds — great for countering hunched posture'] },
  'Wrist Circles': { muscle: 'Wrists / Forearms', tips: ['Make full circles in both directions — 10 each way', 'Move slowly and deliberately — feel the full range', 'Do not rush — wrists are commonly neglected', 'Also try wrist extensions and flexions for more complete prep'] },
  'Spinal Twist': { muscle: 'Spine / Obliques', tips: ['Lie on your back, bring one knee across the body', 'Extend the arm on the same side as the raised knee out to the side', 'Keep both shoulders on the floor', 'Hold 30–60 seconds each side — breathe into the twist'] },
  'Quad Stretch': { muscle: 'Quads', tips: ['Stand on one leg, hold the other ankle behind you', 'Knees together — do not let the stretching knee flare out', 'Keep hips level and stand tall', 'Pull the ankle toward your glute — not your hip'] },
  'IT Band Stretch': { muscle: 'IT Band / Outer Thigh', tips: ['Cross one leg behind the other and lean away', 'Push the hip of the back leg outward', 'Keep both feet flat on the floor', 'Hold 30 seconds each side — important for runners and cyclists'] },
  'Shoulder Cross Body Stretch': { muscle: 'Rear Delts / Rotator Cuff', tips: ['Bring one arm across your chest at shoulder height', 'Use the other arm to press it gently toward your chest', 'Do not rotate — keep both shoulders squared forward', 'Hold 20–30 seconds each side'] },
  'Doorway Pec Stretch': { muscle: 'Chest / Front Shoulders', tips: ['Stand in a doorway with arms at 90° on the frame', 'Step forward gently until you feel the chest stretch', 'Keep elbows at shoulder height for best pec stretch', 'Hold 30 seconds — one of the best chest stretches available'] },
  'Lat Stretch': { muscle: 'Lats', tips: ['Hold a fixed object and lean away to stretch the lat', 'Or reach one arm overhead and bend sideways', 'Feel the stretch down the side of the back', 'Breathe into the stretch and hold 30 seconds each side'] },
  'Thoracic Extension': { muscle: 'Thoracic Spine', tips: ['Sit in a chair and place hands behind your head', 'Lean back over the top of the chair to extend the upper back', 'Focus on the upper/mid back — not the lower back', 'Move slowly and hold briefly at the end range'] },
  'Figure Four Stretch': { muscle: 'Glutes / Piriformis', tips: ['Lie on your back, cross one ankle over the opposite knee', 'Pull the uncrossed leg toward your chest', 'Push the crossed knee away with your elbow for a deeper stretch', 'Hold 45–60 seconds — excellent glute and piriformis stretch'] },
  'Ankle Circles': { muscle: 'Ankles', tips: ['Lift the foot and make slow full circles', '10 rotations each direction per foot', 'Move through the full range — do not make tiny circles', 'Can be done seated or standing'] },
  'Seated Figure Four': { muscle: 'Glutes / Hips', tips: ['Sit upright in a chair, cross one ankle over the opposite knee', 'Lean forward gently with a straight back for a deeper stretch', 'Push the crossed knee down gently to increase intensity', 'Hold 30–45 seconds each side'] },
  'Leg Swings': { muscle: 'Hip Flexors / Hamstrings', tips: ['Hold a wall for balance and swing leg forward and back', 'Keep the movement controlled — not floppy', 'Gradually increase the range over 10–15 swings', 'Also do lateral swings for hip abductors'] },
  'Arm Circles': { muscle: 'Shoulders', tips: ['Start small and gradually increase to full circles', '10 forward, 10 backward each arm', 'Keep the arm straight and the movement smooth', 'Excellent pre-workout shoulder warmup'] },
  'Hip Circles': { muscle: 'Hips / Lower Back', tips: ['Stand with feet shoulder-width apart, hands on hips', 'Make large slow circles with your hips', '10 in each direction', 'Keep the upper body relatively still'] },
  'Inchworm': { muscle: 'Full Body', tips: ['Stand, hinge forward and walk hands out to a plank position', 'Hold briefly then walk feet toward hands', 'Keep legs as straight as possible throughout', 'Add a push-up in the plank position for extra difficulty'] },
  'High Knees': { muscle: 'Hip Flexors / Cardio', tips: ['Drive knees up to hip height on each step', 'Pump arms in opposition to your legs', 'Stay on the balls of your feet', 'Can be done in place or travelling forward'] },
  'Lateral Lunge': { muscle: 'Inner Thighs / Quads / Glutes', tips: ['Step out to one side, bend that knee and sit into it', 'Keep the opposite leg straight', 'Foot of the bending leg flat on the floor', 'Push through that foot to return to standing'] },
  'Towel Row (Bodyweight)': { muscle: 'Lats / Upper Back', tips: ['Loop a sturdy towel around a door handle at waist height and hold both ends', 'Sit back with straight arms so your weight is supported by the towel', 'Pull your chest toward the door handle, leading with your elbows', 'Lower slowly — do not just drop back down, control the eccentric'] },
  'Inverted Row (Bodyweight)': { muscle: 'Upper Back', tips: ['Set up under a sturdy table with your chest directly below the edge', 'Grip the edge with both hands shoulder-width apart, arms straight', 'Keep your body in a straight line from head to heels throughout', 'Pull your chest up to the table edge, squeezing shoulder blades together at the top'] },
};

const getExerciseTipUrl = (exerciseName) => {
  const searchQuery = encodeURIComponent(`${exerciseName} proper form technique tutorial`);
  return `https://www.youtube.com/results?search_query=${searchQuery}`;
};

// ── MOBILITY CATALOGUE ──
const MOBILITY_CATALOGUE = {
  'Full Body': ['Hip 90/90 Stretch', 'Thoracic Rotation', "World's Greatest Stretch", 'Ankle Circles', 'Shoulder Cross Body Stretch', 'Pigeon Pose', 'Cat-Cow'],
  'Lower Body': ['Hip Flexor Stretch', 'Pigeon Pose', 'Butterfly Stretch', 'Figure Four Stretch', 'Hamstring Stretch', 'Calf Stretch', 'IT Band Stretch'],
  'Upper Body': ['Chest Opener Stretch', 'Shoulder Cross Body Stretch', 'Doorway Pec Stretch', 'Lat Stretch', 'Neck Side Stretch', 'Wrist Circles', 'Thoracic Extension'],
  'Morning': ['Cat-Cow', "Child's Pose", 'Downward Dog', 'Hip Flexor Stretch', 'Thoracic Rotation', "World's Greatest Stretch", 'Spinal Twist'],
  'Post-Workout': ['Quad Stretch', 'Hamstring Stretch', 'Hip Flexor Stretch', 'Chest Opener Stretch', 'Shoulder Cross Body Stretch', 'Pigeon Pose', 'Spinal Twist'],
  'Warm-Up': ['Leg Swings', 'Arm Circles', 'Hip Circles', "World's Greatest Stretch", 'Inchworm', 'High Knees', 'Lateral Lunge'],
  'Desk Relief': ['Neck Side Stretch', 'Chest Opener Stretch', 'Hip Flexor Stretch', 'Thoracic Rotation', 'Wrist Circles', 'Seated Figure Four', 'Cat-Cow'],
};

const DEFAULT_EXERCISE_CATALOGUE = {
  'Chest': ['Bench Press (Barbell)', 'Bench Press (Dumbbell)', 'Bench Press (Machine)', 'Incline Bench Press (Barbell)', 'Incline Bench Press (Dumbbell)', 'Incline Bench Press (Machine)', 'Decline Bench Press (Barbell)', 'Decline Bench Press (Dumbbell)', 'Chest Fly (Dumbbell)', 'Chest Fly (Cable)', 'Chest Fly (Machine)', 'Push Up (Bodyweight)', 'Chest Dip (Bodyweight)', 'Cable Crossover (Cable)'],
  'Back': ['Pull Up (Bodyweight)', 'Chin Up (Bodyweight)', 'Barbell Row (Barbell)', 'Dumbbell Row (Dumbbell)', 'Single Arm Dumbbell Row (Dumbbell)', 'Seated Cable Row (Cable)', 'Lat Pulldown (Cable)', 'Lat Pulldown (Machine)', 'Deadlift (Barbell)', 'Romanian Deadlift (Barbell)', 'Romanian Deadlift (Dumbbell)', 'Face Pull (Cable)', 'Straight Arm Pulldown (Cable)'],
  'Shoulders': ['Overhead Press (Barbell)', 'Overhead Press (Dumbbell)', 'Overhead Press (Machine)', 'Lateral Raise (Dumbbell)', 'Lateral Raise (Cable)', 'Lateral Raise (Machine)', 'Single Arm Lateral Raise (Dumbbell)', 'Single Arm Lateral Raise (Cable)', 'Front Raise (Dumbbell)', 'Front Raise (Barbell)', 'Front Raise (Cable)', 'Single Arm Front Raise (Dumbbell)', 'Single Arm Front Raise (Cable)', 'Rear Delt Fly (Dumbbell)', 'Rear Delt Fly (Cable)', 'Rear Delt Fly (Machine)', 'Single Arm Rear Delt Fly (Dumbbell)', 'Single Arm Rear Delt Fly (Cable)', 'Arnold Press (Dumbbell)', 'Shrug (Barbell)', 'Shrug (Dumbbell)'],
  'Arms': ['Bicep Curl (Barbell)', 'Bicep Curl (Dumbbell)', 'Bicep Curl (Cable)', 'Bicep Curl (Machine)', 'Single Arm Bicep Curl (Dumbbell)', 'Single Arm Bicep Curl (Cable)', 'Hammer Curl (Dumbbell)', 'Hammer Curl (Cable)', 'Single Arm Hammer Curl (Dumbbell)', 'Single Arm Hammer Curl (Cable)', 'Preacher Curl (Barbell)', 'Preacher Curl (Dumbbell)', 'Preacher Curl (Machine)', 'Tricep Pushdown (Cable)', 'Tricep Pushdown (Machine)', 'Single Arm Tricep Pushdown (Cable)', 'Skull Crusher (Barbell)', 'Skull Crusher (Dumbbell)', 'Overhead Tricep Extension (Dumbbell)', 'Overhead Tricep Extension (Cable)', 'Single Arm Overhead Tricep Extension (Dumbbell)', 'Single Arm Overhead Tricep Extension (Cable)', 'Tricep Dip (Bodyweight)'],
  'Legs': ['Squat (Barbell)', 'Squat (Machine)', 'Squat (Bodyweight)', 'Front Squat (Barbell)', 'Leg Press (Machine)', 'Romanian Deadlift (Barbell)', 'Romanian Deadlift (Dumbbell)', 'Leg Curl (Machine)', 'Leg Curl (Dumbbell)', 'Leg Extension (Machine)', 'Calf Raise (Machine)', 'Calf Raise (Dumbbell)', 'Calf Raise (Barbell)', 'Single Arm Calf Raise (Dumbbell)', 'Lunges (Barbell)', 'Lunges (Dumbbell)', 'Lunges (Bodyweight)', 'Hip Thrust (Barbell)', 'Hip Thrust (Machine)', 'Hip Thrust (Dumbbell)', 'Hip Thrust (Bodyweight)',],
  'Core': ['Plank (Bodyweight)', 'Crunch (Bodyweight)', 'Sit Up (Bodyweight)', 'Leg Raise (Bodyweight)', 'Russian Twist (Bodyweight)', 'Russian Twist (Dumbbell)', 'Ab Wheel Rollout (Bodyweight)', 'Cable Crunch (Cable)', 'Hanging Leg Raise (Bodyweight)'],
  'Cardio': ['Treadmill (Machine)', 'Rowing Machine (Machine)', 'Cycling (Machine)', 'Jump Rope (Bodyweight)', 'Stair Climber (Machine)'],
  'Other': [],
};

const DETAILED_MUSCLE_GROUPS = {
  'Chest (Overall)': { parent: 'Chest', target: 6 },
  'Lats': { parent: 'Back', target: 6 },
  'Upper Back': { parent: 'Back', target: 6 },
  'Front Delts': { parent: 'Shoulders', target: 6 },
  'Side Delts': { parent: 'Shoulders', target: 6 },
  'Rear Delts': { parent: 'Shoulders', target: 6 },
  'Biceps': { parent: 'Arms', target: 6 },
  'Triceps': { parent: 'Arms', target: 6 },
  'Quads': { parent: 'Legs', target: 6 },
  'Hamstrings': { parent: 'Legs', target: 6 },
  'Glutes': { parent: 'Legs', target: 6 },
  'Calves': { parent: 'Legs', target: 6 },
  'Abs': { parent: 'Core', target: 6 },
  'Cardio': { parent: 'Cardio', target: 6 },
};

const EXERCISE_TO_DETAILED_MUSCLE = {
  'Bench Press (Barbell)': 'Chest (Overall)', 'Bench Press (Dumbbell)': 'Chest (Overall)', 'Bench Press (Machine)': 'Chest (Overall)', 'Incline Bench Press (Barbell)': 'Chest (Overall)', 'Incline Bench Press (Dumbbell)': 'Chest (Overall)', 'Incline Bench Press (Machine)': 'Chest (Overall)', 'Decline Bench Press (Barbell)': 'Chest (Overall)', 'Decline Bench Press (Dumbbell)': 'Chest (Overall)', 'Chest Fly (Dumbbell)': 'Chest (Overall)', 'Chest Fly (Cable)': 'Chest (Overall)', 'Chest Fly (Machine)': 'Chest (Overall)', 'Push Up (Bodyweight)': 'Chest (Overall)', 'Chest Dip (Bodyweight)': 'Chest (Overall)', 'Cable Crossover (Cable)': 'Chest (Overall)',
  'Pull Up (Bodyweight)': 'Lats', 'Chin Up (Bodyweight)': 'Lats', 'Lat Pulldown (Cable)': 'Lats', 'Lat Pulldown (Machine)': 'Lats', 'Straight Arm Pulldown (Cable)': 'Lats',
  'Barbell Row (Barbell)': 'Upper Back', 'Dumbbell Row (Dumbbell)': 'Upper Back', 'Single Arm Dumbbell Row (Dumbbell)': 'Upper Back', 'Seated Cable Row (Cable)': 'Upper Back', 'Deadlift (Barbell)': 'Upper Back', 'Romanian Deadlift (Barbell)': 'Hamstrings', 'Romanian Deadlift (Dumbbell)': 'Hamstrings', 'Face Pull (Cable)': 'Rear Delts',
  'Overhead Press (Barbell)': 'Front Delts', 'Overhead Press (Dumbbell)': 'Front Delts', 'Overhead Press (Machine)': 'Front Delts', 'Arnold Press (Dumbbell)': 'Front Delts',
  'Lateral Raise (Dumbbell)': 'Side Delts', 'Lateral Raise (Cable)': 'Side Delts', 'Lateral Raise (Machine)': 'Side Delts', 'Single Arm Lateral Raise (Dumbbell)': 'Side Delts', 'Single Arm Lateral Raise (Cable)': 'Side Delts',
  'Front Raise (Dumbbell)': 'Front Delts', 'Front Raise (Barbell)': 'Front Delts', 'Front Raise (Cable)': 'Front Delts', 'Single Arm Front Raise (Dumbbell)': 'Front Delts', 'Single Arm Front Raise (Cable)': 'Front Delts',
  'Rear Delt Fly (Dumbbell)': 'Rear Delts', 'Rear Delt Fly (Cable)': 'Rear Delts', 'Rear Delt Fly (Machine)': 'Rear Delts', 'Single Arm Rear Delt Fly (Dumbbell)': 'Rear Delts', 'Single Arm Rear Delt Fly (Cable)': 'Rear Delts',
  'Shrug (Barbell)': 'Upper Back', 'Shrug (Dumbbell)': 'Upper Back',
  'Bicep Curl (Barbell)': 'Biceps', 'Bicep Curl (Dumbbell)': 'Biceps', 'Bicep Curl (Cable)': 'Biceps', 'Bicep Curl (Machine)': 'Biceps', 'Single Arm Bicep Curl (Dumbbell)': 'Biceps', 'Single Arm Bicep Curl (Cable)': 'Biceps', 'Hammer Curl (Dumbbell)': 'Biceps', 'Hammer Curl (Cable)': 'Biceps', 'Single Arm Hammer Curl (Dumbbell)': 'Biceps', 'Single Arm Hammer Curl (Cable)': 'Biceps', 'Preacher Curl (Barbell)': 'Biceps', 'Preacher Curl (Dumbbell)': 'Biceps', 'Preacher Curl (Machine)': 'Biceps',
  'Tricep Pushdown (Cable)': 'Triceps', 'Tricep Pushdown (Machine)': 'Triceps', 'Single Arm Tricep Pushdown (Cable)': 'Triceps', 'Skull Crusher (Barbell)': 'Triceps', 'Skull Crusher (Dumbbell)': 'Triceps', 'Overhead Tricep Extension (Dumbbell)': 'Triceps', 'Overhead Tricep Extension (Cable)': 'Triceps', 'Single Arm Overhead Tricep Extension (Dumbbell)': 'Triceps', 'Single Arm Overhead Tricep Extension (Cable)': 'Triceps', 'Tricep Dip (Bodyweight)': 'Triceps',
  'Squat (Barbell)': 'Quads', 'Squat (Machine)': 'Quads', 'Front Squat (Barbell)': 'Quads', 'Leg Press (Machine)': 'Quads', 'Leg Extension (Machine)': 'Quads', 'Lunges (Barbell)': 'Quads', 'Lunges (Dumbbell)': 'Quads', 'Lunges (Bodyweight)': 'Quads',
  'Leg Curl (Machine)': 'Hamstrings', 'Leg Curl (Dumbbell)': 'Hamstrings',
  'Hip Thrust (Barbell)': 'Glutes', 'Hip Thrust (Machine)': 'Glutes', 'Hip Thrust (Dumbbell)': 'Glutes', 'Hip Thrust (Bodyweight)': 'Glutes',
  'Squat (Bodyweight)': 'Quads',
  'Calf Raise (Machine)': 'Calves', 'Calf Raise (Dumbbell)': 'Calves', 'Calf Raise (Barbell)': 'Calves', 'Single Arm Calf Raise (Dumbbell)': 'Calves',
  'Plank (Bodyweight)': 'Abs', 'Crunch (Bodyweight)': 'Abs', 'Sit Up (Bodyweight)': 'Abs', 'Leg Raise (Bodyweight)': 'Abs', 'Russian Twist (Bodyweight)': 'Abs', 'Russian Twist (Dumbbell)': 'Abs', 'Ab Wheel Rollout (Bodyweight)': 'Abs', 'Cable Crunch (Cable)': 'Abs', 'Hanging Leg Raise (Bodyweight)': 'Abs',
  'Treadmill (Machine)': 'Cardio', 'Rowing Machine (Machine)': 'Cardio', 'Cycling (Machine)': 'Cardio', 'Jump Rope (Bodyweight)': 'Cardio', 'Stair Climber (Machine)': 'Cardio',
};

const DETAILED_MUSCLES_BY_GROUP = {
  'Chest': ['Chest (Overall)'], 'Back': ['Lats', 'Upper Back'],
  'Shoulders': ['Front Delts', 'Side Delts', 'Rear Delts'], 'Arms': ['Biceps', 'Triceps'],
  'Legs': ['Quads', 'Hamstrings', 'Glutes', 'Calves'], 'Core': ['Abs'],
  'Cardio': ['Cardio'], 'Other': ['Other'],
};

const DETAILED_MUSCLE_HELPER = {
  'Chest (Overall)': { description: 'The pectoralis major and minor. Responsible for pushing movements.', tipExercises: ['Bench Press', 'Chest Fly', 'Push Up', 'Cable Crossover'], tip: 'Exercises where you push horizontally or squeeze arms together across the body.' },
  'Lats': { description: 'Latissimus dorsi — the large wing-shaped muscles of the back.', tipExercises: ['Pull Up', 'Lat Pulldown', 'Straight Arm Pulldown'], tip: 'Exercises where you pull the arm down or back toward the torso.' },
  'Upper Back': { description: 'Traps, rhomboids and rear muscles of the upper back.', tipExercises: ['Barbell Row', 'Seated Cable Row', 'Shrug', 'Deadlift'], tip: 'Exercises involving rowing or pulling horizontally, or shrugging the shoulders.' },
  'Front Delts': { description: 'Anterior deltoid — front of the shoulder.', tipExercises: ['Overhead Press', 'Front Raise', 'Arnold Press'], tip: 'Exercises where you lift the arm forward or press overhead.' },
  'Side Delts': { description: 'Lateral deltoid — the side cap of the shoulder.', tipExercises: ['Lateral Raise', 'Upright Row'], tip: 'Exercises where you raise the arm out to the side.' },
  'Rear Delts': { description: 'Posterior deltoid — back of the shoulder.', tipExercises: ['Rear Delt Fly', 'Face Pull', 'Reverse Pec Deck'], tip: 'Exercises where you pull arms back and out, or perform reverse fly movements.' },
  'Biceps': { description: 'Biceps brachii — front of the upper arm.', tipExercises: ['Bicep Curl', 'Hammer Curl', 'Chin Up', 'Preacher Curl'], tip: 'Exercises involving elbow flexion with the palm facing up or neutral.' },
  'Triceps': { description: 'Triceps brachii — back of the upper arm.', tipExercises: ['Tricep Pushdown', 'Skull Crusher', 'Overhead Extension', 'Dip'], tip: 'Exercises involving elbow extension — pushing or straightening the arm.' },
  'Quads': { description: 'Quadriceps — front of the thigh. Primary knee extensor.', tipExercises: ['Squat', 'Leg Press', 'Leg Extension', 'Lunge'], tip: 'Exercises involving knee extension or deep knee bend under load.' },
  'Hamstrings': { description: 'Back of the thigh. Flex the knee and extend the hip.', tipExercises: ['Romanian Deadlift', 'Leg Curl', 'Nordic Curl'], tip: 'Exercises with a hip hinge or knee flexion against resistance.' },
  'Glutes': { description: 'Gluteus maximus, medius and minimus — the muscles of the buttocks.', tipExercises: ['Hip Thrust', 'Glute Bridge', 'Bulgarian Split Squat'], tip: 'Exercises with strong hip extension, especially with the knee bent.' },
  'Calves': { description: 'Gastrocnemius and soleus — lower leg muscles that plantarflex the foot.', tipExercises: ['Calf Raise', 'Seated Calf Raise', 'Donkey Calf Raise'], tip: 'Any calf raise variation — pushing up onto your toes against resistance.' },
  'Abs': { description: 'Rectus abdominis, obliques and transverse abdominis.', tipExercises: ['Crunch', 'Plank', 'Leg Raise', 'Russian Twist', 'Ab Wheel'], tip: 'Exercises involving trunk flexion, rotation, or anti-extension under load.' },
  'Cardio': { description: 'Cardiovascular endurance work. Not a muscle group but tracked for volume.', tipExercises: ['Treadmill', 'Rowing Machine', 'Cycling', 'Jump Rope'], tip: 'Any sustained aerobic activity.' },
  'Other': { description: 'Uncategorised exercise — not tracked in weekly volume.', tipExercises: [], tip: 'Use this for exercises that do not fit any other category.' },
};

const MUSCLE_GROUP_ICONS = {
  'Chest': '🫀', 'Back': '🔙', 'Shoulders': '🏋️',
  'Arms': '💪', 'Legs': '🦵', 'Core': '⚡', 'Cardio': '🏃', 'Other': '❓',
};

const DETAILED_MUSCLE_ICONS = {
  'Chest (Overall)': '🫀', 'Lats': '🔙', 'Upper Back': '🏔️',
  'Front Delts': '⬆️', 'Side Delts': '↔️', 'Rear Delts': '🔄',
  'Biceps': '💪', 'Triceps': '🔱', 'Quads': '🦵',
  'Hamstrings': '🦿', 'Glutes': '🍑', 'Calves': '🦶',
  'Abs': '⚡', 'Cardio': '🏃', 'Other': '❓',
};

const CLEAR_TARGETS = {
  prs: { label: 'Clear All PRs & Exercise History', icon: '🏆', description: 'Removes all personal records and session history from every exercise.', btnLabel: 'Clear All PRs' },
  history: { label: 'Clear Workout History', icon: '📅', description: 'Deletes all logged workout sessions.', btnLabel: 'Clear Workout History' },
  notes: { label: 'Clear All Notes', icon: '📝', description: 'Removes all notes from every exercise across all programs.', btnLabel: 'Clear All Notes' },
  custom: { label: 'Clear Custom Exercises', icon: '🗂️', description: 'Removes all custom exercises you have added to the catalogue.', btnLabel: 'Clear Custom Exercises' },
  all: { label: 'Delete All Data', icon: '🗑️', description: 'Permanently deletes everything. This cannot be undone.', btnLabel: 'Delete Everything' },
};

const makeEx = (name, sets, type = 'strength') => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name, sets, groupId: null, history: [], pr: null, note: '', type,
});

const makeMobEx = (name, sets = 1) => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  name, sets, groupId: null, history: [], pr: null, note: '', type: 'mobility', duration: 30,
});

const PUSH_MUSCLES = ['Chest (Overall)', 'Front Delts', 'Side Delts', 'Triceps'];
const PULL_MUSCLES = ['Lats', 'Upper Back', 'Rear Delts', 'Biceps'];
const UPPER_MUSCLES = ['Chest (Overall)', 'Lats', 'Upper Back', 'Front Delts', 'Side Delts', 'Rear Delts', 'Biceps', 'Triceps'];
const LOWER_MUSCLES = ['Quads', 'Hamstrings', 'Glutes', 'Calves'];
const CARDIO_EXERCISES = ['Treadmill (Machine)', 'Rowing Machine (Machine)', 'Cycling (Machine)', 'Jump Rope (Bodyweight)', 'Stair Climber (Machine)'];
const isCardioExercise = (name) => CARDIO_EXERCISES.some(c => c.toLowerCase() === name.toLowerCase());
const isBodyweightExercise = (name) => name.toLowerCase().includes('(bodyweight)');

const PROGRAM_TEMPLATES = [
  { id: 'tpl_push', label: 'Push Day', tag: 'PPL', description: 'Chest, shoulders & triceps', type: 'strength', exercises: [makeEx('Bench Press (Barbell)', 4), makeEx('Incline Bench Press (Dumbbell)', 3), makeEx('Overhead Press (Dumbbell)', 3), makeEx('Lateral Raise (Dumbbell)', 3), makeEx('Tricep Pushdown (Cable)', 3), makeEx('Skull Crusher (Barbell)', 3)] },
  { id: 'tpl_pull', label: 'Pull Day', tag: 'PPL', description: 'Back & biceps', type: 'strength', exercises: [makeEx('Deadlift (Barbell)', 3), makeEx('Pull Up (Bodyweight)', 3), makeEx('Barbell Row (Barbell)', 3), makeEx('Lat Pulldown (Cable)', 3), makeEx('Face Pull (Cable)', 3), makeEx('Bicep Curl (Barbell)', 3), makeEx('Hammer Curl (Dumbbell)', 3)] },
  { id: 'tpl_legs', label: 'Leg Day', tag: 'PPL', description: 'Quads, hamstrings, glutes & calves', type: 'strength', exercises: [makeEx('Squat (Barbell)', 4), makeEx('Romanian Deadlift (Barbell)', 3), makeEx('Leg Press (Machine)', 3), makeEx('Leg Curl (Machine)', 3), makeEx('Leg Extension (Machine)', 3), makeEx('Hip Thrust (Barbell)', 3), makeEx('Calf Raise (Machine)', 4)] },
  { id: 'tpl_upper', label: 'Upper Body', tag: 'Upper/Lower', description: 'Full upper body session', type: 'strength', exercises: [makeEx('Bench Press (Barbell)', 4), makeEx('Barbell Row (Barbell)', 4), makeEx('Overhead Press (Dumbbell)', 3), makeEx('Pull Up (Bodyweight)', 3), makeEx('Lateral Raise (Dumbbell)', 3), makeEx('Bicep Curl (Dumbbell)', 3), makeEx('Tricep Pushdown (Cable)', 3)] },
  { id: 'tpl_lower', label: 'Lower Body', tag: 'Upper/Lower', description: 'Full lower body session', type: 'strength', exercises: [makeEx('Squat (Barbell)', 4), makeEx('Romanian Deadlift (Barbell)', 3), makeEx('Leg Press (Machine)', 3), makeEx('Leg Curl (Machine)', 3), makeEx('Hip Thrust (Barbell)', 3), makeEx('Calf Raise (Machine)', 4), makeEx('Plank (Bodyweight)', 3)] },
  { id: 'tpl_fullbody_a', label: 'Full Body A', tag: 'Full Body', description: 'Squat-focused full body', type: 'strength', exercises: [makeEx('Squat (Barbell)', 4), makeEx('Bench Press (Barbell)', 3), makeEx('Barbell Row (Barbell)', 3), makeEx('Overhead Press (Barbell)', 3), makeEx('Romanian Deadlift (Barbell)', 3), makeEx('Plank (Bodyweight)', 3)] },
  { id: 'tpl_fullbody_b', label: 'Full Body B', tag: 'Full Body', description: 'Deadlift-focused full body', type: 'strength', exercises: [makeEx('Deadlift (Barbell)', 4), makeEx('Incline Bench Press (Barbell)', 3), makeEx('Pull Up (Bodyweight)', 3), makeEx('Lateral Raise (Dumbbell)', 3), makeEx('Leg Press (Machine)', 3), makeEx('Hanging Leg Raise (Bodyweight)', 3)] },
  { id: 'tpl_chest', label: 'Chest Focus', tag: 'Specialisation', description: 'High volume chest session', type: 'strength', exercises: [makeEx('Bench Press (Barbell)', 4), makeEx('Incline Bench Press (Dumbbell)', 4), makeEx('Decline Bench Press (Barbell)', 3), makeEx('Chest Fly (Cable)', 3), makeEx('Cable Crossover (Cable)', 3), makeEx('Push Up (Bodyweight)', 3)] },
  { id: 'tpl_back', label: 'Back Focus', tag: 'Specialisation', description: 'High volume back session', type: 'strength', exercises: [makeEx('Deadlift (Barbell)', 3), makeEx('Pull Up (Bodyweight)', 4), makeEx('Barbell Row (Barbell)', 4), makeEx('Seated Cable Row (Cable)', 3), makeEx('Lat Pulldown (Cable)', 3), makeEx('Face Pull (Cable)', 3)] },

  // ── Home Workouts (Bodyweight only) ──
  { id: 'tpl_home_fullbody', label: 'Home Full Body', tag: 'Home (Bodyweight)', description: 'Full body — no equipment needed',
    type: 'strength',
    exercises: [
      makeEx('Push Up (Bodyweight)', 4),
      makeEx('Pull Up (Bodyweight)', 3),
      makeEx('Lunges (Bodyweight)', 3),
      makeEx('Plank (Bodyweight)', 3),
      makeEx('Crunch (Bodyweight)', 3),
      makeEx('Tricep Dip (Bodyweight)', 3),
    ],
  },
  { id: 'tpl_home_push', label: 'Home Push', tag: 'Home (Bodyweight)', description: 'Chest, shoulders & triceps — no equipment',
    type: 'strength',
    exercises: [
      makeEx('Push Up (Bodyweight)', 4),
      makeEx('Chest Dip (Bodyweight)', 3),
      makeEx('Tricep Dip (Bodyweight)', 3),
      makeEx('Crunch (Bodyweight)', 3),
      makeEx('Plank (Bodyweight)', 3),
    ],
  },
  { id: 'tpl_home_pull', label: 'Home Pull', tag: 'Home (Bodyweight)', description: 'Back & biceps — no equipment',
    type: 'strength',
    exercises: [
      makeEx('Pull Up (Bodyweight)', 4),
      makeEx('Chin Up (Bodyweight)', 3),
      makeEx('Hanging Leg Raise (Bodyweight)', 3),
      makeEx('Crunch (Bodyweight)', 3),
      makeEx('Plank (Bodyweight)', 3),
    ],
  },
  { id: 'tpl_home_legs', label: 'Home Legs', tag: 'Home (Bodyweight)', description: 'Legs & glutes — no equipment',
    type: 'strength',
    exercises: [
      makeEx('Lunges (Bodyweight)', 4),
      makeEx('Squat (Bodyweight)', 4),
      makeEx('Hip Thrust (Bodyweight)', 3),
      makeEx('Leg Raise (Bodyweight)', 3),
      makeEx('Plank (Bodyweight)', 3),
    ],
  },
  { id: 'tpl_home_core', label: 'Home Core', tag: 'Home (Bodyweight)', description: 'Core & abs — no equipment',
    type: 'strength',
    exercises: [
      makeEx('Plank (Bodyweight)', 4),
      makeEx('Crunch (Bodyweight)', 3),
      makeEx('Leg Raise (Bodyweight)', 3),
      makeEx('Russian Twist (Bodyweight)', 3),
      makeEx('Sit Up (Bodyweight)', 3),
      makeEx('Ab Wheel Rollout (Bodyweight)', 3),
    ],
  },

  // ── Home Workouts (Dumbbells) ──
  { id: 'tpl_home_db_fullbody', label: 'Home Full Body (DB)', tag: 'Home (Dumbbells)', description: 'Full body — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Bench Press (Dumbbell)', 4),
      makeEx('Dumbbell Row (Dumbbell)', 4),
      makeEx('Overhead Press (Dumbbell)', 3),
      makeEx('Romanian Deadlift (Dumbbell)', 3),
      makeEx('Lunges (Dumbbell)', 3),
      makeEx('Bicep Curl (Dumbbell)', 3),
      makeEx('Overhead Tricep Extension (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_push', label: 'Home Push (DB)', tag: 'Home (Dumbbells)', description: 'Chest, shoulders & triceps — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Bench Press (Dumbbell)', 4),
      makeEx('Incline Bench Press (Dumbbell)', 3),
      makeEx('Overhead Press (Dumbbell)', 3),
      makeEx('Lateral Raise (Dumbbell)', 3),
      makeEx('Front Raise (Dumbbell)', 3),
      makeEx('Overhead Tricep Extension (Dumbbell)', 3),
      makeEx('Skull Crusher (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_pull', label: 'Home Pull (DB)', tag: 'Home (Dumbbells)', description: 'Back & biceps — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Dumbbell Row (Dumbbell)', 4),
      makeEx('Single Arm Dumbbell Row (Dumbbell)', 3),
      makeEx('Romanian Deadlift (Dumbbell)', 3),
      makeEx('Rear Delt Fly (Dumbbell)', 3),
      makeEx('Bicep Curl (Dumbbell)', 3),
      makeEx('Hammer Curl (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_legs', label: 'Home Legs (DB)', tag: 'Home (Dumbbells)', description: 'Legs & glutes — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Romanian Deadlift (Dumbbell)', 4),
      makeEx('Lunges (Dumbbell)', 4),
      makeEx('Hip Thrust (Dumbbell)', 3),
      makeEx('Leg Curl (Dumbbell)', 3),
      makeEx('Calf Raise (Dumbbell)', 4),
      makeEx('Russian Twist (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_upper', label: 'Home Upper Body (DB)', tag: 'Home (Dumbbells)', description: 'Full upper body — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Bench Press (Dumbbell)', 4),
      makeEx('Dumbbell Row (Dumbbell)', 4),
      makeEx('Overhead Press (Dumbbell)', 3),
      makeEx('Lateral Raise (Dumbbell)', 3),
      makeEx('Bicep Curl (Dumbbell)', 3),
      makeEx('Overhead Tricep Extension (Dumbbell)', 3),
      makeEx('Rear Delt Fly (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_lower', label: 'Home Lower Body (DB)', tag: 'Home (Dumbbells)', description: 'Full lower body — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Romanian Deadlift (Dumbbell)', 4),
      makeEx('Lunges (Dumbbell)', 4),
      makeEx('Hip Thrust (Dumbbell)', 3),
      makeEx('Leg Curl (Dumbbell)', 3),
      makeEx('Calf Raise (Dumbbell)', 4),
      makeEx('Single Arm Calf Raise (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_shoulders', label: 'Home Shoulders (DB)', tag: 'Home (Dumbbells)', description: 'Shoulder focus — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Overhead Press (Dumbbell)', 4),
      makeEx('Lateral Raise (Dumbbell)', 4),
      makeEx('Front Raise (Dumbbell)', 3),
      makeEx('Rear Delt Fly (Dumbbell)', 3),
      makeEx('Arnold Press (Dumbbell)', 3),
      makeEx('Shrug (Dumbbell)', 3),
    ],
  },
  { id: 'tpl_home_db_arms', label: 'Home Arms (DB)', tag: 'Home (Dumbbells)', description: 'Biceps & triceps — dumbbells only',
    type: 'strength',
    exercises: [
      makeEx('Bicep Curl (Dumbbell)', 4),
      makeEx('Hammer Curl (Dumbbell)', 3),
      makeEx('Preacher Curl (Dumbbell)', 3),
      makeEx('Overhead Tricep Extension (Dumbbell)', 4),
      makeEx('Skull Crusher (Dumbbell)', 3),
      makeEx('Tricep Dip (Bodyweight)', 3),
    ],
  },
  { id: 'tpl_home_fullbody_a', label: 'Home Full Body A', tag: 'Home (Bodyweight)', description: 'Push focus — chest, shoulders, triceps + quads', type: 'strength', exercises: [makeEx('Push Up (Bodyweight)', 4), makeEx('Chest Dip (Bodyweight)', 3), makeEx('Tricep Dip (Bodyweight)', 3), makeEx('Squat (Bodyweight)', 4), makeEx('Lunges (Bodyweight)', 3), makeEx('Plank (Bodyweight)', 3)] },
  { id: 'tpl_home_fullbody_b', label: 'Home Full Body B', tag: 'Home (Bodyweight)', description: 'Pull focus — back, biceps + hamstrings', type: 'strength', exercises: [makeEx('Pull Up (Bodyweight)', 4), makeEx('Chin Up (Bodyweight)', 3), makeEx('Hip Thrust (Bodyweight)', 3), makeEx('Lunges (Bodyweight)', 3), makeEx('Hanging Leg Raise (Bodyweight)', 3), makeEx('Crunch (Bodyweight)', 3)] },
  { id: 'tpl_home_fullbody_c', label: 'Home Full Body C', tag: 'Home (Bodyweight)', description: 'Legs & core focus — quads, glutes, abs', type: 'strength', exercises: [makeEx('Squat (Bodyweight)', 4), makeEx('Hip Thrust (Bodyweight)', 4), makeEx('Lunges (Bodyweight)', 3), makeEx('Push Up (Bodyweight)', 3), makeEx('Plank (Bodyweight)', 4), makeEx('Sit Up (Bodyweight)', 3)] },
  { id: 'tpl_home_db_fullbody_a', label: 'Home Full Body A (DB)', tag: 'Home (Dumbbells)', description: 'Push focus — chest, shoulders, triceps + quads', type: 'strength', exercises: [makeEx('Bench Press (Dumbbell)', 4), makeEx('Overhead Press (Dumbbell)', 3), makeEx('Lateral Raise (Dumbbell)', 3), makeEx('Lunges (Dumbbell)', 4), makeEx('Overhead Tricep Extension (Dumbbell)', 3), makeEx('Plank (Bodyweight)', 3)] },
  { id: 'tpl_home_db_fullbody_b', label: 'Home Full Body B (DB)', tag: 'Home (Dumbbells)', description: 'Pull focus — back, biceps + hamstrings', type: 'strength', exercises: [makeEx('Dumbbell Row (Dumbbell)', 4), makeEx('Single Arm Dumbbell Row (Dumbbell)', 3), makeEx('Romanian Deadlift (Dumbbell)', 4), makeEx('Rear Delt Fly (Dumbbell)', 3), makeEx('Bicep Curl (Dumbbell)', 3), makeEx('Hammer Curl (Dumbbell)', 3)] },
  { id: 'tpl_home_db_fullbody_c', label: 'Home Full Body C (DB)', tag: 'Home (Dumbbells)', description: 'Legs & core focus — glutes, hamstrings, abs', type: 'strength', exercises: [makeEx('Romanian Deadlift (Dumbbell)', 4), makeEx('Hip Thrust (Dumbbell)', 4), makeEx('Lunges (Dumbbell)', 3), makeEx('Lateral Raise (Dumbbell)', 3), makeEx('Russian Twist (Dumbbell)', 3), makeEx('Plank (Bodyweight)', 3)] },
  { id: 'tpl_mob_fullbody', label: 'Full Body Mobility', tag: 'Mobility', subTag: 'Full Body', description: 'Complete full body mobility routine', type: 'mobility', exercises: [makeMobEx('Hip 90/90 Stretch'), makeMobEx('Thoracic Rotation'), makeMobEx("World's Greatest Stretch"), makeMobEx('Ankle Circles'), makeMobEx('Shoulder Cross Body Stretch'), makeMobEx('Pigeon Pose'), makeMobEx('Cat-Cow')] },
  { id: 'tpl_mob_lower', label: 'Hip & Lower Body', tag: 'Mobility', subTag: 'Lower Body', description: 'Hip and lower body flexibility', type: 'mobility', exercises: [makeMobEx('Hip Flexor Stretch'), makeMobEx('Pigeon Pose'), makeMobEx('Butterfly Stretch'), makeMobEx('Figure Four Stretch'), makeMobEx('Hamstring Stretch'), makeMobEx('Calf Stretch'), makeMobEx('IT Band Stretch')] },
  { id: 'tpl_mob_upper', label: 'Upper Body & Shoulders', tag: 'Mobility', subTag: 'Upper Body', description: 'Upper body and shoulder mobility', type: 'mobility', exercises: [makeMobEx('Chest Opener Stretch'), makeMobEx('Shoulder Cross Body Stretch'), makeMobEx('Doorway Pec Stretch'), makeMobEx('Lat Stretch'), makeMobEx('Neck Side Stretch'), makeMobEx('Wrist Circles'), makeMobEx('Thoracic Extension')] },
  { id: 'tpl_mob_morning', label: 'Morning Routine', tag: 'Mobility', subTag: 'Morning', description: 'Wake up your body with this morning flow', type: 'mobility', exercises: [makeMobEx('Cat-Cow'), makeMobEx("Child's Pose"), makeMobEx('Downward Dog'), makeMobEx('Hip Flexor Stretch'), makeMobEx('Thoracic Rotation'), makeMobEx("World's Greatest Stretch"), makeMobEx('Spinal Twist')] },
  { id: 'tpl_mob_postworkout', label: 'Post-Workout Stretch', tag: 'Mobility', subTag: 'Post-Workout', description: 'Cool down and recover after training', type: 'mobility', exercises: [makeMobEx('Quad Stretch'), makeMobEx('Hamstring Stretch'), makeMobEx('Hip Flexor Stretch'), makeMobEx('Chest Opener Stretch'), makeMobEx('Shoulder Cross Body Stretch'), makeMobEx('Pigeon Pose'), makeMobEx('Spinal Twist')] },
  { id: 'tpl_mob_desk', label: 'Desk Worker Relief', tag: 'Mobility', subTag: 'Desk Relief', description: 'Combat the effects of sitting all day', type: 'mobility', exercises: [makeMobEx('Neck Side Stretch'), makeMobEx('Chest Opener Stretch'), makeMobEx('Hip Flexor Stretch'), makeMobEx('Thoracic Rotation'), makeMobEx('Wrist Circles'), makeMobEx('Seated Figure Four'), makeMobEx('Cat-Cow')] },
  { id: 'tpl_mob_warmup', label: 'Athletic Warm-Up', tag: 'Mobility', subTag: 'Warm-Up', description: 'Dynamic warm-up before training', type: 'mobility', exercises: [makeMobEx('Leg Swings'), makeMobEx('Arm Circles'), makeMobEx('Hip Circles'), makeMobEx("World's Greatest Stretch"), makeMobEx('Inchworm'), makeMobEx('High Knees'), makeMobEx('Lateral Lunge')] },
];

const TEMPLATE_GROUPS = [...new Set(PROGRAM_TEMPLATES.map(t => t.tag))];

// ── HOME WORKOUT WEEKLY PLANS ──
const HOME_WEEKLY_PLANS = [
  {
    id: 'plan_bw_2', tag: 'Home (Bodyweight)', days: 2,
    label: '2 Days — Full Body A + B',
    description: 'Two different full body sessions — push focus on day 1, pull focus on day 2. Every muscle hit 2x/week.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_home_fullbody_a', 'tpl_home_fullbody_b'],
    dayLabels: ['Mon', 'Thu'],
  },
  {
    id: 'plan_bw_3', tag: 'Home (Bodyweight)', days: 3,
    label: '3 Days — Full Body A / B / C',
    description: 'Three different full body sessions rotating push, pull and legs focus. Each muscle trained 3x per week — optimal for growth.',
    note: '⚡ Each muscle hit 3x/week',
    programs: ['tpl_home_fullbody_a', 'tpl_home_fullbody_b', 'tpl_home_fullbody_c'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'plan_bw_4', tag: 'Home (Bodyweight)', days: 4,
    label: '4 Days — Full Body A / B / C + Core',
    description: 'Three varied full body sessions plus a dedicated core day. Push, pull and legs each hit 3x per week.',
    note: '⚡ Each muscle hit 3x/week',
    programs: ['tpl_home_fullbody_a', 'tpl_home_fullbody_b', 'tpl_home_core', 'tpl_home_fullbody_c'],
    dayLabels: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
  {
    id: 'plan_bw_5', tag: 'Home (Bodyweight)', days: 5,
    label: '5 Days — A / B / C + Push / Pull',
    description: 'Full body A/B/C plus extra push and pull sessions for higher upper body frequency.',
    note: '⚡ Upper body hit 4x/week',
    programs: ['tpl_home_fullbody_a', 'tpl_home_fullbody_b', 'tpl_home_fullbody_c', 'tpl_home_push', 'tpl_home_pull'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'plan_bw_6', tag: 'Home (Bodyweight)', days: 6,
    label: '6 Days — Push / Pull / Legs × 2',
    description: 'Full PPL repeated twice per week — each muscle trained 2x with different sessions.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_home_push', 'tpl_home_pull', 'tpl_home_legs', 'tpl_home_push', 'tpl_home_pull', 'tpl_home_legs'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  {
    id: 'plan_db_2', tag: 'Home (Dumbbells)', days: 2,
    label: '2 Days — Full Body A + B',
    description: 'Two different full body dumbbell sessions — push focus day 1, pull focus day 2. Every muscle hit 2x/week.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_home_db_fullbody_a', 'tpl_home_db_fullbody_b'],
    dayLabels: ['Mon', 'Thu'],
  },
  {
    id: 'plan_db_3', tag: 'Home (Dumbbells)', days: 3,
    label: '3 Days — Full Body A / B / C',
    description: 'Three varied full body dumbbell sessions — push, pull and legs focus rotating each day. Each muscle 3x/week.',
    note: '⚡ Each muscle hit 3x/week',
    programs: ['tpl_home_db_fullbody_a', 'tpl_home_db_fullbody_b', 'tpl_home_db_fullbody_c'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'plan_db_4', tag: 'Home (Dumbbells)', days: 4,
    label: '4 Days — Upper / Lower × 2',
    description: 'Upper body twice and lower body twice per week. Every muscle trained 2x — optimal frequency.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_home_db_upper', 'tpl_home_db_lower', 'tpl_home_db_upper', 'tpl_home_db_lower'],
    dayLabels: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
  {
    id: 'plan_db_5', tag: 'Home (Dumbbells)', days: 5,
    label: '5 Days — Full Body A / B / C + Push / Pull',
    description: 'Three full body variations plus dedicated push and pull for extra upper body volume.',
    note: '⚡ Upper body hit 4x/week',
    programs: ['tpl_home_db_fullbody_a', 'tpl_home_db_fullbody_b', 'tpl_home_db_fullbody_c', 'tpl_home_db_push', 'tpl_home_db_pull'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'plan_db_6', tag: 'Home (Dumbbells)', days: 6,
    label: '6 Days — Push / Pull / Legs × 2',
    description: 'Full PPL split repeated twice per week — each muscle trained 2x. Maximum stimulus with dumbbells.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_home_db_push', 'tpl_home_db_pull', 'tpl_home_db_legs', 'tpl_home_db_push', 'tpl_home_db_pull', 'tpl_home_db_legs'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  // ── PPL ──
  {
    id: 'plan_ppl_3', tag: 'PPL', days: 3,
    label: '3 Days — Push / Pull / Legs',
    description: 'Classic PPL — each muscle group hit once per week. Good starting point for beginners.',
    note: '⚡ Each muscle hit 1x/week',
    programs: ['tpl_push', 'tpl_pull', 'tpl_legs'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'plan_ppl_4', tag: 'PPL', days: 4,
    label: '4 Days — Push / Pull / Legs + Upper',
    description: 'PPL with an extra upper body day for higher chest, back and shoulder frequency.',
    note: '⚡ Upper body hit 2x/week',
    programs: ['tpl_push', 'tpl_pull', 'tpl_legs', 'tpl_upper'],
    dayLabels: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
  {
    id: 'plan_ppl_5', tag: 'PPL', days: 5,
    label: '5 Days — Push / Pull / Legs / Push / Pull',
    description: 'PPL with push and pull repeated — chest, back, shoulders and arms hit twice per week.',
    note: '⚡ Upper body hit 2x/week',
    programs: ['tpl_push', 'tpl_pull', 'tpl_legs', 'tpl_push', 'tpl_pull'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'plan_ppl_6', tag: 'PPL', days: 6,
    label: '6 Days — Push / Pull / Legs × 2',
    description: 'Full PPL repeated twice per week — every muscle trained 2x. The most popular PPL split for intermediate lifters.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_push', 'tpl_pull', 'tpl_legs', 'tpl_push', 'tpl_pull', 'tpl_legs'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  // ── Upper/Lower ──
  {
    id: 'plan_ul_2', tag: 'Upper/Lower', days: 2,
    label: '2 Days — Upper + Lower',
    description: 'One upper session and one lower session. Each muscle hit once — good for maintenance or beginners.',
    note: '⚡ Each muscle hit 1x/week',
    programs: ['tpl_upper', 'tpl_lower'],
    dayLabels: ['Mon', 'Thu'],
  },
  {
    id: 'plan_ul_3', tag: 'Upper/Lower', days: 3,
    label: '3 Days — Upper / Lower / Upper',
    description: 'Upper body hit twice, lower body once. Good if upper body is your priority.',
    note: '⚡ Upper hit 2x — Lower hit 1x/week',
    programs: ['tpl_upper', 'tpl_lower', 'tpl_upper'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'plan_ul_4', tag: 'Upper/Lower', days: 4,
    label: '4 Days — Upper / Lower × 2',
    description: 'Upper and lower body each trained twice per week. The gold standard for natural lifters — optimal frequency.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_upper', 'tpl_lower', 'tpl_upper', 'tpl_lower'],
    dayLabels: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
  {
    id: 'plan_ul_5', tag: 'Upper/Lower', days: 5,
    label: '5 Days — Upper / Lower / Upper / Lower / Upper',
    description: 'Upper body hit 3x, lower body 2x per week. High frequency for upper body development.',
    note: '⚡ Upper hit 3x — Lower hit 2x/week',
    programs: ['tpl_upper', 'tpl_lower', 'tpl_upper', 'tpl_lower', 'tpl_upper'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'plan_ul_6', tag: 'Upper/Lower', days: 6,
    label: '6 Days — Upper / Lower × 3',
    description: 'Upper and lower body each trained 3 times per week. Maximum frequency — best for advanced lifters.',
    note: '⚡ Each muscle hit 3x/week',
    programs: ['tpl_upper', 'tpl_lower', 'tpl_upper', 'tpl_lower', 'tpl_upper', 'tpl_lower'],
    dayLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  // ── Full Body ──
  {
    id: 'plan_fb_2', tag: 'Full Body', days: 2,
    label: '2 Days — Full Body A + B',
    description: 'Two different full body sessions — squat focus on day 1, deadlift focus on day 2. Every muscle hit 2x/week.',
    note: '⚡ Each muscle hit 2x/week',
    programs: ['tpl_fullbody_a', 'tpl_fullbody_b'],
    dayLabels: ['Mon', 'Thu'],
  },
  {
    id: 'plan_fb_3', tag: 'Full Body', days: 3,
    label: '3 Days — Full Body A / B / A',
    description: 'Alternating full body sessions — every muscle trained 3x per week. Optimal for strength and size gains.',
    note: '⚡ Each muscle hit 3x/week',
    programs: ['tpl_fullbody_a', 'tpl_fullbody_b', 'tpl_fullbody_a'],
    dayLabels: ['Mon', 'Wed', 'Fri'],
  },
  {
    id: 'plan_fb_4', tag: 'Full Body', days: 4,
    label: '4 Days — Full Body A / B / A / B',
    description: 'Four full body sessions alternating A and B — every muscle hit 4x per week at moderate volume.',
    note: '⚡ Each muscle hit 4x/week',
    programs: ['tpl_fullbody_a', 'tpl_fullbody_b', 'tpl_fullbody_a', 'tpl_fullbody_b'],
    dayLabels: ['Mon', 'Tue', 'Thu', 'Fri'],
  },
];

const buildFullCatalogue = (customExercises) => {
  const merged = {};
  Object.entries(DEFAULT_EXERCISE_CATALOGUE).forEach(([group, exercises]) => { merged[group] = [...exercises]; });
  Object.entries(customExercises).forEach(([group, exercises]) => {
    if (merged[group]) { exercises.forEach(ex => { if (!merged[group].includes(ex)) merged[group].push(ex); }); }
    else { merged[group] = [...exercises]; }
  });
  return merged;
};

const findMuscleGroup = (exerciseName, customExercises) => {
  const full = buildFullCatalogue(customExercises);
  for (const [group, exercises] of Object.entries(full)) {
    if (exercises.some(ex => ex.toLowerCase() === exerciseName.toLowerCase())) return group;
  }
  return null;
};

const compressProgram = (program) => {
  try {
    const minimal = { n: program.name, t: program.type || 'strength', e: program.exercises.map(ex => ({ n: ex.name, s: ex.sets, t: ex.type || 'strength', d: ex.duration || 30 })) };
    return btoa(encodeURIComponent(JSON.stringify(minimal)));
  } catch (e) { return null; }
};

const decompressProgram = (encoded) => {
  try {
    const minimal = JSON.parse(decodeURIComponent(atob(encoded)));
    return {
      name: minimal.n, type: minimal.t || 'strength',
      exercises: minimal.e.map(ex => ({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, name: ex.n, sets: ex.s, type: ex.t || 'strength', duration: ex.d || 30, groupId: null, history: [], pr: null, note: '' })),
    };
  } catch (e) { return null; }
};

// ── Muscle Heatmap ──
function MuscleHeatmap({ program, customExercises, customDetailedMuscles }) {
  const getDetailedMuscleLocal = (exerciseName) => {
    const key = Object.keys(EXERCISE_TO_DETAILED_MUSCLE).find(k => k.toLowerCase() === exerciseName.toLowerCase());
    if (key) return EXERCISE_TO_DETAILED_MUSCLE[key];
    return customDetailedMuscles[exerciseName.toLowerCase()] || null;
  };

  const trained = new Set();
  program.exercises.forEach(ex => {
    const muscle = getDetailedMuscleLocal(ex.name);
    if (muscle) trained.add(muscle);
  });

  const active = (muscle) => trained.has(muscle) ? '#e94560' : 'rgba(128,128,128,0.25)';
  const stroke = 'rgba(128,128,128,0.5)';
  const sw = '1';

  return (
    <svg viewBox="0 0 120 85" style={{ width: '130px', height: '90px', flexShrink: 0 }}>
      {/* ── FRONT BODY ── */}
      {/* Head */}
      <ellipse cx="22" cy="6" rx="5" ry="6" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Neck */}
      <rect x="20" y="11" width="4" height="4" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Chest */}
      <rect x="14" y="15" width="16" height="10" rx="2" fill={active('Chest (Overall)')} stroke={stroke} strokeWidth={sw} />
      {/* Front Delts left */}
      <rect x="9" y="15" width="5" height="7" rx="1" fill={active('Front Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Front Delts right */}
      <rect x="30" y="15" width="5" height="7" rx="1" fill={active('Front Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Side Delts left */}
      <rect x="7" y="15" width="3" height="5" rx="1" fill={active('Side Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Side Delts right */}
      <rect x="34" y="15" width="3" height="5" rx="1" fill={active('Side Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Biceps left */}
      <rect x="8" y="23" width="5" height="9" rx="1" fill={active('Biceps')} stroke={stroke} strokeWidth={sw} />
      {/* Biceps right */}
      <rect x="31" y="23" width="5" height="9" rx="1" fill={active('Biceps')} stroke={stroke} strokeWidth={sw} />
      {/* Forearm left */}
      <rect x="8" y="33" width="4" height="8" rx="1" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Forearm right */}
      <rect x="32" y="33" width="4" height="8" rx="1" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Abs */}
      <rect x="17" y="26" width="10" height="14" rx="2" fill={active('Abs')} stroke={stroke} strokeWidth={sw} />
      {/* Quads left */}
      <rect x="15" y="42" width="7" height="16" rx="2" fill={active('Quads')} stroke={stroke} strokeWidth={sw} />
      {/* Quads right */}
      <rect x="23" y="42" width="7" height="16" rx="2" fill={active('Quads')} stroke={stroke} strokeWidth={sw} />
      {/* Calves left front */}
      <rect x="15" y="60" width="6" height="12" rx="2" fill={active('Calves')} stroke={stroke} strokeWidth={sw} />
      {/* Calves right front */}
      <rect x="23" y="60" width="6" height="12" rx="2" fill={active('Calves')} stroke={stroke} strokeWidth={sw} />

      {/* ── BACK BODY ── */}
      {/* Head */}
      <ellipse cx="98" cy="6" rx="5" ry="6" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Neck */}
      <rect x="96" y="11" width="4" height="4" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Upper Back */}
      <rect x="90" y="15" width="16" height="10" rx="2" fill={active('Upper Back')} stroke={stroke} strokeWidth={sw} />
      {/* Rear Delts left */}
      <rect x="85" y="15" width="5" height="7" rx="1" fill={active('Rear Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Rear Delts right */}
      <rect x="106" y="15" width="5" height="7" rx="1" fill={active('Rear Delts')} stroke={stroke} strokeWidth={sw} />
      {/* Lats left */}
      <rect x="86" y="23" width="6" height="10" rx="1" fill={active('Lats')} stroke={stroke} strokeWidth={sw} />
      {/* Lats right */}
      <rect x="104" y="23" width="6" height="10" rx="1" fill={active('Lats')} stroke={stroke} strokeWidth={sw} />
      {/* Triceps left */}
      <rect x="83" y="23" width="4" height="9" rx="1" fill={active('Triceps')} stroke={stroke} strokeWidth={sw} />
      {/* Triceps right */}
      <rect x="109" y="23" width="4" height="9" rx="1" fill={active('Triceps')} stroke={stroke} strokeWidth={sw} />
      {/* Forearm left back */}
      <rect x="83" y="33" width="4" height="8" rx="1" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Forearm right back */}
      <rect x="109" y="33" width="4" height="8" rx="1" fill="rgba(128,128,128,0.25)" stroke={stroke} strokeWidth={sw} />
      {/* Glutes */}
      <rect x="90" y="26" width="16" height="10" rx="2" fill={active('Glutes')} stroke={stroke} strokeWidth={sw} />
      {/* Hamstrings left */}
      <rect x="90" y="38" width="7" height="16" rx="2" fill={active('Hamstrings')} stroke={stroke} strokeWidth={sw} />
      {/* Hamstrings right */}
      <rect x="99" y="38" width="7" height="16" rx="2" fill={active('Hamstrings')} stroke={stroke} strokeWidth={sw} />
      {/* Calves left back */}
      <rect x="90" y="56" width="6" height="16" rx="2" fill={active('Calves')} stroke={stroke} strokeWidth={sw} />
      {/* Calves right back */}
      <rect x="98" y="56" width="6" height="16" rx="2" fill={active('Calves')} stroke={stroke} strokeWidth={sw} />

      {/* Divider line between front and back */}
      <line x1="60" y1="0" x2="60" y2="80" stroke="rgba(128,128,128,0.2)" strokeWidth="1" strokeDasharray="3,3" />
      {/* Labels */}
      <text x="22" y="83" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(128,128,128,0.9)">FRONT</text>
      <text x="98" y="83" textAnchor="middle" fontSize="7" fontWeight="700" fill="rgba(128,128,128,0.9)">BACK</text>
    </svg>
  );
}

// ── Swipeable set row ──
function SwipeableSetRow({ children, onSwipeComplete, disabled }) {
  const [translateX, setTranslateX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startXRef = useRef(null); const startYRef = useRef(null);
  const translateXRef = useRef(0); const swipingRef = useRef(false);
  const directionLockedRef = useRef(null); const rowRef = useRef(null);
  const onSwipeCompleteRef = useRef(onSwipeComplete);
  const disabledRef = useRef(disabled);
  useEffect(() => { onSwipeCompleteRef.current = onSwipeComplete; }, [onSwipeComplete]);
  useEffect(() => { disabledRef.current = disabled; }, [disabled]);
  const THRESHOLD = 80;
  useEffect(() => {
    const el = rowRef.current; if (!el) return;
    const handleTouchStart = (e) => { if (disabledRef.current) return; startXRef.current = e.touches[0].clientX; startYRef.current = e.touches[0].clientY; swipingRef.current = true; directionLockedRef.current = null; };
    const handleTouchMove = (e) => {
      if (!swipingRef.current || startXRef.current === null) return;
      const dx = e.touches[0].clientX - startXRef.current; const dy = e.touches[0].clientY - startYRef.current;
      if (directionLockedRef.current === null) {
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5) directionLockedRef.current = 'horizontal';
        else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) directionLockedRef.current = 'vertical';
        else return;
      }
      if (directionLockedRef.current === 'vertical') return;
      e.preventDefault();
      if (dx > 0) { const val = Math.min(dx, THRESHOLD + 20); translateXRef.current = val; setTranslateX(val); setSwiping(true); }
    };
    const handleTouchEnd = () => {
      if (!swipingRef.current) return; swipingRef.current = false; directionLockedRef.current = null;
      if (translateXRef.current >= THRESHOLD) { setTranslateX(THRESHOLD + 20); setTimeout(() => { onSwipeCompleteRef.current(); translateXRef.current = 0; setTranslateX(0); setSwiping(false); }, 150); try { if (navigator.vibrate) navigator.vibrate(60); } catch (err) {} }
      else { translateXRef.current = 0; setTranslateX(0); setSwiping(false); }
      startXRef.current = null; startYRef.current = null;
    };
    const handleMouseDown = (e) => { if (disabledRef.current) return; startXRef.current = e.clientX; startYRef.current = e.clientY; swipingRef.current = true; directionLockedRef.current = null; };
    const handleMouseMove = (e) => { if (!swipingRef.current || startXRef.current === null) return; const dx = e.clientX - startXRef.current; if (dx > 0) { const val = Math.min(dx, THRESHOLD + 20); translateXRef.current = val; setTranslateX(val); setSwiping(true); } };
    const handleMouseUp = () => {
      if (!swipingRef.current) return; swipingRef.current = false;
      if (translateXRef.current >= THRESHOLD) { setTranslateX(THRESHOLD + 20); setTimeout(() => { onSwipeCompleteRef.current(); translateXRef.current = 0; setTranslateX(0); setSwiping(false); }, 150); }
      else { translateXRef.current = 0; setTranslateX(0); setSwiping(false); }
      startXRef.current = null;
    };
    el.addEventListener('touchstart', handleTouchStart, { passive: true });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd, { passive: true });
    el.addEventListener('mousedown', handleMouseDown);
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseup', handleMouseUp);
    el.addEventListener('mouseleave', handleMouseUp);
    return () => {
      el.removeEventListener('touchstart', handleTouchStart); el.removeEventListener('touchmove', handleTouchMove); el.removeEventListener('touchend', handleTouchEnd);
      el.removeEventListener('mousedown', handleMouseDown); el.removeEventListener('mousemove', handleMouseMove); el.removeEventListener('mouseup', handleMouseUp); el.removeEventListener('mouseleave', handleMouseUp);
    };
  }, []);
  const progress = Math.min(translateX / THRESHOLD, 1);
  return (
    <div className="swipeable-row-wrapper" ref={rowRef}>
      <div className="swipe-reveal" style={{ opacity: progress }}><span className="swipe-reveal-icon" style={{ transform: `scale(${0.5 + progress * 0.5})` }}>✓</span></div>
      <div className={`swipeable-row-inner ${swiping ? 'swiping' : ''}`} style={{ transform: `translateX(${translateX}px)`, transition: swiping ? 'none' : 'transform 0.2s ease' }}>{children}</div>
    </div>
  );
}


// ── PR Line Chart ──
function PRLineChart({ data, darkMode, showReps }) {
  if (!data || data.length < 2) return <p className="subtitle" style={{ textAlign: 'center', padding: '12px 0' }}>Need at least 2 PRs to show chart</p>;
  const width = 300; const height = 140; const paddingLeft = 44; const paddingRight = 12; const paddingTop = 20; const paddingBottom = 28;
  const chartW = width - paddingLeft - paddingRight; const chartH = height - paddingTop - paddingBottom;
  const weights = data.map(d => d.weight); const minW = Math.min(...weights); const maxW = Math.max(...weights); const range = maxW - minW || 1;
  const points = data.map((d, i) => ({ x: paddingLeft + (i / (data.length - 1)) * chartW, y: paddingTop + chartH - ((d.weight - minW) / range) * chartH }));
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');
  const textColor = darkMode ? '#888' : '#666'; const lineColor = '#e94560'; const dotColor = '#e94560'; const lastDotColor = '#c9a84c';
  const gridColor = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const repsColor = darkMode ? 'rgba(201,168,76,0.9)' : 'rgba(140,90,10,0.9)';
  const yLabels = [minW, minW + range / 2, maxW].map((v, i) => ({ value: `${Math.round(v)}`, y: paddingTop + chartH - (i / 2) * chartH }));
  return (
    <div className="pr-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {yLabels.map((l, i) => <line key={i} x1={paddingLeft} y1={l.y} x2={width - paddingRight} y2={l.y} stroke={gridColor} strokeWidth="1" />)}
        {yLabels.map((l, i) => <text key={i} x={paddingLeft - 6} y={l.y + 4} textAnchor="end" fontSize="9" fill={textColor}>{l.value}kg</text>)}
        <text x={paddingLeft} y={height - 4} textAnchor="middle" fontSize="8" fill={textColor}>{data[0].date}</text>
        <text x={width - paddingRight} y={height - 4} textAnchor="end" fontSize="8" fill={textColor}>{data[data.length - 1].date}</text>
        <defs><linearGradient id="prGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={lineColor} stopOpacity="0.3" /><stop offset="100%" stopColor={lineColor} stopOpacity="0.02" /></linearGradient></defs>
        <polygon points={`${paddingLeft},${paddingTop + chartH} ${polyline} ${width - paddingRight},${paddingTop + chartH}`} fill="url(#prGrad)" />
        <polyline points={polyline} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {points.map((p, i) => {
          const isLast = i === points.length - 1;
          const r = isLast ? 5 : 3.5;
          const reps = data[i].reps;
          const labelAbove = p.y > paddingTop + 16;
          const labelY = labelAbove ? p.y - r - 3 : p.y + r + 10;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={r} fill={isLast ? lastDotColor : dotColor} stroke={darkMode ? '#16213e' : '#fff'} strokeWidth="1.5" />
              {showReps && reps > 0 && (
                <text x={p.x} y={labelY} textAnchor="middle" fontSize="8" fontWeight="700" fill={repsColor}>{reps}r</text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ── Volume Bar Chart ──
function VolumeBarChart({ data, darkMode }) {
  if (!data || data.length === 0) return <p className="subtitle" style={{ textAlign: 'center', padding: '12px 0' }}>No data yet</p>;
  const maxVal = Math.max(...data.map(d => d.value), 1); const barColor = '#e94560'; const textColor = darkMode ? '#888' : '#666';
  const width = 300; const height = 100; const paddingLeft = 8; const paddingRight = 8; const paddingTop = 8; const paddingBottom = 24;
  const chartW = width - paddingLeft - paddingRight; const chartH = height - paddingTop - paddingBottom; const barW = Math.floor(chartW / data.length) - 3;
  return (
    <div className="pr-chart-wrapper">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', display: 'block' }}>
        {data.map((d, i) => { const barH = Math.max(2, (d.value / maxVal) * chartH); const x = paddingLeft + i * (chartW / data.length) + 1; const y = paddingTop + chartH - barH; return <g key={i}><rect x={x} y={y} width={barW} height={barH} fill={barColor} rx="2" opacity="0.85" /><text x={x + barW / 2} y={height - 4} textAnchor="middle" fontSize="7" fill={textColor}>{d.label}</text></g>; })}
      </svg>
    </div>
  );
}

// ── Mobility Set Timer ──
function MobilitySetTimer({ duration, onComplete, isDone }) {
  const [timeLeft, setTimeLeft] = useState(duration); const [running, setRunning] = useState(false); const intervalRef = useRef(null);
  useEffect(() => { setTimeLeft(duration); setRunning(false); clearInterval(intervalRef.current); }, [duration]);
  useEffect(() => {
    if (running && timeLeft > 0) { intervalRef.current = setInterval(() => { setTimeLeft(prev => { if (prev <= 1) { clearInterval(intervalRef.current); setRunning(false); return 0; } return prev - 1; }); }, 1000); }
    return () => clearInterval(intervalRef.current);
  }, [running]);
  const progress = ((duration - timeLeft) / duration) * 100;
  if (isDone) return <div className="mobility-set-done">✓ Done — {duration}s</div>;
  return (
    <div className="mobility-set-timer">
      <div className="mobility-timer-bar-bg"><div className="mobility-timer-bar-fill" style={{ width: `${progress}%` }} /></div>
      <div className="mobility-timer-row">
        <span className="mobility-timer-count">{timeLeft}s</span>
        {!running && timeLeft === duration && <button className="mobility-start-btn" onClick={() => setRunning(true)}>▶ Start</button>}
        {running && <button className="mobility-pause-btn" onClick={() => { setRunning(false); clearInterval(intervalRef.current); }}>⏸ Pause</button>}
        {!running && timeLeft < duration && timeLeft > 0 && <button className="mobility-start-btn" onClick={() => setRunning(true)}>▶ Resume</button>}
        <button className={`mobility-done-btn ${timeLeft === 0 ? 'mobility-done-btn-ready' : ''}`} onClick={onComplete}>✓ Done</button>
      </div>
    </div>
  );
}

function PRParticleBurst({ active }) {
  if (!active) return null;
  const particles = Array.from({ length: 10 }, (_, i) => ({
    id: i,
    angle: (i / 10) * 360,
    distance: 30 + Math.random() * 20,
    size: 4 + Math.random() * 4,
    color: i % 3 === 0 ? '#c9a84c' : i % 3 === 1 ? '#e94560' : '#ffffff',
    delay: Math.random() * 0.15,
  }));
  return (
    <div className="pr-particle-container">
      {particles.map(p => (
        <div
          key={p.id}
          className="pr-particle"
          style={{
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            '--angle': `${p.angle}deg`,
            '--distance': `${p.distance}px`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-line skeleton-line-title" />
      <div className="skeleton-line skeleton-line-short" />
    </div>
  );
}

function useAnimatedNumber(target, duration = 600) {
  const [display, setDisplay] = useState(target);
  const prevRef = useRef(target);
  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    if (start === end) return;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (end - start) * ease));
      if (progress < 1) requestAnimationFrame(tick);
      else prevRef.current = end;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return display;
}

function App() {
  const [darkMode, setDarkMode] = useState(() => { try { const s = localStorage.getItem('darkMode'); return s === null ? true : s === 'true'; } catch (e) { return true; } });
  useEffect(() => { try { localStorage.setItem('darkMode', String(darkMode)); } catch (e) {} document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  useEffect(() => { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); }, []);

  const [showOnboarding, setShowOnboarding] = useState(() => { try { return !localStorage.getItem('hasCompletedOnboarding'); } catch (e) { return false; } });
  const [onboardingStep, setOnboardingStep] = useState(0);
  useEffect(() => { if (showOnboarding && onboardingStep === 1) setTemplateTab('plans'); }, [showOnboarding, onboardingStep]);

  const [programs, setPrograms] = useState(() => { try { const s = localStorage.getItem('programs'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [globalHistory, setGlobalHistory] = useState(() => { try { const s = localStorage.getItem('globalHistory'); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
  const [workoutHistory, setWorkoutHistory] = useState(() => { try { const s = localStorage.getItem('workoutHistory'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [customExercises, setCustomExercises] = useState(() => { try { const s = localStorage.getItem('customExercises'); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
  const [customDetailedMuscles, setCustomDetailedMuscles] = useState(() => { try { const s = localStorage.getItem('customDetailedMuscles'); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
  const [exerciseNotes, setExerciseNotes] = useState(() => { try { const s = localStorage.getItem('exerciseNotes'); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
  const [favourites, setFavourites] = useState(() => { try { const s = localStorage.getItem('favourites'); return s ? JSON.parse(s) : []; } catch (e) { return []; } });
  const [globalPRHistory, setGlobalPRHistory] = useState(() => { try { const s = localStorage.getItem('globalPRHistory'); return s ? JSON.parse(s) : {}; } catch (e) { return {}; } });
  const [lastExportDate, setLastExportDate] = useState(() => { try { return localStorage.getItem('lastExportDate') || null; } catch (e) { return null; } });

  const [showExportReminder, setShowExportReminder] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('home');
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newProgramName, setNewProgramName] = useState('');
  const [newProgramType, setNewProgramType] = useState('strength');
  const [showDeleteProgramModal, setShowDeleteProgramModal] = useState(false);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showWorkoutExerciseModal, setShowWorkoutExerciseModal] = useState(false);
  const [newExerciseName, setNewExerciseName] = useState('');
  const [catalogueSearch, setCatalogueSearch] = useState('');
  const [workoutCatalogueSearch, setWorkoutCatalogueSearch] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('All');
  const [workoutMuscleGroup, setWorkoutMuscleGroup] = useState('All');
  const [catalogueTab, setCatalogueTab] = useState('exercises');
  const [workoutCatalogueTab, setWorkoutCatalogueTab] = useState('exercises');
  const [workoutStartTime, setWorkoutStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [completedSets, setCompletedSets] = useState({});
  const [doneExercises, setDoneExercises] = useState([]);
  const [setLogs, setSetLogs] = useState({});
  const [newPRCount, setNewPRCount] = useState(0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [restTime, setRestTime] = useState(0);
  const [restStartTime, setRestStartTime] = useState(null);
  const [restDuration, setRestDuration] = useState(120);
  const [isResting, setIsResting] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteExercise, setNoteExercise] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showTipModal, setShowTipModal] = useState(false);
  const [tipExercise, setTipExercise] = useState(null);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subExercise, setSubExercise] = useState(null);
  const [progressSearch, setProgressSearch] = useState('');
  const [expandedExercise, setExpandedExercise] = useState(null);
  const [expandedWorkout, setExpandedWorkout] = useState(null);
  const [showMuscleGroupPicker, setShowMuscleGroupPicker] = useState(false);
  const [showDetailedMusclePicker, setShowDetailedMusclePicker] = useState(false);
  const [pendingMuscleGroup, setPendingMuscleGroup] = useState(null);
  const [expandedMuscleInfo, setExpandedMuscleInfo] = useState(null);
  const [pendingCustomExercise, setPendingCustomExercise] = useState('');
  const [pendingFromWorkout, setPendingFromWorkout] = useState(false);
  const [showRemoveExerciseModal, setShowRemoveExerciseModal] = useState(false);
  const [exerciseToRemove, setExerciseToRemove] = useState(null);
  const [showSaveToProgram, setShowSaveToProgram] = useState(false);
  const [pendingWorkoutExercise, setPendingWorkoutExercise] = useState(null);
  const [showRemoveWorkoutModal, setShowRemoveWorkoutModal] = useState(false);
  const [exerciseToRemoveFromWorkout, setExerciseToRemoveFromWorkout] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearTarget, setClearTarget] = useState(null);
  const [showPlateCalc, setShowPlateCalc] = useState(false);
  const [plateCalcWeight, setPlateCalcWeight] = useState('');
  const [barWeight, setBarWeight] = useState(20);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [templateTab, setTemplateTab] = useState('all');
  const [showSubGuideModal, setShowSubGuideModal] = useState(false);
  const [subGuideExercises, setSubGuideExercises] = useState([]);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [exerciseToRename, setExerciseToRename] = useState(null);
  const [renameText, setRenameText] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const [importError, setImportError] = useState(false);
  const [showCancelWorkoutModal, setShowCancelWorkoutModal] = useState(false);
  const [showFinishWorkoutModal, setShowFinishWorkoutModal] = useState(false);
  const [groupingSourceId, setGroupingSourceId] = useState(null);
  const [groupingSelectedIds, setGroupingSelectedIds] = useState([]);
  const [collapsedGroups, setCollapsedGroups] = useState({});
  const [showCustomExerciseManager, setShowCustomExerciseManager] = useState(false);
  const [editingCustomExercise, setEditingCustomExercise] = useState(null);
  const [editCustomName, setEditCustomName] = useState('');
  const [editCustomMuscleGroup, setEditCustomMuscleGroup] = useState('');
  const [editCustomDetailedMuscle, setEditCustomDetailedMuscle] = useState('');
  const [editMuscleInfoExpanded, setEditMuscleInfoExpanded] = useState(null);
  const [setPRStatuses, setSetPRStatuses] = useState({});
  const [flashingPRs, setFlashingPRs] = useState({});
  const [feedbackText, setFeedbackText] = useState('');
  const [collapsedWorkoutExercises, setCollapsedWorkoutExercises] = useState({});
  const [completionOrder, setCompletionOrder] = useState([]);
  const [expandedVolumeGroups, setExpandedVolumeGroups] = useState({});
  const [summaryData, setSummaryData] = useState(null);
  const [volumeTrendMuscle, setVolumeTrendMuscle] = useState('Chest');
  const [showRepeatWorkoutModal, setShowRepeatWorkoutModal] = useState(false);
  const [workoutToRepeat, setWorkoutToRepeat] = useState(null);
  const [showImportProgramModal, setShowImportProgramModal] = useState(false);
  const [importProgramData, setImportProgramData] = useState(null);
  const [showImportLinkModal, setShowImportLinkModal] = useState(false);
  const [importLinkText, setImportLinkText] = useState('');
  const [importLinkError, setImportLinkError] = useState('');
  const [expandedBalanceSection, setExpandedBalanceSection] = useState(false);
  const [expandedTrendSection, setExpandedTrendSection] = useState(false);
  const [balanceTrendTab, setBalanceTrendTab] = useState('balance');
  const [achievementToast, setAchievementToast] = useState(null);
  const [profileTab, setProfileTab] = useState('active');
  const [showWeeklyPlanModal, setShowWeeklyPlanModal] = useState(false);
  const [weeklyPlanTag, setWeeklyPlanTag] = useState(null);
  const [weeklyPlanDays, setWeeklyPlanDays] = useState(3);
  const [historyTab, setHistoryTab] = useState('workouts');
  const [syncUserId, setSyncUserId] = useState(() => {
    try { return localStorage.getItem('syncUserId') || null; } catch (e) { return null; }
  });
  const [syncStatus, setSyncStatus] = useState('idle'); // idle | syncing | success | error
  const [syncRestoreStatus, setSyncRestoreStatus] = useState('idle'); // idle | loading | success | error
  const [lastSyncDate, setLastSyncDate] = useState(() => {
    try { return localStorage.getItem('lastSyncDate') || null; } catch (e) { return null; }
  });
  const [showSyncSetupModal, setShowSyncSetupModal] = useState(false);
  const [syncModalMode, setSyncModalMode] = useState('create'); // create | restore
  const [showSyncRestoreModal, setShowSyncRestoreModal] = useState(false);
  const [syncRestoreData, setSyncRestoreData] = useState(null);
  const [syncPinInput, setSyncPinInput] = useState('');
  const [syncPinError, setSyncPinError] = useState('');
  const [syncSetupStep, setSyncSetupStep] = useState('create'); // create | confirm
  const [syncPinConfirm, setSyncPinConfirm] = useState('');
  const [programOptionsIndex, setProgramOptionsIndex] = useState(null);
  const [appReady, setAppReady] = useState(false);
  const [showUngroupModal, setShowUngroupModal] = useState(false);
  const [ungroupTarget, setUngroupTarget] = useState(null);
  const [showJoinGroupModal, setShowJoinGroupModal] = useState(false);
  const [joinGroupTarget, setJoinGroupTarget] = useState(null); // { exerciseId, groupId, groupName } // { type: 'all' | 'single', groupId, exerciseId }
  const [deloadWeek, setDeloadWeek] = useState(() => {
    try {
      const s = localStorage.getItem('deloadWeek');
      if (!s) return null;
      const parsed = JSON.parse(s);
      // Auto-expire if the week has passed
      const now = new Date();
      const dayOfWeek = now.getDay();
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() + (dayOfWeek === 0 ? -6 : 1 - dayOfWeek));
      thisMonday.setHours(0, 0, 0, 0);
      if (parsed.weekStart < thisMonday.getTime()) {
        localStorage.removeItem('deloadWeek');
        return null;
      }
      return parsed;
    } catch (e) { return null; }
  });

  const summaryCardRef = useRef(null);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);
  const restTimerRef = useRef(null);
  const importInputRef = useRef(null);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get('program');
      if (encoded) {
        const program = decompressProgram(encoded);
        if (program) { setImportProgramData(program); setShowImportProgramModal(true); window.history.replaceState({}, '', window.location.pathname); }
      }
    } catch (e) {}
  }, []);

  // ── One-time PR migration — rebuilds globalPRHistory using kg+reps score system ──
  useEffect(() => {
    try {
      const migrationKey = 'prMigrationV2Done';
      if (localStorage.getItem(migrationKey)) return;
      if (workoutHistory.length === 0) return;

      const rebuilt = {};

      workoutHistory.forEach(workout => {
        workout.exercises.forEach(exercise => {
          if ((exercise.type || 'strength') !== 'strength') return;
          if (!exercise.sets || exercise.sets.length === 0) return;

          const key = exercise.name.toLowerCase();
          if (!rebuilt[key]) rebuilt[key] = [];

          exercise.sets.forEach(set => {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps) || 0;
            if (weight > 0 && reps > 0) {
              rebuilt[key].push({
                date: workout.date,
                dateTimestamp: workout.dateTimestamp,
                weight,
                reps,
                sets: exercise.sets,
                name: exercise.name,
              });
            }
          });
        });
      });

      // For each exercise keep only genuine PRs using the score system
      const migrated = {};
      Object.entries(rebuilt).forEach(([key, entries]) => {
        const sorted = [...entries].sort((a, b) => {
          const dc = a.dateTimestamp - b.dateTimestamp;
          return dc !== 0 ? dc : ((parseFloat(a.weight) || 0) * 1000 + (parseInt(a.reps) || 0)) - ((parseFloat(b.weight) || 0) * 1000 + (parseInt(b.reps) || 0));
        });
        let runningBestScore = 0;
        const genuinePRs = [];
        sorted.forEach(entry => {
          const score = (parseFloat(entry.weight) || 0) * 1000 + (parseInt(entry.reps) || 0);
          if (score > runningBestScore) {
            runningBestScore = score;
            genuinePRs.push(entry);
          }
        });
        if (genuinePRs.length > 0) migrated[key] = genuinePRs;
      });

      setGlobalPRHistory(migrated);
      localStorage.setItem(migrationKey, 'true');
    } catch (e) {
      console.error('PR migration failed:', e);
    }
  }, []);

  useEffect(() => { try { localStorage.setItem('programs', JSON.stringify(programs)); } catch (e) {} }, [programs]);
  useEffect(() => { try { localStorage.setItem('globalHistory', JSON.stringify(globalHistory)); } catch (e) {} }, [globalHistory]);
  useEffect(() => { try { localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory)); } catch (e) {} }, [workoutHistory]);
  useEffect(() => { try { localStorage.setItem('customExercises', JSON.stringify(customExercises)); } catch (e) {} }, [customExercises]);
  useEffect(() => { try { localStorage.setItem('customDetailedMuscles', JSON.stringify(customDetailedMuscles)); } catch (e) {} }, [customDetailedMuscles]);
  useEffect(() => { try { localStorage.setItem('exerciseNotes', JSON.stringify(exerciseNotes)); } catch (e) {} }, [exerciseNotes]);
  useEffect(() => { try { localStorage.setItem('favourites', JSON.stringify(favourites)); } catch (e) {} }, [favourites]);
  useEffect(() => { try { localStorage.setItem('globalPRHistory', JSON.stringify(globalPRHistory)); } catch (e) {} }, [globalPRHistory]);
  useEffect(() => { try { if (lastExportDate) localStorage.setItem('lastExportDate', lastExportDate); } catch (e) {} }, [lastExportDate]);
  useEffect(() => {
    try {
      if (deloadWeek) localStorage.setItem('deloadWeek', JSON.stringify(deloadWeek));
      else localStorage.removeItem('deloadWeek');
    } catch (e) {}
  }, [deloadWeek]);

  useEffect(() => {
    if (currentScreen === 'home' || currentScreen === 'profile') {
      const oldXP = pendingXPRef.current !== null ? pendingXPRef.current : prevXPRef.current;
      if (totalXP !== oldXP) {
        const oldLevel = getLevelFromXP(oldXP).level;
        const newLevel = getLevelFromXP(totalXP).level;
        const didLevelUp = newLevel > oldLevel;

        setDisplayXP(oldXP);
        pendingXPRef.current = null;

        if (didLevelUp) {
          // Phase 1 — animate bar filling to 100%
          const levelUpXP = LEVELS.find(l => l.level === newLevel)?.xp || totalXP;
          const justBeforeLevelUp = levelUpXP - 1;
          setTimeout(() => {
            setDisplayXP(justBeforeLevelUp);
          }, 400);
          // Phase 2 — show level up animation
          setTimeout(() => {
            setLevelUpAnimation({ fromLevel: oldLevel, toLevel: newLevel });
            setBarOverride(100);
          }, 400 + 1900);
          // Phase 3 — reset bar to 0 and animate up from new level baseline
          setTimeout(() => {
            setBarOverride(0);
          }, 400 + 1900 + 600);
          // Phase 4 — animate to final XP
          setTimeout(() => {
            setBarOverride(null);
            setDisplayXP(totalXP);
            prevXPRef.current = totalXP;
          }, 400 + 1900 + 900);
          // Phase 5 — clear level up animation
          setTimeout(() => {
            setLevelUpAnimation(null);
          }, 400 + 1900 + 3500);
        } else {
          setTimeout(() => {
            setDisplayXP(totalXP);
            prevXPRef.current = totalXP;
          }, 400);
        }
      } else {
        setDisplayXP(totalXP);
        prevXPRef.current = totalXP;
        pendingXPRef.current = null;
      }
    }
  }, [currentScreen]);
  useEffect(() => {
    if (workoutHistory.length === 0) return;
    if (syncUserId) {
      // Already syncing — no reminder needed
      setShowExportReminder(false);
      return;
    }
    const now = Date.now();
    const fourWeeksMs = 4 * 7 * 24 * 60 * 60 * 1000;
    const baseline = lastExportDate ? new Date(lastExportDate).getTime() : workoutHistory[workoutHistory.length - 1]?.dateTimestamp || now;
    if (now - baseline >= fourWeeksMs) {
      if (!lastExportDate) { setShowExportReminder(true); return; }
      const lastExportTime = new Date(lastExportDate).getTime();
      if (workoutHistory.some(w => w.dateTimestamp > lastExportTime)) setShowExportReminder(true);
    } else { setShowExportReminder(false); }
  }, [workoutHistory, lastExportDate, syncUserId]);

  const getDetailedMuscle = (exerciseName) => {
    const key = Object.keys(EXERCISE_TO_DETAILED_MUSCLE).find(k => k.toLowerCase() === exerciseName.toLowerCase());
    if (key) return EXERCISE_TO_DETAILED_MUSCLE[key];
    return customDetailedMuscles[exerciseName.toLowerCase()] || null;
  };

  useEffect(() => {
    if (workoutStartTime) { timerRef.current = setInterval(() => setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000)), 1000); }
    return () => clearInterval(timerRef.current);
  }, [workoutStartTime]);

  useEffect(() => {
    const h = () => { if (document.visibilityState === 'visible' && workoutStartTime) setElapsedTime(Math.floor((Date.now() - workoutStartTime) / 1000)); };
    document.addEventListener('visibilitychange', h); return () => document.removeEventListener('visibilitychange', h);
  }, [workoutStartTime]);

  useEffect(() => {
    if (!isResting || restStartTime === null) return;
    restTimerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - restStartTime) / 1000); const remaining = restDuration - elapsed;
      if (remaining <= 0) { clearInterval(restTimerRef.current); setIsResting(false); setRestTime(0); setRestStartTime(null); try { localStorage.removeItem('restStart'); localStorage.removeItem('restDuration'); } catch (e) {} playRestEndSound(); }
      else { setRestTime(remaining); }
    }, 500);
    return () => clearInterval(restTimerRef.current);
  }, [isResting, restStartTime, restDuration]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        try {
          const savedStart = localStorage.getItem('restStart'); const savedDur = localStorage.getItem('restDuration');
          if (savedStart && savedDur) {
            const elapsed = Math.floor((Date.now() - parseInt(savedStart)) / 1000); const remaining = parseInt(savedDur) - elapsed;
            if (remaining <= 0) { setIsResting(false); setRestTime(0); setRestStartTime(null); localStorage.removeItem('restStart'); localStorage.removeItem('restDuration'); playRestEndSound(); }
            else { setRestTime(remaining); setRestStartTime(parseInt(savedStart)); setRestDuration(parseInt(savedDur)); setIsResting(true); }
          }
          const fireAt = localStorage.getItem('restNotifFireAt');
          if (fireAt && Date.now() >= parseInt(fireAt)) { try { localStorage.removeItem('restNotifFireAt'); } catch (e) {} playRestEndSound(); }
        } catch (e) {}
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    try {
      const savedStart = localStorage.getItem('restStart'); const savedDur = localStorage.getItem('restDuration');
      if (savedStart && savedDur) {
        const elapsed = Math.floor((Date.now() - parseInt(savedStart)) / 1000); const remaining = parseInt(savedDur) - elapsed;
        if (remaining > 0) { setRestStartTime(parseInt(savedStart)); setRestDuration(parseInt(savedDur)); setRestTime(remaining); setIsResting(true); }
        else { localStorage.removeItem('restStart'); localStorage.removeItem('restDuration'); }
      }
      const fireAt = localStorage.getItem('restNotifFireAt');
      if (fireAt && Date.now() >= parseInt(fireAt)) { try { localStorage.removeItem('restNotifFireAt'); } catch (e) {} playRestEndSound(); }
    } catch (e) {}
  }, []);

  useEffect(() => {
    if (currentScreen === 'workout' && selectedProgram !== null) {
      try { localStorage.setItem('activeWorkout', JSON.stringify({ setLogs, completedSets, doneExercises, elapsedTime, selectedProgram, workoutStartTime })); } catch (e) {}
    }
  }, [setLogs, completedSets, doneExercises, currentScreen]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('activeWorkout');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.selectedProgram !== null && programs[data.selectedProgram] && data.workoutStartTime) {
          setSetLogs(data.setLogs || {}); setCompletedSets(data.completedSets || {}); setDoneExercises(data.doneExercises || []);
          setSelectedProgram(data.selectedProgram); setWorkoutStartTime(data.workoutStartTime); setCurrentScreen('workout');
        }
      }
    } catch (e) {}
    // Small delay so localStorage data is fully loaded before rendering
    const timer = setTimeout(() => setAppReady(true), 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const hashPin = async (pin) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pin + SUPABASE_URL);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const syncToSupabase = async (userId) => {
    if (!userId) return;
    setSyncStatus('syncing');
    try {
      const data = {
        programs, globalHistory, workoutHistory, customExercises,
        customDetailedMuscles, exerciseNotes, favourites, globalPRHistory,
        exportDate: new Date().toISOString(), version: 1,
      };
      // Check if record exists
      const existing = await supabaseRequest(`/backups?user_id=eq.${userId}&select=id`);
      if (existing && existing.length > 0) {
        // Update
        await supabaseRequest(`/backups?user_id=eq.${userId}`, {
          method: 'PATCH',
          body: JSON.stringify({ data, updated_at: new Date().toISOString() }),
        });
      } else {
        // Insert
        await supabaseRequest('/backups', {
          method: 'POST',
          body: JSON.stringify({ user_id: userId, data }),
        });
      }
      const now = new Date().toISOString();
      setLastSyncDate(now);
      try { localStorage.setItem('lastSyncDate', now); } catch (e) {}
      setSyncStatus('success');
      setTimeout(() => setSyncStatus('idle'), 3000);
    } catch (e) {
      console.error('Sync error', e);
      setSyncStatus('error');
      setTimeout(() => setSyncStatus('idle'), 3000);
    }
  };

  const restoreFromSupabase = async (userId) => {
    setSyncRestoreStatus('loading');
    try {
      const result = await supabaseRequest(`/backups?user_id=eq.${userId}&select=data,updated_at`);
      if (!result || result.length === 0) {
        setSyncRestoreStatus('error');
        setTimeout(() => setSyncRestoreStatus('idle'), 3000);
        return;
      }
      setSyncRestoreData({ ...result[0].data, updatedAt: result[0].updated_at });
      setShowSyncRestoreModal(true);
      setSyncRestoreStatus('idle');
    } catch (e) {
      setSyncRestoreStatus('error');
      setTimeout(() => setSyncRestoreStatus('idle'), 3000);
    }
  };

  const confirmSyncRestore = () => {
    if (!syncRestoreData) return;
    if (syncRestoreData.programs) setPrograms(syncRestoreData.programs);
    if (syncRestoreData.globalHistory) setGlobalHistory(syncRestoreData.globalHistory);
    if (syncRestoreData.workoutHistory) setWorkoutHistory(syncRestoreData.workoutHistory);
    if (syncRestoreData.customExercises) setCustomExercises(syncRestoreData.customExercises);
    if (syncRestoreData.customDetailedMuscles) setCustomDetailedMuscles(syncRestoreData.customDetailedMuscles);
    if (syncRestoreData.exerciseNotes) setExerciseNotes(syncRestoreData.exerciseNotes);
    if (syncRestoreData.favourites) setFavourites(syncRestoreData.favourites);
    if (syncRestoreData.globalPRHistory) setGlobalPRHistory(syncRestoreData.globalPRHistory);
    const now = new Date().toISOString();
    setLastSyncDate(now);
    try { localStorage.setItem('lastSyncDate', now); } catch (e) {}
    setShowSyncRestoreModal(false);
    setSyncRestoreData(null);
    setSyncRestoreStatus('success');
    setTimeout(() => setSyncRestoreStatus('idle'), 3000);
  };

  const handleCreateSyncPin = async () => {
    const pin = syncPinInput.trim();
    if (pin.length < 4) { setSyncPinError('PIN must be at least 4 characters'); return; }
    if (syncSetupStep === 'create') {
      setSyncSetupStep('confirm');
      setSyncPinError('');
      return;
    }
    if (syncPinConfirm !== pin) { setSyncPinError('PINs do not match — try again'); setSyncPinConfirm(''); return; }
    try {
      const userId = await hashPin(pin);
      // Check if this PIN is already in use
      const existing = await supabaseRequest(`/backups?user_id=eq.${userId}&select=id`);
      if (existing && existing.length > 0) {
        setSyncPinError('This PIN already has data. Use Restore instead.');
        setSyncSetupStep('create');
        setSyncPinInput('');
        setSyncPinConfirm('');
        return;
      }
      setSyncUserId(userId);
      try { localStorage.setItem('syncUserId', userId); } catch (e) {}
      setShowSyncSetupModal(false);
      setSyncPinInput('');
      setSyncPinConfirm('');
      setSyncSetupStep('create');
      setSyncPinError('');
      // Do first sync immediately
      await syncToSupabase(userId);
    } catch (e) {
      setSyncPinError('Something went wrong — try again');
    }
  };

  const handleRestoreWithPin = async () => {
    const pin = syncPinInput.trim();
    if (pin.length < 4) { setSyncPinError('PIN must be at least 4 characters'); return; }
    try {
      const userId = await hashPin(pin);
      setSyncUserId(userId);
      try { localStorage.setItem('syncUserId', userId); } catch (e) {}
      setShowSyncSetupModal(false);
      setSyncPinInput('');
      setSyncPinError('');
      setSyncSetupStep('create');
      await restoreFromSupabase(userId);
    } catch (e) {
      setSyncPinError('Something went wrong — try again');
    }
  };

  const disconnectSync = () => {
    setSyncUserId(null);
    try { localStorage.removeItem('syncUserId'); localStorage.removeItem('lastSyncDate'); } catch (e) {}
    setLastSyncDate(null);
  };

  const toggleDeloadWeek = () => {
    if (deloadWeek) {
      setDeloadWeek(null);
    } else {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const thisMonday = new Date(now);
      thisMonday.setDate(now.getDate() + (dayOfWeek === 0 ? -6 : 1 - dayOfWeek));
      thisMonday.setHours(0, 0, 0, 0);
      setDeloadWeek({ weekStart: thisMonday.getTime() });
    }
  };

  const unlockAudio = () => {
    try {
      if (audioCtxRef.current) return;
      const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
      const ctx = new AudioContext(); const buffer = ctx.createBuffer(1, 1, 22050); const source = ctx.createBufferSource();
      source.buffer = buffer; source.connect(ctx.destination); source.start(0); audioCtxRef.current = ctx;
    } catch (e) {}
  };

  const playRestEndSound = () => {
    try { if (navigator.vibrate) navigator.vibrate([200, 100, 200, 100, 400]); } catch (e) {}
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext; if (!AudioContext) return;
      const ctx = audioCtxRef.current || new AudioContext();
      const playBeep = (startTime, freq, duration) => {
        const osc = ctx.createOscillator(); const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination); osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime); gain.gain.setValueAtTime(0.4, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); osc.start(startTime); osc.stop(startTime + duration);
      };
      const now = ctx.currentTime; playBeep(now, 660, 0.15); playBeep(now + 0.2, 660, 0.15); playBeep(now + 0.4, 880, 0.3);
    } catch (e) {}
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) return false;
    if (Notification.permission === 'granted') return true;
    if (Notification.permission === 'denied') return false;
    const result = await Notification.requestPermission(); return result === 'granted';
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64); const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i); return outputArray;
  };

  const fireRestNotification = () => {
    try { localStorage.removeItem('restNotifFireAt'); } catch (e) {}
    if (window._restNotifTimeout) { clearTimeout(window._restNotifTimeout); window._restNotifTimeout = null; }
    if (window._restNotifInterval) { clearInterval(window._restNotifInterval); window._restNotifInterval = null; }
    playRestEndSound();
  };

  const cancelRestNotification = () => {
    if (window._restNotifTimeout) { clearTimeout(window._restNotifTimeout); window._restNotifTimeout = null; }
    if (window._restNotifInterval) { clearInterval(window._restNotifInterval); window._restNotifInterval = null; }
    try { localStorage.removeItem('restNotifFireAt'); } catch (e) {}
  };

  const startNotifPolling = (fireAt) => {
    if (window._restNotifInterval) clearInterval(window._restNotifInterval);
    window._restNotifInterval = setInterval(() => {
      const stored = localStorage.getItem('restNotifFireAt'); if (!stored) { clearInterval(window._restNotifInterval); return; }
      if (Date.now() >= parseInt(stored)) { clearInterval(window._restNotifInterval); try { localStorage.removeItem('restNotifFireAt'); } catch (e) {} playRestEndSound(); }
    }, 5000);
  };

  const scheduleRestNotification = async (seconds) => {
    try {
      const granted = await requestNotificationPermission(); if (!granted) return;
      cancelRestNotification();
      const fireAt = Date.now() + seconds * 1000;
      try { localStorage.setItem('restNotifFireAt', String(fireAt)); } catch (e) {}
      if ('serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' }); await navigator.serviceWorker.ready;
          let subscription = await registration.pushManager.getSubscription();
          if (!subscription) { subscription = await registration.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) }); }
          fetch('/api/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ subscription, fireAt, message: 'Your 2 minute rest is done. Next set awaits!' }) }).catch(() => {});
        } catch (swErr) { startNotifPolling(fireAt); }
      } else { startNotifPolling(fireAt); }
      startNotifPolling(fireAt);
    } catch (e) {}
  };

  const isStrengthProgram = () => { if (selectedProgram === null) return true; return (programs[selectedProgram]?.type || 'strength') === 'strength'; };

  const startRestTimer = () => {
    if (!isStrengthProgram()) return;
    clearInterval(restTimerRef.current); const now = Date.now();
    setRestStartTime(now); setRestDuration(120); setRestTime(120); setIsResting(false);
    setTimeout(() => setIsResting(true), 0);
    try { localStorage.setItem('restStart', String(now)); localStorage.setItem('restDuration', '120'); } catch (e) {}
    scheduleRestNotification(120);
  };

  const skipRest = () => {
    clearInterval(restTimerRef.current); setIsResting(false); setRestTime(0); setRestStartTime(null);
    cancelRestNotification();
    try { localStorage.removeItem('restStart'); localStorage.removeItem('restDuration'); } catch (e) {}
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600); const mins = Math.floor((seconds % 3600) / 60); const secs = seconds % 60;
    if (hrs > 0) return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatRestTime = (seconds) => { const mins = Math.floor(seconds / 60); const secs = seconds % 60; return `${mins}:${secs.toString().padStart(2, '0')}`; };

  const formatPace = (distanceKm, durationMin) => {
    if (!distanceKm || !durationMin || distanceKm <= 0 || durationMin <= 0) return null;
    const paceMinPerKm = durationMin / distanceKm; const paceMin = Math.floor(paceMinPerKm); const paceSec = Math.round((paceMinPerKm - paceMin) * 60);
    return `${paceMin}:${paceSec.toString().padStart(2, '0')} /km`;
  };

  const getDaysSincePR = (exerciseName) => {
    const sessions = globalPRHistory[exerciseName.toLowerCase()];
    if (!sessions || sessions.length === 0) return null;
    const lastPR = sessions[sessions.length - 1];
    if (!lastPR?.date) return null;
    const rawDate = lastPR.date;
    let prDate;
    const parts = rawDate.split('/');
    if (parts.length === 3) {
      const [a, b, c] = parts.map(Number);
      if (a > 12) prDate = new Date(c, b - 1, a);
      else if (b > 12) prDate = new Date(c, a - 1, b);
      else prDate = new Date(c, b - 1, a);
    } else { prDate = new Date(rawDate); }
    if (isNaN(prDate.getTime())) return null;
    const now = new Date(); now.setHours(0,0,0,0); prDate.setHours(0,0,0,0);
    return Math.round((now - prDate) / (1000 * 60 * 60 * 24));
  };

  const getDaysSinceLastSession = (exerciseName) => {
    const key = exerciseName.toLowerCase(); const lastSession = globalHistory[key]; if (!lastSession?.date) return null;
    const rawDate = lastSession.date; let lastDate; const parts = rawDate.split('/');
    if (parts.length === 3) { const [a, b, c] = parts.map(Number); if (a > 12) lastDate = new Date(c, b - 1, a); else if (b > 12) lastDate = new Date(c, a - 1, b); else lastDate = new Date(c, b - 1, a); }
    else { lastDate = new Date(rawDate); }
    if (isNaN(lastDate.getTime())) return null;
    const now = new Date(); now.setHours(0,0,0,0); lastDate.setHours(0,0,0,0);
    return Math.round((now - lastDate) / (1000 * 60 * 60 * 24));
  };

  const getProgramRecoveryStatus = (program) => {
    if ((program.type || 'strength') === 'mobility') return null;
    const muscles = new Set();
    program.exercises.forEach(ex => {
      const detailed = getDetailedMuscle(ex.name);
      if (detailed && detailed !== 'Cardio') muscles.add(detailed);
    });
    if (muscles.size === 0) return null;
    const now = Date.now();
    let worstStatus = 'green';
    muscles.forEach(muscle => {
      let lastTrained = null;
      workoutHistory.forEach(workout => {
        workout.exercises.forEach(ex => {
          const detailed = ex.detailedMuscle || getDetailedMuscle(ex.name);
          if (detailed === muscle) {
            if (!lastTrained || workout.dateTimestamp > lastTrained) {
              lastTrained = workout.dateTimestamp;
            }
          }
        });
      });
      if (!lastTrained) return;
      const hoursAgo = (now - lastTrained) / (1000 * 60 * 60);
      if (hoursAgo < 24) worstStatus = 'red';
      else if (hoursAgo < 48 && worstStatus !== 'red') worstStatus = 'yellow';
    });
    return worstStatus;
  };

  const getProgramMuscleIcons = (program) => {
    const muscles = new Set();
    program.exercises.forEach(ex => {
      const group = findMuscleGroup(ex.name, customExercises);
      if (group && group !== 'Other') muscles.add(group);
    });
    return [...muscles].map(m => MUSCLE_GROUP_ICONS[m]).filter(Boolean);
  };

const getProgramLastSession = (programName) => {
    const sessions = workoutHistory.filter(w => w.programName === programName); if (sessions.length === 0) return null;
    const latest = sessions[0]; const now = new Date(); now.setHours(0,0,0,0);
    const lastDate = new Date(latest.dateTimestamp); lastDate.setHours(0,0,0,0);
    return { date: latest.date, days: Math.round((now - lastDate) / (1000 * 60 * 60 * 24)) };
  };

  const isCardioMuscleGroup = (muscleGroup) => muscleGroup === 'Cardio';

  const getVolumeTrendData = (muscleGroup) => {
    const weeks = []; const now = new Date();
    const isCardio = isCardioMuscleGroup(muscleGroup);
    for (let i = 7; i >= 0; i--) {
      const weekStart = new Date(now);
      const dayOfWeek = weekStart.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(now.getDate() + diffToMonday - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const weekLabel = weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      let totalKg = 0; let totalSets = 0; let totalKm = 0;
      workoutHistory.forEach(workout => {
        const d = new Date(workout.dateTimestamp);
        if (d >= weekStart && d < weekEnd) {
          workout.exercises.forEach(ex => {
            if (ex.muscleGroup === muscleGroup) {
              if (isCardio) {
                ex.sets.forEach(set => {
                  const km = parseFloat(set.distance) || 0;
                  if (km > 0) totalKm += km;
                });
              } else {
                ex.sets.forEach(set => {
                  const kg = parseFloat(set.weight) || 0;
                  const reps = parseInt(set.reps) || 0;
                  if (kg > 0 && reps > 0) { totalKg += kg; totalSets++; }
                });
              }
            }
          });
        }
      });
      const value = isCardio
        ? Math.round(totalKm * 10) / 10
        : totalSets > 0 ? Math.round((totalKg / totalSets) * 10) / 10 : 0;
      weeks.push({ label: weekLabel, value });
    }
    return weeks;
  };

  const getMuscleBalance = () => {
    const weekStart = getWeekStart(); const pushSets = { count: 0 }; const pullSets = { count: 0 }; const upperSets = { count: 0 }; const lowerSets = { count: 0 };
    workoutHistory.forEach(workout => {
      if (new Date(workout.dateTimestamp) < weekStart) return;
      workout.exercises.forEach(ex => {
        const detailed = ex.detailedMuscle || getDetailedMuscle(ex.name); const sets = ex.sets.length;
        if (detailed) { if (PUSH_MUSCLES.includes(detailed)) pushSets.count += sets; if (PULL_MUSCLES.includes(detailed)) pullSets.count += sets; if (UPPER_MUSCLES.includes(detailed)) upperSets.count += sets; if (LOWER_MUSCLES.includes(detailed)) lowerSets.count += sets; }
      });
    });
    const getPushPullStatus = (a, b) => {
      if (a === 0 && b === 0) return 'neutral';
      if (a === 0 || b === 0) return 'red';
      const ratio = a / b;
      if (ratio >= 0.8 && ratio <= 1.2) return 'green';
      if (ratio >= 0.6 && ratio <= 1.5) return 'yellow';
      return 'red';
    };
    const getUpperLowerStatus = (upper, lower) => {
      if (upper === 0 && lower === 0) return 'neutral';
      if (lower === 0) return 'red';
      if (upper === 0) return 'green';
      const lowerPct = lower / upper;
      if (lowerPct >= 0.25) return 'green';
      if (lowerPct >= 0.15) return 'yellow';
      return 'red';
    };
    return { push: pushSets.count, pull: pullSets.count, upper: upperSets.count, lower: lowerSets.count, pushPullStatus: getPushPullStatus(pushSets.count, pullSets.count), upperLowerStatus: getUpperLowerStatus(upperSets.count, lowerSets.count) };
  };

  const totalXP = computeTotalXP(workoutHistory, globalPRHistory);
  const levelInfo = getLevelFromXP(totalXP);
  const [displayXP, setDisplayXP] = useState(totalXP);
  const prevXPRef = useRef(totalXP);
  const pendingXPRef = useRef(null);
  const animatedXP = useAnimatedNumber(displayXP, 1800);
  const animatedLevelInfo = getLevelFromXP(animatedXP);
  const [levelUpAnimation, setLevelUpAnimation] = useState(null); // { fromLevel, toLevel }
  const [barOverride, setBarOverride] = useState(null); // override progress 0-100 during level up

  const getExerciseNote = (exercise) => { const key = exercise.name.toLowerCase(); return exerciseNotes[key] ?? exercise.note ?? ''; };
  const toggleFavourite = (e, index) => { e.stopPropagation(); setFavourites(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]); };
  const toggleGroupCollapsed = (groupId) => setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  const toggleWorkoutExerciseCollapsed = (exerciseId) => setCollapsedWorkoutExercises(prev => ({ ...prev, [exerciseId]: !prev[exerciseId] }));
  const toggleVolumeGroup = (parent) => setExpandedVolumeGroups(prev => ({ ...prev, [parent]: !prev[parent] }));

  const comparePRScore = (kg, reps) => kg * 1000 + (reps || 0);

  const getBestSessionForExercise = (exerciseName) => {
    const allSessions = [];
    programs.forEach(program => { program.exercises.forEach(ex => { if (ex.name.toLowerCase() === exerciseName.toLowerCase() && ex.history?.length > 0) allSessions.push(...ex.history); }); });
    const globalSessions = globalPRHistory[exerciseName.toLowerCase()];
    if (globalSessions?.length > 0) globalSessions.forEach(s => { if (Array.isArray(s.sets)) allSessions.push({ sets: s.sets }); });
    if (allSessions.length === 0) return null;
    let bestSession = null; let bestScore = 0;
    allSessions.forEach(session => {
      if (!session.sets) return;
      let score = 0;
      session.sets.forEach(log => { if (!log) return; score += (parseFloat(log.weight) || 0) * 1000 + (parseInt(log.reps) || 0); });
      if (score > bestScore) { bestScore = score; bestSession = session; }
    });
    return bestSession;
  };

  const getSetPRStatus = (exercise, setIndex, weight, reps) => {
    const w = parseFloat(weight) || 0; const r = parseInt(reps) || 0;
    if (w === 0) return null;
    const currentScore = comparePRScore(w, r);

    // Get the best all-time session for this exercise
    const bestSession = getBestSessionForExercise(exercise.name);

    // Check if all preceding sets in the current workout match or beat the best session
    if (setIndex > 0 && bestSession) {
      for (let i = 0; i < setIndex; i++) {
        const currentLog = setLogs[String(exercise.id)]?.[i];
        const bestLog = bestSession.sets?.[i];
        if (!currentLog || !bestLog) continue;
        const currentSetScore = comparePRScore(parseFloat(currentLog.weight) || 0, parseInt(currentLog.reps) || 0);
        const bestSetScore = comparePRScore(parseFloat(bestLog.weight) || 0, parseInt(bestLog.reps) || 0);
        if (currentSetScore < bestSetScore) return null; // preceding set didn't match — no PR possible
      }
    }

    // Compare this set against best session
    const bestSetLog = bestSession?.sets?.[setIndex];
    const allTimeBestScore = bestSetLog ? comparePRScore(parseFloat(bestSetLog.weight) || 0, parseInt(bestSetLog.reps) || 0) : 0;

    // Get last session for "better than last" check
    const key = exercise.name.toLowerCase();
    const lastSession = globalHistory[key];
    let lastSessionScore = 0;
    if (lastSession?.sets?.[setIndex]) {
      lastSessionScore = comparePRScore(parseFloat(lastSession.sets[setIndex].weight) || 0, parseInt(lastSession.sets[setIndex].reps) || 0);
    } else if (exercise.history?.length > 0) {
      const last = exercise.history[exercise.history.length - 1];
      if (last?.sets?.[setIndex]) lastSessionScore = comparePRScore(parseFloat(last.sets[setIndex].weight) || 0, parseInt(last.sets[setIndex].reps) || 0);
    }

    if (currentScore > allTimeBestScore) return 'alltime';
    if (lastSessionScore > 0 && currentScore > lastSessionScore) return 'better';
    return null;
  };

  const getAllCustomExercises = () => {
    const list = [];
    Object.entries(customExercises).forEach(([group, exercises]) => { exercises.forEach(name => list.push({ name, muscleGroup: group, detailedMuscle: customDetailedMuscles[name.toLowerCase()] || null })); });
    return list.sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleOpenEditCustomExercise = (exercise) => { setEditingCustomExercise(exercise); setEditCustomName(exercise.name); setEditCustomMuscleGroup(exercise.muscleGroup); setEditCustomDetailedMuscle(exercise.detailedMuscle || ''); setEditMuscleInfoExpanded(null); };

  const handleSaveCustomExercise = () => {
    const newName = editCustomName.trim(); if (!newName || !editCustomMuscleGroup) return;
    const original = editingCustomExercise; const oldKey = original.name.toLowerCase(); const newKey = newName.toLowerCase();
    const oldGroup = original.muscleGroup; const newGroup = editCustomMuscleGroup; const newDetailed = editCustomDetailedMuscle || null;
    setCustomExercises(prev => { const updated = { ...prev }; if (updated[oldGroup]) { updated[oldGroup] = updated[oldGroup].filter(e => e.toLowerCase() !== oldKey); if (updated[oldGroup].length === 0) delete updated[oldGroup]; } if (!updated[newGroup]) updated[newGroup] = []; if (!updated[newGroup].some(e => e.toLowerCase() === newKey)) updated[newGroup] = [...updated[newGroup], newName]; return updated; });
    setCustomDetailedMuscles(prev => { const u = { ...prev }; delete u[oldKey]; if (newDetailed) u[newKey] = newDetailed; return u; });
    if (newName !== original.name) {
      setPrograms(prev => prev.map(p => ({ ...p, exercises: p.exercises.map(ex => ex.name.toLowerCase() === oldKey ? { ...ex, name: newName } : ex) })));
      setExerciseNotes(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey]; delete u[oldKey]; } return u; });
      setGlobalHistory(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey]; delete u[oldKey]; } return u; });
      setGlobalPRHistory(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey].map(s => ({ ...s, name: newName })); delete u[oldKey]; } return u; });
    }
    setEditingCustomExercise(null);
  };

  const handleDeleteCustomExercise = (exercise) => {
    const key = exercise.name.toLowerCase();
    setCustomExercises(prev => { const updated = { ...prev }; if (updated[exercise.muscleGroup]) { updated[exercise.muscleGroup] = updated[exercise.muscleGroup].filter(e => e.toLowerCase() !== key); if (updated[exercise.muscleGroup].length === 0) delete updated[exercise.muscleGroup]; } return updated; });
    setCustomDetailedMuscles(prev => { const u = { ...prev }; delete u[key]; return u; });
    setEditingCustomExercise(null);
  };

  const getGroupsFromOtherPrograms = () => {
    if (selectedProgram === null) return []; const seen = new Set(); const groups = [];
    programs.forEach((program, pIndex) => {
      if (pIndex === selectedProgram) return; const groupMap = {};
      program.exercises.forEach(ex => { if (!ex.groupId) return; if (!groupMap[ex.groupId]) groupMap[ex.groupId] = []; groupMap[ex.groupId].push(ex); });
      Object.entries(groupMap).forEach(([, exList]) => { if (exList.length < 2) return; const key = exList.map(e => e.name.toLowerCase()).sort().join('||'); if (seen.has(key)) return; seen.add(key); groups.push({ exercises: exList, key }); });
    });
    return groups;
  };

  const isGroupAdded = (groupExercises) => { if (selectedProgram === null) return false; const names = programs[selectedProgram].exercises.map(e => e.name.toLowerCase()); return groupExercises.every(ex => names.includes(ex.name.toLowerCase())); };

  const handleAddGroupFromOther = (groupExercises) => {
    const newGroupId = `group_${Date.now()}`;
    const newExercises = groupExercises.map(ex => ({ id: generateId(), name: ex.name, sets: ex.sets, groupId: newGroupId, history: [], pr: null, note: exerciseNotes[ex.name.toLowerCase()] ?? ex.note ?? '' }));
    setPrograms(prev => prev.map((p, i) => i === selectedProgram ? { ...p, exercises: [...p.exercises, ...newExercises] } : p));
    setCollapsedGroups(prev => ({ ...prev, [newGroupId]: true }));
  };

  const handleStartGrouping = (e, exerciseId) => { e.stopPropagation(); setGroupingSourceId(exerciseId); setGroupingSelectedIds([exerciseId]); };
  const handleToggleGroupSelection = (e, exerciseId) => { e.stopPropagation(); if (exerciseId === groupingSourceId) return; setGroupingSelectedIds(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]); };
  const handleConfirmGroup = () => {
    if (groupingSelectedIds.length < 2) { setGroupingSourceId(null); setGroupingSelectedIds([]); return; }
    const newGroupId = `group_${Date.now()}`;
    setPrograms(prev => prev.map((p, i) => { if (i !== selectedProgram) return p; return { ...p, exercises: p.exercises.map(ex => groupingSelectedIds.includes(String(ex.id)) ? { ...ex, groupId: newGroupId } : ex) }; }));
    setCollapsedGroups(prev => ({ ...prev, [newGroupId]: true })); setGroupingSourceId(null); setGroupingSelectedIds([]);
  };
  const handleCancelGrouping = () => { setGroupingSourceId(null); setGroupingSelectedIds([]); };

  const handleAddWeeklyPlan = (plan) => {
    const countMap = {};
    plan.programs.forEach(id => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === id); if (!template) return;
      countMap[id] = (countMap[id] || 0) + 1;
      const copyNum = countMap[id];
      const newProgram = {
        name: copyNum > 1 ? `${template.label} ${copyNum}` : template.label,
        type: template.type || 'strength',
        exercises: template.exercises.map(ex => ({ ...ex, id: generateId(), history: [], pr: null, note: exerciseNotes[ex.name.toLowerCase()] ?? '' })),
      };
      setPrograms(prev => [...prev, newProgram]);
    });
    setShowWeeklyPlanModal(false); setShowTemplateModal(false);
  };

  const isPlanAlreadyAdded = (plan) => {
    const countMap = {};
    return plan.programs.every(id => {
      const template = PROGRAM_TEMPLATES.find(t => t.id === id); if (!template) return false;
      countMap[id] = (countMap[id] || 0) + 1;
      const copyNum = countMap[id];
      const name = copyNum > 1 ? `${template.label} ${copyNum}` : template.label;
      return programs.some(p => p.name === name);
    });
  };

  const handleAddTemplate = (template) => {
    const newProgram = { name: template.label, type: template.type || 'strength', exercises: template.exercises.map(ex => ({ ...ex, id: generateId(), history: [], pr: null, note: exerciseNotes[ex.name.toLowerCase()] ?? '' })) };
    setPrograms(prev => [...prev, newProgram]); setShowTemplateModal(false);
  };

  const handleExportData = () => {
    const data = { programs, globalHistory, workoutHistory, customExercises, customDetailedMuscles, exerciseNotes, favourites, globalPRHistory, exportDate: new Date().toISOString(), version: 1 };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url;
    a.download = `workout-backup-${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}.json`; a.click(); URL.revokeObjectURL(url);
    setLastExportDate(new Date().toISOString()); setShowExportReminder(false);
  };

  const handleImportData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.programs) setPrograms(data.programs); if (data.globalHistory) setGlobalHistory(data.globalHistory); if (data.workoutHistory) setWorkoutHistory(data.workoutHistory);
        if (data.customExercises) setCustomExercises(data.customExercises); if (data.customDetailedMuscles) setCustomDetailedMuscles(data.customDetailedMuscles); if (data.exerciseNotes) setExerciseNotes(data.exerciseNotes);
        if (data.favourites) setFavourites(data.favourites); if (data.globalPRHistory) setGlobalPRHistory(data.globalPRHistory);
        setLastExportDate(new Date().toISOString()); setShowExportReminder(false); setImportSuccess(true); setTimeout(() => setImportSuccess(false), 3000);
      } catch (err) { setImportError(true); setTimeout(() => setImportError(false), 3000); }
    };
    reader.readAsText(file); e.target.value = '';
  };

  const handleDuplicateProgram = (e, index) => { e.stopPropagation(); const original = programs[index]; setPrograms(prev => [...prev, { ...original, name: `${original.name} (Copy)`, exercises: original.exercises.map(ex => ({ ...ex, id: generateId(), history: [], pr: null })) }]); };
  const handleRenameExercisePress = (e, exercise) => { e.stopPropagation(); setExerciseToRename(exercise); setRenameText(exercise.name); setShowRenameModal(true); };
  const handleConfirmRename = () => {
    const newName = renameText.trim(); if (!newName || newName === exerciseToRename.name) { setShowRenameModal(false); setExerciseToRename(null); setRenameText(''); return; }
    const oldKey = exerciseToRename.name.toLowerCase(); const newKey = newName.toLowerCase();
    setPrograms(prev => prev.map(p => ({ ...p, exercises: p.exercises.map(ex => ex.name.toLowerCase() === oldKey ? { ...ex, name: newName } : ex) })));
    setExerciseNotes(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey]; delete u[oldKey]; } return u; });
    setGlobalHistory(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey]; delete u[oldKey]; } return u; });
    setGlobalPRHistory(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey].map(s => ({ ...s, name: newName })); delete u[oldKey]; } return u; });
    setCustomDetailedMuscles(prev => { const u = { ...prev }; if (u[oldKey] !== undefined) { u[newKey] = u[oldKey]; delete u[oldKey]; } return u; });
    setShowRenameModal(false); setExerciseToRename(null); setRenameText('');
  };
  const handleCancelRename = () => { setShowRenameModal(false); setExerciseToRename(null); setRenameText(''); };

  const calculatePlates = (totalWeight, barWeight) => {
    const availablePlates = [25, 20, 15, 10, 5, 2.5, 1.25]; const weightPerSide = (totalWeight - barWeight) / 2; if (weightPerSide < 0) return null;
    let remaining = weightPerSide; const plates = [];
    availablePlates.forEach(plate => { const count = Math.floor(remaining / plate); if (count > 0) { plates.push({ weight: plate, count }); remaining = parseFloat((remaining - plate * count).toFixed(4)); } });
    return { plates, remainder: remaining, weightPerSide };
  };

  const getPlateStyle = (weight) => {
    const styles = { 25: { height: '54px', width: '18px', background: 'linear-gradient(180deg, #c0392b, #922b21)', borderColor: '#c0392b' }, 20: { height: '50px', width: '16px', background: 'linear-gradient(180deg, #2471a3, #1a5276)', borderColor: '#2471a3' }, 15: { height: '44px', width: '14px', background: 'linear-gradient(180deg, #f39c12, #d68910)', borderColor: '#f39c12' }, 10: { height: '38px', width: '13px', background: 'linear-gradient(180deg, #27ae60, #1e8449)', borderColor: '#27ae60' }, 5: { height: '32px', width: '12px', background: 'linear-gradient(180deg, #7f8c8d, #616a6b)', borderColor: '#7f8c8d' }, 2.5: { height: '26px', width: '10px', background: 'linear-gradient(180deg, #d5d8dc, #aab7b8)', borderColor: '#aab7b8' }, 1.25: { height: '22px', width: '9px', background: 'linear-gradient(180deg, #c9a84c, #a8852e)', borderColor: '#c9a84c' } };
    return styles[weight] || { height: '30px', width: '12px', background: '#444', borderColor: '#666' };
  };

  const getPerSetPRs = (exercise) => {
    const allSessions = [];
    programs.forEach(program => { program.exercises.forEach(ex => { if (ex.name.toLowerCase() === exercise.name.toLowerCase() && ex.history?.length > 0) allSessions.push(...ex.history); }); });
    if (allSessions.length === 0) { const globalSessions = globalPRHistory[exercise.name.toLowerCase()]; if (globalSessions?.length > 0) globalSessions.forEach(session => { if (Array.isArray(session.sets)) allSessions.push({ sets: session.sets }); }); }
    if (allSessions.length === 0) return [];
    // Find the single best session using sequential set PR logic
    let bestSession = null;
    let bestSessionScore = 0;
    allSessions.forEach(session => {
      if (!session.sets || !Array.isArray(session.sets)) return;
      let sessionScore = 0;
      session.sets.forEach((log, idx) => {
        if (!log) return;
        const w = parseFloat(log.weight) || 0;
        const r = parseInt(log.reps) || 0;
        sessionScore += w * 1000 + r;
      });
      if (sessionScore > bestSessionScore) { bestSessionScore = sessionScore; bestSession = session; }
    });
    if (!bestSession) return [];
    return Array.from({ length: exercise.sets }, (_, i) => {
      const log = bestSession.sets?.[i];
      if (!log) return null;
      const w = parseFloat(log.weight) || 0;
      const r = parseInt(log.reps) || 0;
      if (w === 0) return null;
      return { weight: w, reps: r };
    });
  };

  const handleImportFromLink = () => {
    const text = importLinkText.trim(); if (!text) return;
    try {
      let encoded = text;
      try { const url = new URL(text); const param = url.searchParams.get('program'); if (param) encoded = param; } catch (e) {}
      const decoded = decodeURIComponent(encoded);
      const program = decompressProgram(decoded);
      if (!program) { setImportLinkError('Could not read this link — make sure you copied the full link.'); return; }
      setImportProgramData(program); setShowImportLinkModal(false); setImportLinkText(''); setImportLinkError(''); setShowImportProgramModal(true);
    } catch (e) { setImportLinkError('Invalid link. Make sure you copied the full share link.'); }
  };

  const handleShareProgram = async (index) => {
    const program = programs[index]; const encoded = compressProgram(program); if (!encoded) { alert('Could not generate share link'); return; }
    const url = `${window.location.origin}${window.location.pathname}?program=${encoded}`;
    try { if (navigator.share) { await navigator.share({ title: `${program.name} — Workout Program`, text: `Check out my ${program.name} workout program!`, url }); } else { await navigator.clipboard.writeText(url); alert('Share link copied to clipboard!'); } }
    catch (e) { try { await navigator.clipboard.writeText(url); alert('Share link copied to clipboard!'); } catch (err) {} }
  };

  const handleRepeatWorkout = (workout) => { setWorkoutToRepeat(workout); setShowRepeatWorkoutModal(true); };

  const handleConfirmRepeatWorkout = (saveToPrograms = true) => {
    if (!workoutToRepeat) return;
    const repeatExercises = workoutToRepeat.exercises.map(ex => ({
      id: generateId(), name: ex.name, sets: ex.sets.length, groupId: null, history: [], pr: null,
      note: exerciseNotes[ex.name.toLowerCase()] ?? '', type: ex.type || (isCardioExercise(ex.name) ? 'cardio' : 'strength'),
      workoutOnly: !saveToPrograms,
    }));
    let programIndex = -1;
    if (saveToPrograms) {
      programIndex = programs.findIndex(p => p.name === workoutToRepeat.programName);
      if (programIndex === -1) {
        const newProgram = { name: workoutToRepeat.programName, type: workoutToRepeat.programType || 'strength', exercises: repeatExercises.map(ex => ({ ...ex, workoutOnly: false })) };
        setPrograms(prev => [...prev, newProgram]); programIndex = programs.length;
      }
    } else {
      const tempProgram = { name: workoutToRepeat.programName, type: workoutToRepeat.programType || 'strength', exercises: repeatExercises };
      setPrograms(prev => { programIndex = prev.length; return [...prev, tempProgram]; }); programIndex = programs.length;
    }
    const newSetLogs = {};
    workoutToRepeat.exercises.forEach((ex, idx) => {
      const exercise = repeatExercises[idx]; if (!exercise) return;
      newSetLogs[String(exercise.id)] = ex.sets.map(set => ({ weight: set.weight || '', reps: set.reps || '', distance: set.distance || '', duration: set.duration || '' }));
    });
    setSelectedProgram(programIndex); setWorkoutStartTime(Date.now()); setElapsedTime(0); setCompletedSets({});
    setDoneExercises([]); setSetLogs(newSetLogs); setIsResting(false); setRestTime(0); setRestStartTime(null);
    setSetPRStatuses({}); setFlashingPRs({}); setCollapsedWorkoutExercises({});
    setShowRepeatWorkoutModal(false); setWorkoutToRepeat(null); setCollapsedGroups({}); setCurrentScreen('workout');
  };

  const startWorkout = () => {
    setPrograms(prev => prev.map((p, i) => i === selectedProgram ? { ...p, exercises: p.exercises.filter(ex => !ex.workoutOnly) } : p));
    setWorkoutStartTime(Date.now()); setElapsedTime(0); setCompletedSets({}); setDoneExercises([]); setSetLogs({});
    setIsResting(false); setRestTime(0); setRestStartTime(null); setSetPRStatuses({}); setFlashingPRs({});
    setShowFinishWorkoutModal(false); setCompletionOrder([]);
    if (selectedProgram !== null) {
      const allCollapsed = {};
      const groupIds = {};
      programs[selectedProgram].exercises.forEach(ex => {
        allCollapsed[String(ex.id)] = true;
        if (ex.groupId) groupIds[ex.groupId] = true;
      });
      setCollapsedWorkoutExercises(allCollapsed);
      setCollapsedGroups(groupIds);
    }
    setCurrentScreen('workout');
  };

  const handleSetInputChange = (exercise, setIndex, field, value) => {
    const exerciseId = String(exercise.id); const currentLogs = setLogs[exerciseId] || []; const newLogs = [...currentLogs];
    if (!newLogs[setIndex]) newLogs[setIndex] = { weight: '', reps: '', distance: '', duration: '' };
    newLogs[setIndex] = { ...newLogs[setIndex], [field]: value }; setSetLogs({ ...setLogs, [exerciseId]: newLogs });
  };

  const handleCompleteSet = (exercise, setIndex) => {
    unlockAudio(); const exerciseId = String(exercise.id); const exType = exercise.type || 'strength';
    const isBWExercise = isBodyweightExercise(exercise.name);
    if (isSetDone(exerciseId, setIndex)) return;
    // Double tap prevention — ignore if same set was completed within 800ms
    const debounceKey = `${exerciseId}-${setIndex}`;
    const now = Date.now();
    if (window._lastSetComplete && window._lastSetComplete[debounceKey] && now - window._lastSetComplete[debounceKey] < 800) return;
    if (!window._lastSetComplete) window._lastSetComplete = {};
    window._lastSetComplete[debounceKey] = now;
    // Get last session values for placeholders
    const lastValues = (() => {
      const key = exercise.name.toLowerCase();
      const g = globalHistory[key];
      if (g?.sets?.[setIndex]) return g.sets[setIndex];
      if (!exercise.history?.length) return null;
      return exercise.history[exercise.history.length - 1]?.sets?.[setIndex] || null;
    })();

    // Get current log and fill in missing fields from placeholders
    const currentLog = setLogs[exerciseId]?.[setIndex] || {};
    const filledLog = { ...currentLog };

    if (exType === 'strength' && !isBWExercise) {
      if (!filledLog.weight && lastValues?.weight) filledLog.weight = String(lastValues.weight);
      if (!filledLog.reps && lastValues?.reps) filledLog.reps = String(lastValues.reps);
      if (!filledLog.weight || !filledLog.reps) return;
    }
    if (exType === 'strength' && isBWExercise) {
      if (!filledLog.reps && lastValues?.reps) filledLog.reps = String(lastValues.reps);
      if (!filledLog.reps) return;
    }
    if (exType === 'cardio') {
      if (!filledLog.distance && lastValues?.distance) filledLog.distance = String(lastValues.distance);
      if (!filledLog.duration && lastValues?.duration) filledLog.duration = String(lastValues.duration);
      if (!filledLog.distance || !filledLog.duration) return;
    }

    // Update setLogs with filled values so they display visually
    setSetLogs(prev => {
      const existingLogs = Array.isArray(prev[exerciseId]) 
        ? [...prev[exerciseId]] 
        : [];
      existingLogs[setIndex] = filledLog;
      return { ...prev, [exerciseId]: existingLogs };
    });

    const log = filledLog;
    const current = completedSets[exerciseId] ? new Set(completedSets[exerciseId]) : new Set(); current.add(setIndex);
    setCompletedSets(prev => ({ ...prev, [exerciseId]: Array.from(current) }));
    if (exType === 'strength' && !isCardioExercise(exercise.name)) startRestTimer();
    try { if (navigator.vibrate) navigator.vibrate(60); } catch (e) {}
    if (exType === 'strength') {
      const prStatus = getSetPRStatus(exercise, setIndex, log.weight, log.reps); const prKey = `${exerciseId}-${setIndex}`;
      if (prStatus) {
        setSetPRStatuses(prev => ({ ...prev, [prKey]: prStatus }));
        setFlashingPRs(prev => ({ ...prev, [prKey]: true }));
        setTimeout(() => setFlashingPRs(prev => ({ ...prev, [prKey]: false })), 2000);
        if (prStatus === 'alltime') {
          try { if (navigator.vibrate) navigator.vibrate([60, 40, 80, 40, 120]); } catch (e) {}
        }
      }
    }
    if (current.size >= exercise.sets) {
      setDoneExercises(prev => {
        if (prev.includes(exerciseId)) return prev;
        const updated = [...prev, exerciseId];
        if (exercise.groupId) {
          programs[selectedProgram].exercises
            .filter(e => e.groupId === exercise.groupId && String(e.id) !== exerciseId)
            .forEach(e => { if (!updated.includes(String(e.id))) updated.push(String(e.id)); });
        }
        return updated;
      });
      // Track completion order
      const orderKey = exercise.groupId || exerciseId;
      setCompletionOrder(prev => {
        if (prev.includes(orderKey)) return prev;
        return [...prev, orderKey];
      });
      setTimeout(() => {
        if (exercise.groupId) {
          setCollapsedGroups(prev => ({ ...prev, [exercise.groupId]: true }));
        } else {
          setCollapsedWorkoutExercises(prev => ({ ...prev, [exerciseId]: true }));
        }
      }, 600);
    }
  };

  const isSetDone = (exerciseId, setIndex) => { const done = completedSets[String(exerciseId)]; if (!done) return false; return Array.isArray(done) ? done.includes(setIndex) : done > setIndex; };

  const finishWorkout = () => {
    // Capture current XP before workout history is updated
    pendingXPRef.current = computeTotalXP(workoutHistory, globalPRHistory);
    clearInterval(timerRef.current); clearInterval(restTimerRef.current); setWorkoutStartTime(null); setIsResting(false); cancelRestNotification();
    let prCount = 0; let totalWeightCount = 0;
    const newGlobalHistory = { ...globalHistory }; const newGlobalPRHistory = { ...globalPRHistory };
    const workoutExercises = []; const alltimePRNames = [];

    Object.entries(setLogs).forEach(([exerciseId, logs]) => {
      const completedIndexes = completedSets[exerciseId] || [];
      const validLogs = logs.filter((l, idx) => { const isDone = Array.isArray(completedIndexes) ? completedIndexes.includes(idx) : idx < completedIndexes; return isDone && l && (l.weight !== '' || l.distance !== ''); });
      const exercise = programs[selectedProgram].exercises.find(e => String(e.id) === String(exerciseId));
      if (exercise && validLogs.length > 0) {
        const exType = exercise.type || 'strength';
        if (exType === 'strength') {
          validLogs.forEach(log => { totalWeightCount += (parseFloat(log.weight) || 0) * (parseInt(log.reps) || 0); });
          const maxWeight = Math.max(...validLogs.map(l => parseFloat(l.weight) || 0));
          const maxScore = Math.max(...validLogs.map(l => (parseFloat(l.weight) || 0) * 1000 + (parseInt(l.reps) || 0)));
          const existingBestScore = globalPRHistory[exercise.name.toLowerCase()]?.reduce((best, s) => {
            const sc = s.sets ? Math.max(...s.sets.map(set => (parseFloat(set?.weight) || 0) * 1000 + (parseInt(set?.reps) || 0))) : (parseFloat(s.weight) || 0) * 1000 + (parseInt(s.reps) || 0);
            return sc > best ? sc : best;
          }, 0) || 0;
          if (maxScore > existingBestScore) { prCount++; alltimePRNames.push(exercise.name); }
          const key = exercise.name.toLowerCase(); newGlobalHistory[key] = { sets: logs, date: new Date().toLocaleDateString() };
          workoutExercises.push({ name: exercise.name, muscleGroup: findMuscleGroup(exercise.name, customExercises), detailedMuscle: getDetailedMuscle(exercise.name), sets: validLogs, type: 'strength' });
          if (!newGlobalPRHistory[key]) newGlobalPRHistory[key] = [];
          const bestScoringLog = validLogs.reduce((best, l) => {
            const score = (parseFloat(l.weight) || 0) * 1000 + (parseInt(l.reps) || 0);
            const bestScore = (parseFloat(best.weight) || 0) * 1000 + (parseInt(best.reps) || 0);
            return score > bestScore ? l : best;
          }, validLogs[0]);
          newGlobalPRHistory[key].push({ date: new Date().toLocaleDateString(), weight: parseFloat(bestScoringLog.weight) || 0, reps: parseInt(bestScoringLog.reps) || 0, sets: logs, name: exercise.name });
        } else if (exType === 'cardio') { workoutExercises.push({ name: exercise.name, muscleGroup: 'Cardio', detailedMuscle: 'Cardio', sets: validLogs, type: 'cardio' }); }
        else if (exType === 'mobility') { workoutExercises.push({ name: exercise.name, muscleGroup: 'Mobility', detailedMuscle: null, sets: validLogs, type: 'mobility' }); }
      }
    });

    const finishedDuration = elapsedTime; const finishedProgramName = programs[selectedProgram].name; const finishedProgramType = programs[selectedProgram].type || 'strength';
    const newWorkoutEntry = { id: Date.now(), programName: finishedProgramName, date: new Date().toLocaleDateString(), dateTimestamp: Date.now(), duration: finishedDuration, totalWeight: totalWeightCount, exercises: workoutExercises, programType: finishedProgramType };
    if (workoutExercises.length > 0) setWorkoutHistory(prev => [newWorkoutEntry, ...prev]);

    // ── Check for newly unlocked achievement tiers ──
    const prevAchievements = computeAchievements(workoutHistory, globalPRHistory);
    const newAchievements = computeAchievements(workoutExercises.length > 0 ? [newWorkoutEntry, ...workoutHistory] : workoutHistory, newGlobalPRHistory);
    let toastDelay = 1500;
    newAchievements.forEach(newAch => {
      const prevAch = prevAchievements.find(a => a.id === newAch.id); if (!prevAch) return;
      if (newAch.completedTiers > prevAch.completedTiers) {
        const newlyUnlockedTier = newAch.tiers[newAch.completedTiers - 1]; const delay = toastDelay; toastDelay += 4500;
        setTimeout(() => { setAchievementToast({ icon: newAch.icon, name: newAch.name, label: newlyUnlockedTier.label, xp: newlyUnlockedTier.xp }); setTimeout(() => setAchievementToast(null), 4000); }, delay);
      }
    });

    setGlobalHistory(newGlobalHistory); setGlobalPRHistory(newGlobalPRHistory); setNewPRCount(prCount); setTotalWeight(totalWeightCount);
    setSummaryData({ programName: finishedProgramName, date: new Date().toLocaleDateString(), duration: finishedDuration, totalWeight: totalWeightCount, prCount, alltimePRNames, exercises: workoutExercises, totalSets: Object.values(completedSets).reduce((a, b) => a + (Array.isArray(b) ? b.length : 0), 0), programType: finishedProgramType });

    setPrograms(programs.map((program, pIndex) => {
      if (pIndex !== selectedProgram) return program;
      return { ...program, exercises: program.exercises.filter(ex => !ex.workoutOnly).map(exercise => {
        const logs = setLogs[String(exercise.id)]; if (!logs) return exercise;
        const completedIndexes = completedSets[String(exercise.id)] || [];
        const validLogs = logs.filter((l, idx) => { const isDone = Array.isArray(completedIndexes) ? completedIndexes.includes(idx) : idx < completedIndexes; return isDone && l && (l.weight !== '' || l.distance !== ''); });
        if (validLogs.length === 0) return exercise; if ((exercise.type || 'strength') !== 'strength') return exercise;
        const maxWeight = Math.max(...validLogs.map(l => parseFloat(l.weight) || 0));
        return { ...exercise, pr: !exercise.pr || maxWeight > exercise.pr ? maxWeight : exercise.pr, history: [...exercise.history, { date: new Date().toLocaleDateString(), sets: logs, weight: maxWeight, reps: validLogs[validLogs.length - 1]?.reps || 0 }] };
      }) };
    }));
    // Restore any session-only ungrouped or joined exercises back to their original state
    setPrograms(prev => prev.map((p, i) => {
      if (i !== selectedProgram) return p;
      return {
        ...p,
        exercises: p.exercises.map(ex => {
          if (ex._savedGroupId !== undefined) {
            return { ...ex, groupId: ex._savedGroupId || null, _savedGroupId: undefined, _wasUngrouped: undefined };
          }
          return ex;
        }),
      };
    }));
    localStorage.removeItem('activeWorkout'); try { localStorage.removeItem('restStart'); localStorage.removeItem('restDuration'); } catch (e) {}
    setShowFinishWorkoutModal(false); setCurrentScreen('summary');
    // Auto sync to Supabase if connected
    if (syncUserId) {
      setTimeout(() => syncToSupabase(syncUserId), 1500);
    }
  };

  const handleShareSummary = async () => {
    if (!summaryData) return;
    try {
      const text = `💪 ${summaryData.programName}\n📅 ${summaryData.date}\n⏱️ ${formatTime(summaryData.duration)}\n🏋️ ${summaryData.totalWeight}kg lifted\n✅ ${summaryData.totalSets} sets${summaryData.prCount > 0 ? `\n🏆 ${summaryData.prCount} new PRs` : ''}`;
      if (navigator.share) { await navigator.share({ title: `${summaryData.programName} — Workout Complete`, text }); }
      else { await navigator.clipboard.writeText(text); alert('Workout summary copied to clipboard!'); }
    } catch (e) {}
  };

  const handleAddSet = (exerciseId) => { setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(exerciseId) ? { ...ex, sets: ex.sets + 1 } : ex) })); };
  const handleRemoveSet = (exerciseId) => { setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(exerciseId) && ex.sets > 1 ? { ...ex, sets: ex.sets - 1 } : ex) })); };
  const handleUngroupPress = (type, groupId, exerciseId = null) => {
    setUngroupTarget({ type, groupId, exerciseId });
    setShowUngroupModal(true);
  };

  const handleConfirmJoinGroup = (groupId, sessionOnly) => {
    const { exerciseId } = joinGroupTarget;
    if (sessionOnly) {
      setPrograms(prev => prev.map((p, i) => {
        if (i !== selectedProgram) return p;
        return {
          ...p,
          exercises: p.exercises.map(ex =>
            String(ex.id) === String(exerciseId)
              ? { ...ex, groupId, _savedGroupId: ex.groupId || null, _wasUngrouped: true }
              : ex
          ),
        };
      }));
    } else {
      setPrograms(prev => prev.map((p, i) => {
        if (i !== selectedProgram) return p;
        return {
          ...p,
          exercises: p.exercises.map(ex =>
            String(ex.id) === String(exerciseId) ? { ...ex, groupId } : ex
          ),
        };
      }));
    }
    setShowJoinGroupModal(false);
    setJoinGroupTarget(null);
  };

  const handleConfirmUngroup = (sessionOnly) => {
    if (!ungroupTarget) return;
    const { type, groupId, exerciseId } = ungroupTarget;

    if (type === 'all') {
      if (sessionOnly) {
        setPrograms(prev => prev.map((p, i) => {
          if (i !== selectedProgram) return p;
          return {
            ...p,
            exercises: p.exercises.map(ex => {
              if (ex.groupId !== groupId) return ex;
              return { ...ex, groupId: null, _savedGroupId: groupId };
            }),
          };
        }));
      } else {
        setPrograms(prev => prev.map((p, i) => {
          if (i !== selectedProgram) return p;
          return { ...p, exercises: p.exercises.map(ex => ex.groupId === groupId ? { ...ex, groupId: null, _savedGroupId: undefined } : ex) };
        }));
      }
    } else {
      if (sessionOnly) {
        setPrograms(prev => prev.map((p, i) => {
          if (i !== selectedProgram) return p;
          const members = p.exercises.filter(e => e.groupId === groupId);
          const remainingMembers = members.filter(e => String(e.id) !== String(exerciseId));
          return {
            ...p,
            exercises: p.exercises.map(ex => {
              if (String(ex.id) === String(exerciseId)) return { ...ex, groupId: null, _savedGroupId: groupId };
              // If only one member left in the group, ungroup them too for this session
              if (remainingMembers.length === 1 && String(ex.id) === String(remainingMembers[0].id)) {
                return { ...ex, groupId: null, _savedGroupId: groupId };
              }
              return ex;
            }),
          };
        }));
      } else {
        setPrograms(prev => prev.map((p, i) => {
          if (i !== selectedProgram) return p;
          const members = p.exercises.filter(e => e.groupId === groupId);
          if (members.length <= 2) {
            return { ...p, exercises: p.exercises.map(ex => ex.groupId === groupId ? { ...ex, groupId: null } : ex) };
          }
          return { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(exerciseId) ? { ...ex, groupId: null } : ex) };
        }));
      }
    }

    setShowUngroupModal(false);
    setUngroupTarget(null);
  };

  const handleUndoLastSet = (exerciseId) => {
    const id = String(exerciseId);
    const completedIndexes = completedSets[id];
    if (!completedIndexes || completedIndexes.length === 0) return;
    const lastCompleted = Math.max(...completedIndexes);
    setCompletedSets(prev => ({
      ...prev,
      [id]: prev[id].filter(i => i !== lastCompleted),
    }));
    setDoneExercises(prev => prev.filter(eid => eid !== id));
    const prKey = `${id}-${lastCompleted}`;
    setSetPRStatuses(prev => { const u = { ...prev }; delete u[prKey]; return u; });
    setFlashingPRs(prev => { const u = { ...prev }; delete u[prKey]; return u; });
    setCollapsedWorkoutExercises(prev => ({ ...prev, [id]: false }));
  };
  
  const handleAddSetWorkout = (exerciseId) => { const id = String(exerciseId); setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === id ? { ...ex, sets: ex.sets + 1 } : ex) })); setDoneExercises(prev => prev.filter(eid => eid !== id)); setCollapsedWorkoutExercises(prev => ({ ...prev, [id]: false })); };
  const handleRemoveSetWorkout = (exerciseId, currentSets) => {
    const id = String(exerciseId); if (currentSets <= 1) return;
    setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === id ? { ...ex, sets: ex.sets - 1 } : ex) }));
    const newLogs = { ...setLogs }; if (newLogs[id]) { newLogs[id] = newLogs[id].slice(0, currentSets - 1); setSetLogs(newLogs); }
    setCompletedSets(prev => { const arr = prev[id] ? [...prev[id]] : []; return { ...prev, [id]: arr.filter(i => i < currentSets - 1) }; });
  };

  const handleRemoveProgramExercisePress = (e, exercise) => { e.stopPropagation(); setExerciseToRemove(exercise); setShowRemoveExerciseModal(true); };
  const handleConfirmRemoveProgramExercise = () => { setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.filter(e => String(e.id) !== String(exerciseToRemove.id)) })); setShowRemoveExerciseModal(false); setExerciseToRemove(null); };
  const handleCancelRemoveProgramExercise = () => { setShowRemoveExerciseModal(false); setExerciseToRemove(null); };

  const handleRemoveWorkoutExercisePress = (exerciseId) => { const exercise = programs[selectedProgram]?.exercises.find(e => String(e.id) === String(exerciseId)); if (!exercise) return; setExerciseToRemoveFromWorkout(exercise); setShowRemoveWorkoutModal(true); };
  const handleRemoveWorkoutExerciseSessionOnly = () => { const exerciseId = String(exerciseToRemoveFromWorkout.id); setPrograms(prev => prev.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === exerciseId ? { ...ex, removedThisSession: true } : ex) })); const nl = { ...setLogs }; delete nl[exerciseId]; setSetLogs(nl); const nc = { ...completedSets }; delete nc[exerciseId]; setCompletedSets(nc); setDoneExercises(prev => prev.filter(id => id !== exerciseId)); setShowRemoveWorkoutModal(false); setExerciseToRemoveFromWorkout(null); };
  const handleRemoveWorkoutExerciseFromProgram = () => { const exerciseId = String(exerciseToRemoveFromWorkout.id); setPrograms(prev => prev.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.filter(e => String(e.id) !== exerciseId) })); const nl = { ...setLogs }; delete nl[exerciseId]; setSetLogs(nl); const nc = { ...completedSets }; delete nc[exerciseId]; setCompletedSets(nc); setDoneExercises(prev => prev.filter(id => id !== exerciseId)); setShowRemoveWorkoutModal(false); setExerciseToRemoveFromWorkout(null); };
  const handleCancelRemoveWorkoutExercise = () => { setShowRemoveWorkoutModal(false); setExerciseToRemoveFromWorkout(null); };

  const handleClearPress = (target) => { setClearTarget(target); setShowClearModal(true); };
  const handleConfirmClear = () => {
    switch (clearTarget) {
      case 'all': localStorage.clear(); setPrograms([]); setGlobalHistory({}); setWorkoutHistory([]); setCustomExercises({}); setCustomDetailedMuscles({}); setExerciseNotes({}); setFavourites([]); setGlobalPRHistory({}); setLastExportDate(null); setShowExportReminder(false); goHome(); break;
      case 'prs': setPrograms(prev => prev.map(p => ({ ...p, exercises: p.exercises.map(ex => ({ ...ex, pr: null, history: [] })) }))); setGlobalHistory({}); setGlobalPRHistory({}); break;
      case 'history': setWorkoutHistory([]); break;
      case 'notes': setExerciseNotes({}); setPrograms(prev => prev.map(p => ({ ...p, exercises: p.exercises.map(ex => ({ ...ex, note: '' })) }))); break;
      case 'custom': setCustomExercises({}); setCustomDetailedMuscles({}); break;
      default: break;
    }
    setShowClearModal(false); setClearTarget(null);
  };
  const handleCancelClear = () => { setShowClearModal(false); setClearTarget(null); };

  const handleAddExercise = (name = null, fromWorkout = false) => {
    const exerciseName = (name || newExerciseName).trim(); if (!exerciseName) return;
    const isMobilityExercise = Object.values(MOBILITY_CATALOGUE).flat().some(ex => ex.toLowerCase() === exerciseName.toLowerCase());
    const currentProgramType = selectedProgram !== null ? (programs[selectedProgram]?.type || 'strength') : 'strength';
    if (isMobilityExercise || currentProgramType === 'mobility') { _addExerciseToProgram(exerciseName, fromWorkout, 'mobility'); return; }
    const inCatalogue = Object.values(buildFullCatalogue(customExercises)).some(exList => exList.some(ex => ex.toLowerCase() === exerciseName.toLowerCase()));
    if (!inCatalogue) { setPendingCustomExercise(exerciseName); setPendingFromWorkout(fromWorkout); setShowMuscleGroupPicker(true); return; }
    _addExerciseToProgram(exerciseName, fromWorkout, isCardioExercise(exerciseName) ? 'cardio' : 'strength');
  };

  const handleMuscleGroupChosen = (muscleGroup) => { setPendingMuscleGroup(muscleGroup); setShowMuscleGroupPicker(false); setExpandedMuscleInfo(null); const options = DETAILED_MUSCLES_BY_GROUP[muscleGroup] || []; if (options.length === 1) { _finishAddingCustomExercise(muscleGroup, options[0]); } else { setShowDetailedMusclePicker(true); } };
  const handleDetailedMuscleChosen = (detailedMuscle) => { _finishAddingCustomExercise(pendingMuscleGroup, detailedMuscle); setShowDetailedMusclePicker(false); setExpandedMuscleInfo(null); };
  const handleSkipDetailedMuscle = () => { _finishAddingCustomExercise(pendingMuscleGroup, null); setShowDetailedMusclePicker(false); setExpandedMuscleInfo(null); };
  const _finishAddingCustomExercise = (muscleGroup, detailedMuscle) => {
    setCustomExercises(prev => { const updated = { ...prev }; if (!updated[muscleGroup]) updated[muscleGroup] = []; if (!updated[muscleGroup].includes(pendingCustomExercise)) updated[muscleGroup] = [...updated[muscleGroup], pendingCustomExercise]; return updated; });
    if (detailedMuscle) setCustomDetailedMuscles(prev => ({ ...prev, [pendingCustomExercise.toLowerCase()]: detailedMuscle }));
    _addExerciseToProgram(pendingCustomExercise, pendingFromWorkout, 'strength');
    setPendingMuscleGroup(null); setPendingCustomExercise(''); setPendingFromWorkout(false);
  };

  const _addExerciseToProgram = (exerciseName, fromWorkout = false, exType = 'strength') => {
    const key = exerciseName.toLowerCase();
    const newExercise = { id: generateId(), name: exerciseName, sets: exType === 'mobility' ? 1 : 2, groupId: null, history: [], pr: null, note: exerciseNotes[key] ?? '', type: exType, duration: exType === 'mobility' ? 30 : undefined };
    if (fromWorkout) {
      setPrograms(prev => prev.map((p, i) => i === selectedProgram ? { ...p, exercises: [...p.exercises, newExercise] } : p));
      setNewExerciseName(''); setShowWorkoutExerciseModal(false); setWorkoutCatalogueSearch(''); setWorkoutMuscleGroup('All');
      setPendingWorkoutExercise(newExercise); setShowSaveToProgram(true);
    } else {
      setPrograms(programs.map((p, i) => i === selectedProgram ? { ...p, exercises: [...p.exercises, newExercise] } : p));
      setNewExerciseName(''); setShowExerciseModal(false); setCatalogueSearch(''); setSelectedMuscleGroup('All');
    }
  };

  const handleSaveExerciseToProgram = () => { setShowSaveToProgram(false); setPendingWorkoutExercise(null); };
  const handleDiscardExerciseFromProgram = () => { setPrograms(prev => prev.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(pendingWorkoutExercise.id) ? { ...ex, workoutOnly: true } : ex) })); setShowSaveToProgram(false); setPendingWorkoutExercise(null); };
  const handleDeleteProgramPress = (e, index) => { e.stopPropagation(); setProgramToDelete(index); setShowDeleteProgramModal(true); };
  const handleConfirmDeleteProgram = () => { setFavourites(prev => prev.filter(i => i !== programToDelete).map(i => i > programToDelete ? i - 1 : i)); setPrograms(prev => prev.filter((_, i) => i !== programToDelete)); setShowDeleteProgramModal(false); setProgramToDelete(null); };
  const handleCancelDeleteProgram = () => { setShowDeleteProgramModal(false); setProgramToDelete(null); };
  const isExerciseAdded = (name) => programs[selectedProgram]?.exercises.some(e => e.name.toLowerCase() === name.toLowerCase());

  const getFilteredCatalogue = (search, muscleGroupFilter) => {
    const currentProgramType = selectedProgram !== null ? (programs[selectedProgram]?.type || 'strength') : 'strength'; const results = {};
    if (currentProgramType === 'mobility') { Object.entries(MOBILITY_CATALOGUE).forEach(([group, exercises]) => { if (muscleGroupFilter !== 'All' && group !== muscleGroupFilter) return; const filtered = exercises.filter(ex => ex.toLowerCase().includes(search.toLowerCase())); if (filtered.length > 0) results[group] = filtered; }); }
    else { const full = buildFullCatalogue(customExercises); Object.entries(full).forEach(([group, exercises]) => { if (muscleGroupFilter !== 'All' && group !== muscleGroupFilter) return; const filtered = exercises.filter(ex => ex.toLowerCase().includes(search.toLowerCase())); if (filtered.length > 0) results[group] = filtered; }); }
    return results;
  };

  const getPRScore = (weight, reps) => (parseFloat(weight) || 0) * 1000 + (parseInt(reps) || 0);

  const calculate1RM = (weight, reps) => {
    const w = parseFloat(weight) || 0;
    const r = parseInt(reps) || 0;
    if (w === 0 || r === 0) return null;
    if (r === 1) return w;
    // Epley formula: 1RM = w * (1 + r / 30)
    return Math.round(w * (1 + r / 30) * 10) / 10;
  };

  const getRepMaxTable = (oneRM) => {
    if (!oneRM) return [];
    return [
      { reps: 1,  pct: 100, weight: Math.round(oneRM * 1.000 * 4) / 4 },
      { reps: 2,  pct: 97,  weight: Math.round(oneRM * 0.970 * 4) / 4 },
      { reps: 3,  pct: 94,  weight: Math.round(oneRM * 0.940 * 4) / 4 },
      { reps: 4,  pct: 91,  weight: Math.round(oneRM * 0.910 * 4) / 4 },
      { reps: 5,  pct: 87,  weight: Math.round(oneRM * 0.870 * 4) / 4 },
      { reps: 6,  pct: 84,  weight: Math.round(oneRM * 0.840 * 4) / 4 },
      { reps: 8,  pct: 79,  weight: Math.round(oneRM * 0.790 * 4) / 4 },
      { reps: 10, pct: 74,  weight: Math.round(oneRM * 0.740 * 4) / 4 },
      { reps: 12, pct: 70,  weight: Math.round(oneRM * 0.700 * 4) / 4 },
      { reps: 15, pct: 65,  weight: Math.round(oneRM * 0.650 * 4) / 4 },
    ];
  };

  const getWeeklyPRData = () => {
    if (workoutHistory.length === 0) return [];
    // Find the earliest workout
    const earliest = workoutHistory.reduce((min, w) => w.dateTimestamp < min ? w.dateTimestamp : min, workoutHistory[0].dateTimestamp);
    const earliestDate = new Date(earliest);
    const dayOfWeekE = earliestDate.getDay();
    const firstMonday = new Date(earliestDate);
    firstMonday.setDate(earliestDate.getDate() + (dayOfWeekE === 0 ? -6 : 1 - dayOfWeekE));
    firstMonday.setHours(0, 0, 0, 0);
    const now = new Date();
    const dayOfWeekN = now.getDay();
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + (dayOfWeekN === 0 ? -6 : 1 - dayOfWeekN));
    thisMonday.setHours(0, 0, 0, 0);
    const weeks = [];
    let cursor = new Date(firstMonday);
    while (cursor <= thisMonday) {
      const weekStart = new Date(cursor);
      const weekEnd = new Date(cursor);
      weekEnd.setDate(cursor.getDate() + 7);
      const weekLabel = weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      // Check if any workout happened this week
      const hadWorkout = workoutHistory.some(w => {
        const d = new Date(w.dateTimestamp);
        return d >= weekStart && d < weekEnd;
      });
      if (hadWorkout) {
        let prCount = 0;
        Object.values(globalPRHistory).forEach(sessions => {
          sessions.forEach(session => {
            if (!session.date) return;
            const parts = session.date.split('/');
            let d;
            if (parts.length === 3) {
              const [a, b, c] = parts.map(Number);
              if (a > 12) d = new Date(c, b - 1, a);
              else if (b > 12) d = new Date(c, a - 1, b);
              else d = new Date(c, b - 1, a);
            } else { d = new Date(session.date); }
            if (!isNaN(d?.getTime()) && d >= weekStart && d < weekEnd) prCount++;
          });
        });
        weeks.push({ label: weekLabel, value: prCount, weekStart: weekStart.getTime() });
      }
      cursor.setDate(cursor.getDate() + 7);
    }
    return weeks;
  };

  const getPRData = () => {
    const exerciseMap = {};
    Object.entries(globalPRHistory).forEach(([key, sessions]) => {
      if (!sessions?.length) return;
      const liveExercise = programs.flatMap(p => p.exercises).find(ex => ex.name.toLowerCase() === key);
      const displayName = liveExercise?.name ?? sessions[0]?.name ?? key;
      if (!exerciseMap[key]) exerciseMap[key] = { name: displayName, program: 'Deleted Program', prHistory: [] };
      sessions.forEach(session => {
        const weight = parseFloat(session.weight) || 0;
        const reps = parseInt(session.reps) || 0;
        if (weight > 0) {
          exerciseMap[key].prHistory.push({ date: session.date, weight, reps });
        }
      });
    });
    programs.forEach(program => {
      program.exercises.forEach(exercise => {
        if (!exercise.history?.length) return;
        const key = exercise.name.toLowerCase();
        if (!exerciseMap[key]) exerciseMap[key] = { name: exercise.name, program: program.name, prHistory: [] };
        else { exerciseMap[key].program = program.name; exerciseMap[key].name = exercise.name; }
        exercise.history.forEach(session => {
          const weight = parseFloat(session.weight) || 0;
          const reps = parseInt(session.reps) || 0;
          if (weight > 0 && !exerciseMap[key].prHistory.some(p => p.date === session.date && p.weight === weight && p.reps === reps)) {
            exerciseMap[key].prHistory.push({ date: session.date, weight, reps });
          }
        });
      });
    });
    return Object.values(exerciseMap).map(exercise => {
      const sorted = [...exercise.prHistory].sort((a, b) => {
        const dc = new Date(a.date) - new Date(b.date);
        return dc !== 0 ? dc : getPRScore(a.weight, a.reps) - getPRScore(b.weight, b.reps);
      });
      let runningBestScore = 0;
      const genuinePRs = [];
      sorted.forEach(session => {
        const score = getPRScore(session.weight, session.reps);
        if (score > runningBestScore && session.weight > 0) {
          runningBestScore = score;
          genuinePRs.push(session);
        }
      });
      return { ...exercise, prHistory: genuinePRs };
    }).filter(e => e.prHistory.length > 0);
  };

  const getWeekStart = () => { const now = new Date(); const day = now.getDay(); const monday = new Date(now); monday.setDate(now.getDate() + (day === 0 ? -6 : 1 - day)); monday.setHours(0,0,0,0); return monday; };

  const getWeeklyVolume = () => {
    const weekStart = getWeekStart(); const detailedVolume = {}; Object.keys(DETAILED_MUSCLE_GROUPS).forEach(m => { detailedVolume[m] = 0; });
    workoutHistory.forEach(workout => { if (new Date(workout.dateTimestamp) >= weekStart) { workout.exercises.forEach(exercise => { const detailed = exercise.detailedMuscle || getDetailedMuscle(exercise.name); if (detailed && detailedVolume[detailed] !== undefined) detailedVolume[detailed] += exercise.sets.length; }); } });
    const parentVolume = {}; Object.keys(MUSCLE_GROUP_ICONS).forEach(g => { parentVolume[g] = 0; }); Object.entries(detailedVolume).forEach(([muscle, sets]) => { const parent = DETAILED_MUSCLE_GROUPS[muscle]?.parent; if (parent && parentVolume[parent] !== undefined) parentVolume[parent] += sets; });
    const deloadMultiplier = deloadWeek ? 0.5 : 1;
    const adjustedTargets = {};
    Object.entries(DETAILED_MUSCLE_GROUPS).forEach(([muscle, info]) => {
      adjustedTargets[muscle] = Math.ceil(info.target * deloadMultiplier);
    });
    return { detailedVolume, parentVolume, adjustedTargets };
  };

  const getWeekLabel = () => { const monday = getWeekStart(); const sunday = new Date(monday); sunday.setDate(monday.getDate() + 6); const opts = { day: 'numeric', month: 'short' }; return `${monday.toLocaleDateString(undefined, opts)} – ${sunday.toLocaleDateString(undefined, opts)}`; };
  const daysBetween = (d1, d2) => Math.round(Math.abs(new Date(d2) - new Date(d1)) / (1000 * 60 * 60 * 24));

  const handleUngroup = (exerciseId) => {
    const exercise = programs[selectedProgram]?.exercises.find(e => String(e.id) === String(exerciseId)); if (!exercise || !exercise.groupId) return;
    const groupId = exercise.groupId; const groupMembers = programs[selectedProgram].exercises.filter(e => e.groupId === groupId);
    if (groupMembers.length <= 2) { setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => ex.groupId === groupId ? { ...ex, groupId: null } : ex) })); }
    else { setPrograms(programs.map((p, i) => i !== selectedProgram ? p : { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(exerciseId) ? { ...ex, groupId: null } : ex) })); }
  };

  const handleSubstituteExercise = (exercise, substituteName) => {
    const newKey = substituteName.toLowerCase();
    setPrograms(prev => prev.map((p, i) => {
      if (i !== selectedProgram) return p;
      return { ...p, exercises: p.exercises.map(ex => String(ex.id) === String(exercise.id) ? { ...ex, name: substituteName, note: exerciseNotes[newKey] ?? '', pr: null } : ex) };
    }));
    setShowSubModal(false); setSubExercise(null);
  };

  const openNoteModal = (exercise) => { setNoteExercise(exercise); setNoteText(exerciseNotes[exercise.name.toLowerCase()] ?? exercise.note ?? ''); setShowNoteModal(true); };
  const handleSaveNote = () => { const key = noteExercise.name.toLowerCase(); setExerciseNotes(prev => ({ ...prev, [key]: noteText })); setPrograms(prev => prev.map(p => ({ ...p, exercises: p.exercises.map(ex => ex.name.toLowerCase() === key ? { ...ex, note: noteText } : ex) }))); setShowNoteModal(false); setNoteExercise(null); setNoteText(''); };

  const openProgram = (index) => {
    setSelectedProgram(index);
    const groupIds = {};
    programs[index].exercises.forEach(ex => { if (ex.groupId) groupIds[ex.groupId] = true; });
    setCollapsedGroups(groupIds);
    const swappable = programs[index].exercises.filter(ex => hasSubstitution(ex.name));
    if (swappable.length > 0) {
      setSubGuideExercises(swappable);
      setShowSubGuideModal(true);
    }
    setCurrentScreen('program');
  };
  const goHome = () => {
    // Restore any session-only ungrouped or joined exercises back to their original state
    if (selectedProgram !== null) {
      setPrograms(prev => prev.map((p, i) => {
        if (i !== selectedProgram) return p;
        return {
          ...p,
          exercises: p.exercises.map(ex => {
            if (ex._savedGroupId !== undefined) {
              return { ...ex, groupId: ex._savedGroupId || null, _savedGroupId: undefined, _wasUngrouped: undefined };
            }
            return ex;
          }),
        };
      }));
    }
    localStorage.removeItem('activeWorkout');
    setSelectedProgram(null);
    setCurrentScreen('home');
    setWorkoutStartTime(null);
    setElapsedTime(0);
    setCompletedSets({});
    setDoneExercises([]);
    clearInterval(timerRef.current);
    clearInterval(restTimerRef.current);
    setIsResting(false);
    setRestTime(0);
  };
  const handleCreateProgram = () => { if (!newProgramName.trim()) return; setPrograms([...programs, { name: newProgramName.trim(), type: newProgramType, exercises: [] }]); setNewProgramName(''); setNewProgramType('strength'); setShowModal(false); };
  const completeOnboarding = () => { try { localStorage.setItem('hasCompletedOnboarding', 'true'); } catch (e) {} setShowOnboarding(false); setTemplateTab('all'); };

  // ── Substitution modal renderer ──
  const renderSubModal = () => {
    if (!showSubModal || !subExercise) return null;
    const sub = EXERCISE_SUBSTITUTIONS[subExercise.name]; if (!sub) return null;
    return (
      <div className="modal-overlay" style={{ zIndex: 350 }}>
        <div className="modal detailed-muscle-modal">
          <div style={{ textAlign: 'center', fontSize: '1.4rem', marginBottom: '-4px' }}>🔄</div>
          <h2 style={{ textAlign: 'center' }}>Replace Exercise</h2>
          <div className="sub-reason-tag"><span>⚠️ {sub.reason}</span></div>
          <p className="subtitle" style={{ textAlign: 'center' }}>Choose a substitute for <strong style={{ color: 'var(--text-primary)' }}>{subExercise.name}</strong> that trains the same muscles</p>
          <div className="sub-list">
            {sub.substitutes.map((s, i) => (
              <div key={i} className="sub-item">
                <div className="sub-item-info">
                  <p className="sub-item-name">{s.name}</p>
                  <p className="sub-item-equipment">🏠 {s.equipment}</p>
                  <p className="sub-item-note">{s.note}</p>
                </div>
                <button className="sub-item-btn" onClick={() => handleSubstituteExercise(subExercise, s.name)}>Use This</button>
              </div>
            ))}
          </div>
          <button className="cancel-btn" onClick={() => { setShowSubModal(false); setSubExercise(null); }}>Keep Original</button>
        </div>
      </div>
    );
  };

  // ── Tip modal renderer ──
  const renderTipModal = () => {
    if (!showTipModal || !tipExercise) return null;
    const tip = EXERCISE_TIPS[tipExercise.name];
    return (
      <div className="modal-overlay" style={{ zIndex: 350 }}>
        <div className="modal">
          <div style={{ textAlign: 'center', fontSize: '1.6rem', marginBottom: '-4px' }}>
            {DETAILED_MUSCLE_ICONS[tip?.muscle] || '💪'}
          </div>
          <h2 style={{ textAlign: 'center' }}>{tipExercise.name}</h2>
          {tip?.muscle && <p className="subtitle" style={{ textAlign: 'center' }}>Target: {tip.muscle}</p>}
          {tip ? (
            <>
              <div className="tip-list">
                {tip.tips.map((t, i) => (
                  <div key={i} className="tip-item">
                    <span className="tip-bullet">•</span>
                    <span className="tip-text">{t}</span>
                  </div>
                ))}
              </div>
              <a href={getExerciseTipUrl(tipExercise.name)} target="_blank" rel="noopener noreferrer" className="tip-youtube-btn">
                🎬 Watch on YouTube
              </a>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p className="subtitle" style={{ marginBottom: '12px' }}>No tips available yet for this exercise.</p>
              <a href={getExerciseTipUrl(tipExercise.name)} target="_blank" rel="noopener noreferrer" className="tip-youtube-btn">
                🎬 Watch on YouTube
              </a>
            </div>
          )}
          <button className="cancel-btn" onClick={() => { setShowTipModal(false); setTipExercise(null); }}>Close</button>
        </div>
      </div>
    );
  };

  // ── Render helpers ──
  const renderSetRow = (exercise, setIndex) => {
    const exerciseId = String(exercise.id); const log = setLogs[exerciseId]?.[setIndex]; const isDone = isSetDone(exerciseId, setIndex); const exType = exercise.type || 'strength';
    const prKey = `${exerciseId}-${setIndex}`; const prStatus = setPRStatuses[prKey]; const isFlashing = flashingPRs[prKey];

    if (exType === 'mobility') {
      return (
        <SwipeableSetRow key={setIndex} onSwipeComplete={() => handleCompleteSet(exercise, setIndex)} disabled={isDone}>
          <div className={`set-row ${isDone ? 'set-row-done' : ''}`}>
            <span className="set-label">Set {setIndex + 1}</span>
            <div style={{ flex: 1 }}><MobilitySetTimer duration={exercise.duration || 30} onComplete={() => handleCompleteSet(exercise, setIndex)} isDone={isDone} /></div>
          </div>
        </SwipeableSetRow>
      );
    }

    if (exType === 'cardio' || isCardioExercise(exercise.name)) {
      const lastCardioValues = (() => {
        const key = exercise.name.toLowerCase();
        const g = globalHistory[key];
        if (g?.sets?.[setIndex]) return g.sets[setIndex];
        if (!exercise.history?.length) return null;
        return exercise.history[exercise.history.length - 1]?.sets?.[setIndex] || null;
      })();
      const dist = log?.distance || ''; const dur = log?.duration || '';
      const effectiveDist = dist || lastCardioValues?.distance || '';
      const effectiveDur = dur || lastCardioValues?.duration || '';
      const pace = formatPace(parseFloat(effectiveDist), parseFloat(effectiveDur)); const isReady = !!(effectiveDist && effectiveDur);
      return (
        <SwipeableSetRow key={setIndex} onSwipeComplete={() => handleCompleteSet(exercise, setIndex)} disabled={isDone || !isReady}>
          <div className={`set-row ${isDone ? 'set-row-done' : ''}`}>
            <span className="set-label">Set {setIndex + 1}</span>
            <div className="set-inputs">
              <div className="set-input-group"><label className="set-input-label">km</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder="0" value={dist} onChange={(e) => handleSetInputChange(exercise, setIndex, 'distance', e.target.value)} disabled={isDone} /></div>
              <div className="set-input-group"><label className="set-input-label">min</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder="0" value={dur} onChange={(e) => handleSetInputChange(exercise, setIndex, 'duration', e.target.value)} disabled={isDone} /></div>
            </div>
            <div className="set-check-btn-wrapper">
              {pace && !isDone && <span className="cardio-pace">{pace}</span>}
              {isDone && pace && <span className="cardio-pace-done">{pace}</span>}
              <button className={`set-check-btn ${isDone ? 'set-check-btn-done' : isReady ? 'set-check-btn-ready' : ''}`} onClick={() => handleCompleteSet(exercise, setIndex)} disabled={isDone || !isReady}>{isDone ? '✓' : ''}</button>
            </div>
          </div>
        </SwipeableSetRow>
      );
    }

    const isBW = isBodyweightExercise(exercise.name);
    const lastValues = (() => { const key = exercise.name.toLowerCase(); const g = globalHistory[key]; if (g?.sets?.[setIndex]) return g.sets[setIndex]; if (!exercise.history?.length) return null; return exercise.history[exercise.history.length - 1]?.sets?.[setIndex] || null; })();
    const lastValuesForReady = (() => {
      const key = exercise.name.toLowerCase();
      const g = globalHistory[key];
      if (g?.sets?.[setIndex]) return g.sets[setIndex];
      if (!exercise.history?.length) return null;
      return exercise.history[exercise.history.length - 1]?.sets?.[setIndex] || null;
    })();
    const effectiveWeight = log?.weight || lastValuesForReady?.weight;
    const effectiveReps = log?.reps || lastValuesForReady?.reps;
    const isReady = isBW ? !!(log?.reps || lastValuesForReady?.reps) : !!(effectiveWeight && effectiveReps);
    const rowContent = (
      <div className={`set-row ${isDone ? 'set-row-done' : ''} ${isFlashing && prStatus === 'alltime' ? 'set-row-flash-alltime' : ''} ${isFlashing && prStatus === 'better' ? 'set-row-flash-better' : ''}`}>
        <span className="set-label">Set {setIndex + 1}</span>
        <div className="set-inputs">
          {isBW ? (
            <>
              <div className="set-input-group"><label className="set-input-label">weight</label><div className={`bw-tag ${isDone ? 'bw-tag-done' : ''}`}>BW</div></div>
              <div className="set-input-group"><label className="set-input-label">+kg</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder={lastValues?.extraKg || '0'} value={log?.extraKg || ''} onChange={(e) => handleSetInputChange(exercise, setIndex, 'extraKg', e.target.value)} disabled={isDone} /></div>
              <div className="set-input-group"><label className="set-input-label">reps</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder={lastValues?.reps || '0'} value={log?.reps || ''} onChange={(e) => handleSetInputChange(exercise, setIndex, 'reps', e.target.value)} disabled={isDone} /></div>
            </>
          ) : (
            <>
              <div className="set-input-group"><label className="set-input-label">kg</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder={lastValues?.weight || '0'} value={log?.weight || ''} onChange={(e) => handleSetInputChange(exercise, setIndex, 'weight', e.target.value)} disabled={isDone} /></div>
              <div className="set-input-group"><label className="set-input-label">reps</label><input className={`set-input ${isDone ? 'set-input-done' : ''}`} type="number" placeholder={lastValues?.reps || '0'} value={log?.reps || ''} onChange={(e) => handleSetInputChange(exercise, setIndex, 'reps', e.target.value)} disabled={isDone} /></div>
            </>
          )}
        </div>
        <div className="set-check-btn-wrapper" style={{ position: 'relative' }}>
          <button className={`set-check-btn ${isDone ? 'set-check-btn-done' : isReady ? 'set-check-btn-ready' : ''} ${isDone && prStatus === 'alltime' ? 'set-check-btn-alltime' : ''} ${isDone && prStatus === 'better' ? 'set-check-btn-better' : ''}`} onClick={() => handleCompleteSet(exercise, setIndex)} disabled={isDone || !isReady}>
            {isDone ? prStatus === 'alltime' ? '🏆' : prStatus === 'better' ? '⬆️' : '✓' : ''}
          </button>
          {isDone && prStatus === 'alltime' && <PRParticleBurst active={isFlashing} />}
          {isDone && prStatus === 'alltime' && <span className="pr-badge pr-badge-alltime">All-time PR!</span>}
          {isDone && prStatus === 'better' && <span className="pr-badge pr-badge-better">Better than last</span>}
        </div>
      </div>
    );
    return <SwipeableSetRow key={setIndex} onSwipeComplete={() => handleCompleteSet(exercise, setIndex)} disabled={isDone || !isReady}>{rowContent}</SwipeableSetRow>;
  };

  const renderSetsControl = (exercise) => (
    <div className="sets-control">
      <button className="sets-control-btn" onClick={(e) => { e.stopPropagation(); handleRemoveSet(exercise.id); }} disabled={exercise.sets <= 1}>−</button>
      <span className="sets-control-count">{exercise.sets} {exercise.type === 'mobility' ? 'reps' : 'sets'}</span>
      <button className="sets-control-btn" onClick={(e) => { e.stopPropagation(); handleAddSet(exercise.id); }}>+</button>
    </div>
  );

  const renderPerSetPRs = (exercise, isWorkout = false) => {
    if ((exercise.type || 'strength') !== 'strength') return null;
    const perSetPRs = getPerSetPRs(exercise);
    const daysSincePR = getDaysSincePR(exercise.name);
    return (
      <div className={`per-set-prs ${isWorkout ? 'workout-prs' : ''}`}>
        {perSetPRs.length === 0 ? <p className="subtitle">No PR yet</p> : (
          <>
            {perSetPRs.map((pr, i) => (
              <p key={i} className="per-set-pr-text">
                {pr ? `🏆 Set ${i + 1}: ${pr.weight}kg × ${pr.reps} reps` : <span className="per-set-no-data">Set {i + 1}: No data</span>}
              </p>
            ))}
            {daysSincePR !== null && !isNaN(daysSincePR) && (
              <p className="pr-days-ago">
                {daysSincePR === 0 ? '🏆 PR set today' : daysSincePR === 1 ? '⏱️ PR set yesterday' : `⏱️ PR set ${daysSincePR}d ago`}
              </p>
            )}
          </>
        )}
      </div>
    );
  };

  const renderExercises = (exercises) => {
    const isGroupingMode = groupingSourceId !== null; const rendered = []; const usedGroups = [];
    exercises.forEach((exercise) => {
      const exId = String(exercise.id); const isSource = exId === String(groupingSourceId); const isSelected = groupingSelectedIds.includes(exId);
      if (exercise.groupId && usedGroups.includes(exercise.groupId)) return;
      if (exercise.groupId) {
        usedGroups.push(exercise.groupId); const groupExercises = sortedVisible.filter(e => e.groupId === exercise.groupId); const isCollapsed = collapsedGroups[exercise.groupId] !== false; const firstEx = groupExercises[0];
        rendered.push(
          <div key={exercise.groupId} className="group-card">
            <div className="group-collapse-header" onClick={() => !isGroupingMode && toggleGroupCollapsed(exercise.groupId)}>
              <div className="group-collapse-left">
                <span className="group-collapse-icon">{isCollapsed ? '＋' : '－'}</span>
                <div className="group-collapse-info"><span className="group-collapse-name">{firstEx.name}</span><span className="group-collapse-count">{groupExercises.length} exercises · superset</span></div>
              </div>
              {!isGroupingMode && <div className="group-collapse-actions" onClick={e => e.stopPropagation()}><button className="group-with-btn" onClick={(e) => handleStartGrouping(e, String(firstEx.id))}>＋ Group with</button></div>}
            </div>
            {!isCollapsed && (
              <div className="group-expanded-content">
                {groupExercises.map((groupEx, groupIndex) => {
                  const gExId = String(groupEx.id); const gIsSelected = groupingSelectedIds.includes(gExId); const gIsSource = gExId === String(groupingSourceId);
                  return (
                    <div key={groupEx.id}>
                      <div className={`exercise-card-grouped ${isGroupingMode && !gIsSource ? 'grouping-selectable' : ''} ${gIsSelected ? 'grouping-selected' : ''}`} onClick={isGroupingMode && !gIsSource ? (e) => handleToggleGroupSelection(e, gExId) : undefined}>
                        {isGroupingMode && !gIsSource && <div className={`group-checkbox ${gIsSelected ? 'group-checkbox-checked' : ''}`}>{gIsSelected && <span>✓</span>}</div>}
                        <div className="exercise-card-left">
                          <div className="exercise-card-title-row">
                            <h2>{groupEx.name}</h2>
                            {!isGroupingMode && <div className="exercise-card-actions"><button className="rename-exercise-btn" onClick={(e) => handleRenameExercisePress(e, groupEx)}>✏️</button><button className="remove-exercise-btn" onClick={(e) => handleRemoveProgramExercisePress(e, groupEx)}>🗑️</button></div>}
                          </div>
                          {!isGroupingMode && renderSetsControl(groupEx)}
                          {!isGroupingMode && getExerciseNote(groupEx) && <p className="note-text">📝 {getExerciseNote(groupEx)}</p>}
                        </div>
                        {!isGroupingMode && (
                            <div className="exercise-info">
                              {renderPerSetPRs(groupEx, false)}
                              <button className="note-btn" onClick={(e) => { e.stopPropagation(); openNoteModal(groupEx); }}>📝</button>
                              <button className="note-btn" onClick={(e) => { e.stopPropagation(); setTipExercise(groupEx); setShowTipModal(true); }}>ℹ️</button>
                              {hasSubstitution(groupEx.name) && <button className="sub-badge-btn" onClick={(e) => { e.stopPropagation(); setSubExercise(groupEx); setShowSubModal(true); }}>🔄</button>}
                              <button className="ungroup-btn" onClick={(e) => { e.stopPropagation(); handleUngroup(groupEx.id); }}>✕ Ungroup</button>
                            </div>
                          )}
                      </div>
                      {groupIndex < groupExercises.length - 1 && <div className="or-divider">— OR —</div>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      } else {
        const exType = exercise.type || 'strength'; const typeTag = exType === 'mobility' ? '🧘' : exType === 'cardio' ? '🏃' : null;
        rendered.push(
          <div key={exercise.id} className={`exercise-card ${isGroupingMode && !isSource ? 'grouping-selectable' : ''} ${isSelected && !isSource ? 'grouping-selected' : ''} ${isSource ? 'grouping-source' : ''}`} onClick={isGroupingMode && !isSource ? (e) => handleToggleGroupSelection(e, exId) : undefined}>
            {isGroupingMode && !isSource && <div className={`group-checkbox ${isSelected ? 'group-checkbox-checked' : ''}`}>{isSelected && <span>✓</span>}</div>}
            <div className="exercise-card-left">
              <div className="exercise-card-title-row">
                <h2>{typeTag && <span style={{ marginRight: '6px' }}>{typeTag}</span>}{exercise.name}</h2>
                {!isGroupingMode && <div className="exercise-card-actions"><button className="rename-exercise-btn" onClick={(e) => handleRenameExercisePress(e, exercise)}>✏️</button><button className="remove-exercise-btn" onClick={(e) => handleRemoveProgramExercisePress(e, exercise)}>🗑️</button></div>}
              </div>
              {!isGroupingMode && renderSetsControl(exercise)}
              {!isGroupingMode && getExerciseNote(exercise) && <p className="note-text">📝 {getExerciseNote(exercise)}</p>}
            </div>
            {!isGroupingMode && (
                <div className="exercise-info">
                  {renderPerSetPRs(exercise, false)}
                  <button className="note-btn" onClick={(e) => { e.stopPropagation(); openNoteModal(exercise); }}>📝</button>
                  <button className="note-btn" onClick={(e) => { e.stopPropagation(); setTipExercise(exercise); setShowTipModal(true); }}>ℹ️</button>
                  {hasSubstitution(exercise.name) && <button className="sub-badge-btn" onClick={(e) => { e.stopPropagation(); setSubExercise(exercise); setShowSubModal(true); }}>🔄</button>}
                  {exType === 'strength' && <button className="group-with-btn" onClick={(e) => handleStartGrouping(e, exId)}>＋ Group with</button>}
                </div>
              )}
          </div>
        );
      }
    });
    return rendered;
  };

  const handleStartWorkoutGrouping = (e, exerciseId) => {
    e.stopPropagation();
    // Check if there are existing groups in the workout to join
    const existingGroups = [];
    const seenGroupIds = new Set();
    programs[selectedProgram]?.exercises.forEach(ex => {
      if (ex.groupId && !seenGroupIds.has(ex.groupId) && !ex.removedThisSession) {
        seenGroupIds.add(ex.groupId);
        const members = programs[selectedProgram].exercises.filter(e => e.groupId === ex.groupId);
        existingGroups.push({ groupId: ex.groupId, groupName: members[0]?.name || 'Group', memberCount: members.length });
      }
    });
    if (existingGroups.length > 0) {
      // Show picker — join existing group or create new
      setJoinGroupTarget({ exerciseId, existingGroups, mode: 'pick' });
      setShowJoinGroupModal(true);
    } else {
      setGroupingSourceId(exerciseId);
      setGroupingSelectedIds([exerciseId]);
    }
  };

  const handleConfirmWorkoutGroup = () => {
    if (groupingSelectedIds.length < 2) { setGroupingSourceId(null); setGroupingSelectedIds([]); return; }
    const newGroupId = `group_${Date.now()}`;
    setPrograms(prev => prev.map((p, i) => {
      if (i !== selectedProgram) return p;
      return { ...p, exercises: p.exercises.map(ex => groupingSelectedIds.includes(String(ex.id)) ? { ...ex, groupId: newGroupId } : ex) };
    }));
    setCollapsedGroups(prev => ({ ...prev, [newGroupId]: false }));
    setGroupingSourceId(null); setGroupingSelectedIds([]);
  };

  const renderWorkoutExercises = (exercises) => {
    const rendered = []; const usedGroups = []; const allVisible = exercises.filter(ex => !ex.removedThisSession);

    // Build a key for each exercise or group
    const getKey = (ex) => ex.groupId || String(ex.id);

    // Check if a key is fully done
    const isDoneKey = (key) => {
      const members = allVisible.filter(ex => getKey(ex) === key);
      return members.length > 0 && members.every(ex => doneExercises.includes(String(ex.id)));
    };

    // Get all unique keys in original order
    const seenKeys = new Set();
    const originalOrder = [];
    allVisible.forEach(ex => {
      const key = getKey(ex);
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        originalOrder.push(key);
      }
    });

    // Split into done and not done
    const doneKeys = completionOrder.filter(k => originalOrder.includes(k));
    const notDoneKeys = originalOrder.filter(k => !isDoneKey(k));

    // Final order: done in completion order first, then not done in original order
    const finalOrder = [...doneKeys, ...notDoneKeys];

    // Build sortedVisible from finalOrder
    const sortedVisible = [];
    finalOrder.forEach(key => {
      allVisible.filter(ex => getKey(ex) === key).forEach(ex => sortedVisible.push(ex));
    });
    sortedVisible.forEach((exercise) => {
      if (exercise.groupId && usedGroups.includes(exercise.groupId)) return;
      if (exercise.groupId) {
        usedGroups.push(exercise.groupId); const groupExercises = sortedVisible.filter(e => e.groupId === exercise.groupId); const isCollapsed = collapsedGroups[exercise.groupId] !== false; const firstEx = groupExercises[0]; const allDone = groupExercises.every(ex => doneExercises.includes(String(ex.id)));
        rendered.push(
          <div key={exercise.groupId} className={`group-card ${allDone ? 'group-card-done' : ''}`} style={{ marginBottom: '10px' }}>
            <div className={`group-collapse-header ${allDone ? 'group-collapse-header-done' : ''}`} onClick={() => toggleGroupCollapsed(exercise.groupId)}>
              <div className="group-collapse-left">
                <span className="group-collapse-icon">{isCollapsed ? '＋' : '－'}</span>
                <div className="group-collapse-info"><span className="group-collapse-name">{firstEx.name}</span><span className="group-collapse-count">{groupExercises.length} exercises · superset{allDone && ' · ✓ Done'}</span></div>
              </div>
              <button
                className="workout-ungroup-all-btn"
                onClick={(e) => { e.stopPropagation(); handleUngroupPress('all', exercise.groupId); }}
              >
                ✕ Ungroup All
              </button>
            </div>
            {!isCollapsed && (
              <div className="group-expanded-content">
                {groupExercises.map((groupEx, groupIndex) => (
                  <div key={groupEx.id}>
                    <div className={`workout-exercise-card ${doneExercises.includes(String(groupEx.id)) ? 'workout-exercise-done' : ''}`} style={{ borderRadius: 0, marginBottom: 0 }}>
                      <div className="workout-exercise-header">
                        <div className="workout-exercise-title">
                          <h2>{groupEx.name}</h2>
                          <div className="workout-exercise-actions">
                            <button className="note-btn note-btn-always" onClick={() => openNoteModal(groupEx)}>📝</button>
                            <button className="note-btn note-btn-always" onClick={() => { setTipExercise(groupEx); setShowTipModal(true); }}>ℹ️</button>
                            {hasSubstitution(groupEx.name) && <button className="note-btn note-btn-always" onClick={() => { setSubExercise(groupEx); setShowSubModal(true); }}>🔄</button>}
                            <button className="workout-ungroup-single-btn" onClick={() => handleUngroupPress('single', groupEx.groupId, groupEx.id)}>✕ Ungroup</button>
                            <button className="remove-exercise-btn" onClick={() => handleRemoveWorkoutExercisePress(groupEx.id)}>🗑️</button>
                          </div>
                        </div>
                        {groupEx.workoutOnly && <span className="workout-only-tag">This session only</span>}
                        {renderPerSetPRs(groupEx, true)}
                        {(() => { const days = getDaysSinceLastSession(groupEx.name); const lastSession = globalHistory[groupEx.name.toLowerCase()]; if (!lastSession) return null; return <p className="subtitle">Last: {lastSession.date}{days !== null && <span className={`days-since ${days === 0 ? 'days-today' : days <= 3 ? 'days-recent' : days >= 7 ? 'days-old' : ''}`}>{' '}· {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`}</span>}</p>; })()}
                        {getExerciseNote(groupEx) && <p className="note-text">📝 {getExerciseNote(groupEx)}</p>}
                      </div>
                      <div className="sets-container">
                        <div className="sets-header"><span className="set-label"></span><div className="set-inputs-header"><span className="set-input-header-label">kg</span><span className="set-input-header-label">reps</span></div><span style={{ width: '44px' }}></span></div>
                        {Array.from({ length: groupEx.sets }).map((_, i) => renderSetRow(groupEx, i))}
                      </div>
                      <div className="workout-set-controls">
                        <button className="workout-set-control-btn remove" onClick={() => handleRemoveSetWorkout(groupEx.id, groupEx.sets)} disabled={groupEx.sets <= 1}>− Remove Set</button>
                        <button className="workout-set-control-btn add" onClick={() => handleAddSetWorkout(groupEx.id)}>+ Add Set</button>
                      </div>
                    </div>
                    {groupIndex < groupExercises.length - 1 && <div className="or-divider">— OR —</div>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      } else {
        const exerciseId = String(exercise.id); const isDone = doneExercises.includes(exerciseId); const isCollapsed = collapsedWorkoutExercises[exerciseId] === true; const exType = exercise.type || 'strength';
        rendered.push(
          <div key={exercise.id} className={`workout-exercise-card ${isDone ? 'workout-exercise-done' : ''} ${groupingSourceId && !isDone && exerciseId !== String(groupingSourceId) ? 'grouping-selectable' : ''} ${groupingSelectedIds.includes(exerciseId) && exerciseId !== String(groupingSourceId) ? 'grouping-selected' : ''} ${exerciseId === String(groupingSourceId) ? 'grouping-source' : ''}`} style={{ marginBottom: '10px' }} onClick={groupingSourceId && !isDone && exerciseId !== String(groupingSourceId) ? (e) => { e.stopPropagation(); setGroupingSelectedIds(prev => prev.includes(exerciseId) ? prev.filter(id => id !== exerciseId) : [...prev, exerciseId]); } : undefined}>
            <div className="workout-exercise-collapse-header" onClick={(e) => { if (groupingSourceId) return; toggleWorkoutExerciseCollapsed(exerciseId); }}>
              <div className="workout-exercise-title">
                <div className="workout-exercise-title-left">
                  {isDone && <span className="exercise-done-indicator">✓</span>}
                  <div className="workout-exercise-title-info">
                    <h2>{exType === 'mobility' && <span style={{ marginRight: '6px' }}>🧘</span>}{exType === 'cardio' && <span style={{ marginRight: '6px' }}>🏃</span>}{exercise.name}</h2>
                    <span className="workout-exercise-sets-count">
                      {(completedSets[exerciseId]?.length || 0)} / {exercise.sets} sets
                    </span>
                  </div>
                </div>
                <div className="workout-exercise-actions">
                  <button className="note-btn note-btn-always" onClick={(e) => { e.stopPropagation(); openNoteModal(exercise); }}>📝</button>
                  <button className="note-btn note-btn-always" onClick={(e) => { e.stopPropagation(); setTipExercise(exercise); setShowTipModal(true); }}>ℹ️</button>
                  {hasSubstitution(exercise.name) && <button className="note-btn note-btn-always" onClick={(e) => { e.stopPropagation(); setSubExercise(exercise); setShowSubModal(true); }}>🔄</button>}
                  {!isDone && !groupingSourceId && <button className="workout-group-btn" onClick={(e) => { e.stopPropagation(); handleStartWorkoutGrouping(e, exerciseId); }}>⊕ Group</button>}
                  {!isDone && <button className="remove-exercise-btn" onClick={(e) => { e.stopPropagation(); handleRemoveWorkoutExercisePress(exercise.id); }}>🗑️</button>}
                  <span className="exercise-collapse-arrow">{isCollapsed ? '＋' : '－'}</span>
                </div>
              </div>
              {exercise.workoutOnly && <span className="workout-only-tag">This session only</span>}
            </div>
            {!isCollapsed && (
              <>
                {renderPerSetPRs(exercise, true)}
                {exType === 'strength' && (() => { const days = getDaysSinceLastSession(exercise.name); const lastSession = globalHistory[exercise.name.toLowerCase()]; if (!lastSession) return null; return <p className="subtitle" style={{ marginBottom: '6px' }}>Last: {lastSession.date}{days !== null && <span className={`days-since ${days === 0 ? 'days-today' : days <= 3 ? 'days-recent' : days >= 7 ? 'days-old' : ''}`}>{' '}· {days === 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days}d ago`}</span>}</p>; })()}
                {getExerciseNote(exercise) && <p className="note-text">📝 {getExerciseNote(exercise)}</p>}
                <div className="sets-container">
                  <div className="sets-header">
                    <span className="set-label"></span>
                    <div className="set-inputs-header">
                      {exType === 'cardio' ? (<><span className="set-input-header-label">km</span><span className="set-input-header-label">min</span></>) : exType === 'mobility' ? <span className="set-input-header-label">Timer</span> : (<><span className="set-input-header-label">kg</span><span className="set-input-header-label">reps</span></>)}
                    </div>
                    <span style={{ width: '44px' }}></span>
                  </div>
                  {Array.from({ length: exercise.sets }).map((_, i) => renderSetRow(exercise, i))}
                </div>
                {exType !== 'mobility' && (
                  <div className="workout-set-controls">
                    <button className="workout-set-control-btn remove" onClick={() => handleRemoveSetWorkout(exercise.id, exercise.sets)} disabled={exercise.sets <= 1}>− Remove Set</button>
                    <button className="workout-set-control-btn add" onClick={() => handleAddSetWorkout(exercise.id)}>+ Add Set</button>
                  </div>
                )}
                {(() => {
                  const completedIndexes = completedSets[String(exercise.id)] || [];
                  if (completedIndexes.length === 0) return null;
                  return (
                    <button
                      className="workout-undo-btn"
                      onClick={() => handleUndoLastSet(exercise.id)}
                    >
                      ↩ Undo Last Set
                    </button>
                  );
                })()}
              </>
            )}
          </div>
        );
      }
    });
    return rendered;
  };

  const renderCatalogueModal = (fromWorkout) => {
    const search = fromWorkout ? workoutCatalogueSearch : catalogueSearch; const muscleFilter = fromWorkout ? workoutMuscleGroup : selectedMuscleGroup; const activeTab = fromWorkout ? workoutCatalogueTab : catalogueTab;
    const filtered = getFilteredCatalogue(search, muscleFilter); const currentProgramType = selectedProgram !== null ? (programs[selectedProgram]?.type || 'strength') : 'strength';
    const availableGroups = getGroupsFromOtherPrograms(); const catalogueGroups = currentProgramType === 'mobility' ? Object.keys(MOBILITY_CATALOGUE) : Object.keys(buildFullCatalogue(customExercises));
    return (
      <div className="modal-overlay" style={{ zIndex: 250 }}>
        <div className="modal catalogue-modal">
          <h2>Add Exercise</h2>
          <div className="catalogue-tabs">
            <button className={`catalogue-tab-btn ${activeTab === 'exercises' ? 'catalogue-tab-active' : ''}`} onClick={() => fromWorkout ? setWorkoutCatalogueTab('exercises') : setCatalogueTab('exercises')}>Exercises</button>
            {currentProgramType !== 'mobility' && <button className={`catalogue-tab-btn ${activeTab === 'groups' ? 'catalogue-tab-active' : ''}`} onClick={() => fromWorkout ? setWorkoutCatalogueTab('groups') : setCatalogueTab('groups')}>Groups{availableGroups.length > 0 && <span className="catalogue-tab-badge">{availableGroups.length}</span>}</button>}
          </div>
          {activeTab === 'exercises' ? (
            <>
              <div className="custom-exercise-row"><input className="input" type="text" placeholder="Custom exercise name..." value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddExercise(null, fromWorkout)} /><button className="add-custom-btn" onClick={() => handleAddExercise(null, fromWorkout)} disabled={!newExerciseName.trim()}>+ Add</button></div>
              <div className="catalogue-divider"><span>— or pick from catalogue —</span></div>
              <input className="input" type="text" placeholder="🔍 Search exercises..." value={search} onChange={(e) => fromWorkout ? setWorkoutCatalogueSearch(e.target.value) : setCatalogueSearch(e.target.value)} />
              <div className="muscle-group-filter">{['All', ...catalogueGroups].map(group => <button key={group} className={`muscle-group-btn ${muscleFilter === group ? 'muscle-group-btn-active' : ''}`} onClick={() => fromWorkout ? setWorkoutMuscleGroup(group) : setSelectedMuscleGroup(group)}>{group}</button>)}</div>
              <div className="catalogue-list">
                {Object.entries(filtered).length === 0 ? <p className="empty-text">No exercises found</p> : (
                  Object.entries(filtered).map(([group, exercises]) => (
                    <div key={group}>
                      <p className="catalogue-group-label">{group}</p>
                      {exercises.map(ex => { const added = isExerciseAdded(ex); const isCustom = customExercises[group]?.includes(ex); return <div key={ex} className="catalogue-item"><div className="catalogue-item-left"><span className="catalogue-item-name">{ex}</span>{isCustom && <span className="custom-tag">custom</span>}</div><button className={`catalogue-add-btn ${added ? 'catalogue-added-btn' : ''}`} onClick={() => !added && handleAddExercise(ex, fromWorkout)} disabled={added}>{added ? '✓ Added' : '+ Add'}</button></div>; })}
                    </div>
                  ))
                )}
              </div>
            </>
          ) : (
            <div className="catalogue-list">
              {availableGroups.length === 0 ? <div className="groups-empty"><p className="empty-text">No groups available</p></div> : (
                availableGroups.map((group) => { const added = isGroupAdded(group.exercises); return <div key={group.key} className="catalogue-group-item"><div className="catalogue-group-item-left"><div className="catalogue-group-item-header"><span className="catalogue-group-item-name">{group.exercises[0].name}</span><span className="catalogue-group-item-count">{group.exercises.length} exercises</span></div><div className="catalogue-group-item-exercises">{group.exercises.map((ex, i) => <span key={i} className="catalogue-group-exercise-pill">{ex.name}</span>)}</div></div><button className={`catalogue-add-btn ${added ? 'catalogue-added-btn' : ''}`} onClick={() => !added && handleAddGroupFromOther(group.exercises)} disabled={added}>{added ? '✓ Added' : '+ Add'}</button></div>; })
              )}
            </div>
          )}
          <button className="cancel-btn" onClick={() => { if (fromWorkout) { setShowWorkoutExerciseModal(false); setWorkoutCatalogueSearch(''); setWorkoutMuscleGroup('All'); setWorkoutCatalogueTab('exercises'); } else { setShowExerciseModal(false); setCatalogueSearch(''); setSelectedMuscleGroup('All'); setCatalogueTab('exercises'); } setNewExerciseName(''); }}>Close</button>
        </div>
      </div>
    );
  };

  const renderPlateCalcModal = () => {
    const total = parseFloat(plateCalcWeight); const hasValidInput = plateCalcWeight !== '' && !isNaN(total) && total > 0;
    return (
      <div className="modal-overlay"><div className="modal plate-calc-modal">
        <h2>🏋️ Plate Calculator</h2>
        <div className="plate-calc-section"><p className="plate-calc-label">Bar Weight</p><div className="bar-selector">{[10, 15, 20].map(w => <button key={w} className={`bar-btn ${barWeight === w ? 'bar-btn-active' : ''}`} onClick={() => setBarWeight(w)}>{w}kg</button>)}</div></div>
        <div className="plate-calc-section"><p className="plate-calc-label">Target Weight (kg)</p><input className="input" type="number" placeholder="e.g. 100" value={plateCalcWeight} onChange={(e) => setPlateCalcWeight(e.target.value)} /></div>
        {hasValidInput && (() => {
          if (total < barWeight) return <p className="plate-calc-error">Weight is less than the bar ({barWeight}kg)</p>;
          if (total === barWeight) return <div className="plate-calc-result"><p className="plate-calc-just-bar">Just the bar — no plates needed</p></div>;
          const result = calculatePlates(total, barWeight); if (!result) return null;
          return (
            <div className="plate-calc-result">
              <p className="plate-calc-result-title">Each side of the bar</p><p className="plate-calc-per-side">{result.weightPerSide}kg per side</p>
              {result.plates.length === 0 ? <p className="plate-calc-error">Cannot make this weight with standard plates</p> : (
                <div className="plate-list">{result.plates.map(({ weight, count }) => <div key={weight} className="plate-row"><div className="plate-visual-group">{Array.from({ length: Math.min(count, 4) }).map((_, i) => <div key={i} className="plate-disc" style={getPlateStyle(weight)}><span className="plate-disc-label">{weight}</span></div>)}{count > 4 && <span style={{ color: '#555', fontSize: '0.75rem', alignSelf: 'center' }}>+{count - 4}</span>}</div><span className="plate-row-info">{count} × {weight}kg<span className="plate-row-sub"> = {(count * weight).toFixed(2)}kg</span></span></div>)}{result.remainder > 0.01 && <p className="plate-calc-remainder">⚠️ {result.remainder.toFixed(2)}kg cannot be made with standard plates</p>}</div>
              )}
              <div className="plate-calc-summary"><div className="plate-calc-summary-row"><span className="plate-calc-summary-label">Bar</span><span className="plate-calc-summary-value">{barWeight}kg</span></div><div className="plate-calc-summary-row"><span className="plate-calc-summary-label">Plates (both sides)</span><span className="plate-calc-summary-value">{(result.weightPerSide * 2).toFixed(2)}kg</span></div><div className="plate-calc-summary-divider" /><div className="plate-calc-summary-row"><span className="plate-calc-summary-label total">Total</span><span className="plate-calc-summary-value total">{total}kg</span></div></div>
            </div>
          );
        })()}
        <button className="cancel-btn" onClick={() => { setShowPlateCalc(false); setPlateCalcWeight(''); }}>Close</button>
      </div></div>
    );
  };

  const prData = getPRData(); const filteredPRData = prData.filter(e => e.name.toLowerCase().includes(progressSearch.toLowerCase()));
  const { detailedVolume, parentVolume, adjustedTargets } = getWeeklyVolume();
  const musclesByParent = {};
  Object.entries(DETAILED_MUSCLE_GROUPS).forEach(([muscle, info]) => { if (!musclesByParent[info.parent]) musclesByParent[info.parent] = []; musclesByParent[info.parent].push(muscle); });
  const sortedProgramIndices = [...programs.map((_, i) => i).filter(i => favourites.includes(i)), ...programs.map((_, i) => i).filter(i => !favourites.includes(i))];
  const isMainTab = ['home', 'volume', 'progress', 'history', 'profile'].includes(currentScreen);
  const lifetimeStats = (() => {
    const totalWorkouts = workoutHistory.length;
    const totalSets = workoutHistory.reduce((a, w) => a + w.exercises.reduce((b, e) => b + e.sets.length, 0), 0);
    const totalWeight = workoutHistory.reduce((a, w) => a + (w.totalWeight || 0), 0);
    const totalPRs = Object.values(globalPRHistory).reduce((a, s) => a + s.length, 0);
    const avgDuration = totalWorkouts > 0 ? Math.round(workoutHistory.reduce((a, w) => a + (w.duration || 0), 0) / totalWorkouts) : 0;
    const longestStreak = (() => {
      const weekStarts = new Set();
      workoutHistory.forEach(w => {
        const d = new Date(w.dateTimestamp); const day = d.getDay();
        const monday = new Date(d); monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day)); monday.setHours(0,0,0,0);
        weekStarts.add(monday.getTime());
      });
      const sorted = [...weekStarts].sort((a, b) => a - b);
      let best = 0; let current = 1;
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i] - sorted[i - 1] === 7 * 86400000) { current++; best = Math.max(best, current); }
        else { current = 1; }
      }
      return Math.max(best, sorted.length > 0 ? 1 : 0);
    })();
    const favouriteMuscle = (() => {
      const counts = {};
      workoutHistory.forEach(w => w.exercises.forEach(ex => {
        const g = ex.muscleGroup; if (g && g !== 'Other' && g !== 'Mobility' && g !== 'Cardio') counts[g] = (counts[g] || 0) + ex.sets.length;
      }));
      const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
      return sorted.length > 0 ? sorted[0][0] : null;
    })();
    const totalProgramsCreated = programs.length;
    return { totalWorkouts, totalSets, totalWeight, totalPRs, avgDuration, longestStreak, favouriteMuscle, totalProgramsCreated };
  })();
  const getWeeklyBalanceHistory = () => {
    const now = new Date();
    const weeks = [];
    for (let i = 11; i >= 0; i--) {
      const weekStart = new Date(now);
      const dayOfWeek = weekStart.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      weekStart.setDate(now.getDate() + diffToMonday - (i * 7));
      weekStart.setHours(0, 0, 0, 0);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 7);
      const weekLabel = weekStart.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
      let push = 0; let pull = 0; let upper = 0; let lower = 0;
      workoutHistory.forEach(workout => {
        const d = new Date(workout.dateTimestamp);
        if (d >= weekStart && d < weekEnd) {
          workout.exercises.forEach(ex => {
            const detailed = ex.detailedMuscle || getDetailedMuscle(ex.name);
            const sets = ex.sets.length;
            if (detailed) {
              if (PUSH_MUSCLES.includes(detailed)) push += sets;
              if (PULL_MUSCLES.includes(detailed)) pull += sets;
              if (UPPER_MUSCLES.includes(detailed)) upper += sets;
              if (LOWER_MUSCLES.includes(detailed)) lower += sets;
            }
          });
        }
      });
      const getPushPullStatus = (a, b) => {
        if (a === 0 && b === 0) return 'neutral';
        if (a === 0 || b === 0) return 'red';
        const ratio = a / b;
        if (ratio >= 0.8 && ratio <= 1.2) return 'green';
        if (ratio >= 0.6 && ratio <= 1.5) return 'yellow';
        return 'red';
      };
      const getUpperLowerStatus = (u, l) => {
        if (u === 0 && l === 0) return 'neutral';
        if (l === 0) return 'red';
        if (u === 0) return 'green';
        const lowerPct = l / u;
        if (lowerPct >= 0.25) return 'green';
        if (lowerPct >= 0.15) return 'yellow';
        return 'red';
      };
      weeks.push({
        label: weekLabel,
        push, pull, upper, lower,
        pushPullStatus: getPushPullStatus(push, pull),
        upperLowerStatus: getUpperLowerStatus(upper, lower),
        hasData: push > 0 || pull > 0 || upper > 0 || lower > 0,
      });
    }
    return weeks;
  };

  const getMuscleRecovery = () => {
    const now = Date.now();
    const recovery = {};
    Object.keys(DETAILED_MUSCLE_GROUPS).forEach(muscle => {
      let lastTrained = null;
      workoutHistory.forEach(workout => {
        workout.exercises.forEach(ex => {
          const detailed = ex.detailedMuscle || getDetailedMuscle(ex.name);
          if (detailed === muscle) {
            if (!lastTrained || workout.dateTimestamp > lastTrained) {
              lastTrained = workout.dateTimestamp;
            }
          }
        });
      });
      if (!lastTrained) {
        recovery[muscle] = { status: 'green', hoursAgo: null, lastTrained: null };
        return;
      }
      const hoursAgo = (now - lastTrained) / (1000 * 60 * 60);
      let status = 'green';
      if (hoursAgo < 24) status = 'red';
      else if (hoursAgo < 48) status = 'yellow';
      recovery[muscle] = { status, hoursAgo, lastTrained };
    });
    return recovery;
  };

  const getCurrentStreak = () => {
    const weekStarts = new Set();
    workoutHistory.forEach(w => {
      const d = new Date(w.dateTimestamp);
      const day = d.getDay();
      const monday = new Date(d);
      monday.setDate(d.getDate() + (day === 0 ? -6 : 1 - day));
      monday.setHours(0, 0, 0, 0);
      weekStarts.add(monday.getTime());
    });
    const sortedWeeks = [...weekStarts].sort((a, b) => b - a);
    if (sortedWeeks.length === 0) return 0;
    const now = new Date();
    const nowDay = now.getDay();
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() + (nowDay === 0 ? -6 : 1 - nowDay));
    thisMonday.setHours(0, 0, 0, 0);
    const lastMonday = new Date(thisMonday);
    lastMonday.setDate(thisMonday.getDate() - 7);
    if (sortedWeeks[0] < lastMonday.getTime()) return 0;
    let streak = 0;
    for (let i = 0; i < sortedWeeks.length; i++) {
      if (i === 0) { streak = 1; continue; }
      const diff = sortedWeeks[i - 1] - sortedWeeks[i];
      if (diff === 7 * 86400000) { streak++; } else break;
    }
    return streak;
  };

  return (
    <div className="container">
      {!appReady && (
        <div className="skeleton-screen">
          <div className="skeleton-title-bar" />
          <div className="skeleton-xp-bar" />
          <div className="skeleton-btn-row">
            <div className="skeleton-btn" />
            <div className="skeleton-btn skeleton-btn-small" />
          </div>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      )}
      {appReady && <>
      {/* ── ONBOARDING ── */}
      {showOnboarding && (
        <div className="modal-overlay" style={{ zIndex: 600 }}>
          <div className="modal onboarding-modal">
          {onboardingStep === 0 && (
              <>
                <div className="onboarding-emoji">💪</div>
                <h2 className="onboarding-title">Welcome to Workout Tracker</h2>
                <p className="onboarding-desc">Everything you need to train smarter, track progress and stay consistent — all in one place.</p>
                <div className="onboarding-features">
                  <div className="onboarding-feature">🏋️ <strong>Programs & Templates</strong> — Create your own or pick from PPL, Upper/Lower, Full Body, Home Bodyweight, Dumbbell and Mobility templates with weekly plans</div>
                  <div className="onboarding-feature">📊 <strong>Set Tracking</strong> — Log kg and reps per set. Swipe right or tap ✓ to complete a set. Bodyweight exercises supported with optional added weight</div>
                  <div className="onboarding-feature">🏆 <strong>Smart PRs</strong> — PRs track both kg and reps. A new PR is only counted if all preceding sets match or beat your best session — no false PRs from weaker earlier sets</div>
                  <div className="onboarding-feature">📈 <strong>Progress Tab</strong> — See your PR history per exercise grouped by muscle group, with a progress chart showing reps on each dot, total gain in kg and reps, and a weekly PR history chart</div>
                  <div className="onboarding-feature">💪 <strong>Weekly Volume</strong> — Track sets per muscle group against targets. Balance check shows push/pull ratio and whether you are training legs enough. Trend chart shows avg kg per set over time</div>
                  <div className="onboarding-feature">📅 <strong>History</strong> — Full workout log plus a weekly balance history tab showing your push/pull and upper/lower balance for every week you trained</div>
                  <div className="onboarding-feature">🔄 <strong>Exercise Substitutions</strong> — Exercises that require equipment (pull-up bar, dip bars, ab wheel) show a swap button with home-friendly alternatives</div>
                  <div className="onboarding-feature">⊕ <strong>Supersets</strong> — Group exercises together as supersets both in programs and during workouts</div>
                  <div className="onboarding-feature">😴 <strong>Rest Timer</strong> — Automatic 2 minute rest timer after each set with sound and vibration alert</div>
                  <div className="onboarding-feature">🏋️ <strong>Plate Calculator</strong> — Calculate exactly which plates to load for any target weight during your workout</div>
                  <div className="onboarding-feature">👤 <strong>Profile & XP</strong> — Earn XP for every set, workout and PR. Level up through titles from Beginner to Legend. Unlock achievement tiers for consistency, volume and strength milestones</div>
                  <div className="onboarding-feature">🔗 <strong>Share Programs</strong> — Share any program via link. Import programs from friends using the Import from Link button in Profile</div>
                  <div className="onboarding-feature">💾 <strong>Backup & Restore</strong> — Export all your data as a JSON file and import it back anytime to keep your history safe</div>
                </div>
                <button className="start-btn" onClick={() => setOnboardingStep(1)}>Get Started →</button>
                <button className="onboarding-skip" onClick={completeOnboarding}>Skip</button>
              </>
            )}
            {onboardingStep === 1 && (
              <>
                <div className="onboarding-emoji">📋</div>
                <h2 className="onboarding-title">Choose a Program</h2>
                <p className="onboarding-desc">Pick a weekly plan or individual template to get started. You can always add more later from Templates.</p>
                <div className="catalogue-tabs" style={{ marginBottom: '8px' }}>
                  <button className={`catalogue-tab-btn ${templateTab === 'plans' ? 'catalogue-tab-active' : ''}`} onClick={() => setTemplateTab('plans')}>🗓️ Weekly Plans</button>
                  <button className={`catalogue-tab-btn ${templateTab === 'all' ? 'catalogue-tab-active' : ''}`} onClick={() => setTemplateTab('all')}>All Templates</button>
                </div>
                {templateTab === 'plans' && (
                  <div style={{ marginBottom: '8px' }}>
                    <p className="edit-custom-label" style={{ marginBottom: '6px', paddingLeft: '2px' }}>How many days per week do you want to train?</p>
                    <div className="weekly-plan-day-picker">
                      {[2, 3, 4, 5, 6].map(d => (
                        <button key={d} className={`weekly-plan-day-btn ${weeklyPlanDays === d ? 'weekly-plan-day-btn-active' : ''}`} onClick={() => setWeeklyPlanDays(d)}>{d} days</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="catalogue-list" style={{ maxHeight: '340px' }}>
                  {templateTab === 'plans' && (() => {
                    const planTags = ['PPL', 'Upper/Lower', 'Full Body', 'Home (Bodyweight)', 'Home (Dumbbells)'];
                    const matchingPlans = HOME_WEEKLY_PLANS.filter(p => planTags.includes(p.tag) && p.days === weeklyPlanDays);
                    if (matchingPlans.length === 0) return (
                      <div className="groups-empty">
                        <p className="empty-text">No plans available for {weeklyPlanDays} days</p>
                        <p className="subtitle" style={{ marginTop: '8px' }}>Try a different number of days above</p>
                      </div>
                    );
                    const grouped = {};
                    matchingPlans.forEach(plan => {
                      if (!grouped[plan.tag]) grouped[plan.tag] = [];
                      grouped[plan.tag].push(plan);
                    });
                    return Object.entries(grouped).map(([tag, plans]) => (
                      <div key={tag}>
                        <p className="catalogue-group-label">{tag}</p>
                        {plans.map(plan => {
                          const alreadyAdded = isPlanAlreadyAdded(plan);
                          return (
                            <div key={plan.id} className="weekly-plan-card" style={{ marginBottom: '6px' }}>
                              <div className="weekly-plan-card-header">
                                <div style={{ flex: 1 }}>
                                  <p className="weekly-plan-card-title">{plan.label}</p>
                                  <p className="weekly-plan-card-desc">{plan.description}</p>
                                </div>
                                <button
                                  className={`catalogue-add-btn ${alreadyAdded ? 'catalogue-added-btn' : ''}`}
                                  onClick={() => { if (!alreadyAdded) { handleAddWeeklyPlan(plan); setOnboardingStep(2); } }}
                                  disabled={alreadyAdded}
                                >
                                  {alreadyAdded ? '✓ Added' : '+ Add All'}
                                </button>
                              </div>
                              {plan.note && <div className="weekly-plan-note">{plan.note}</div>}
                              <div className="weekly-plan-programs">
                                {plan.programs.map((templateId, idx) => {
                                  const template = PROGRAM_TEMPLATES.find(t => t.id === templateId); if (!template) return null;
                                  return (
                                    <div key={idx} className="weekly-plan-program-row">
                                      <span className="weekly-plan-day-label">{plan.dayLabels?.[idx] || `Day ${idx + 1}`}</span>
                                      <span className="weekly-plan-program-name">{template.label}</span>
                                      <span className="weekly-plan-program-count">{template.exercises.length} ex</span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ));
                  })()}
                  {templateTab === 'all' && TEMPLATE_GROUPS.map(tag => (
                    <div key={tag}>
                      <p className="catalogue-group-label">{tag}</p>
                      {PROGRAM_TEMPLATES.filter(t => t.tag === tag).map(template => (
                        <div key={template.id} className="template-item">
                          <div className="template-item-left">
                            <p className="template-item-name">{template.type === 'mobility' ? '🧘 ' : ''}{template.label}</p>
                            <p className="template-item-desc">{template.description}</p>
                            <p className="template-item-count">{template.exercises.length} exercises</p>
                          </div>
                          <button className="catalogue-add-btn" onClick={() => { handleAddTemplate(template); setOnboardingStep(2); }}>+ Add</button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                <button className="cancel-btn" style={{ marginTop: '8px' }} onClick={() => setOnboardingStep(2)}>Skip — I'll create my own</button>
                <button className="onboarding-skip" onClick={completeOnboarding}>Skip all</button>
              </>
            )}
            {onboardingStep === 2 && (
              <><div className="onboarding-emoji">🎉</div><h2 className="onboarding-title">You're Ready!</h2><p className="onboarding-desc">Here's how to get started:</p>
              <div className="onboarding-steps"><div className="onboarding-step"><span className="onboarding-step-num">1</span><span>Open a program and tap <strong>▶ Start Workout</strong></span></div><div className="onboarding-step"><span className="onboarding-step-num">2</span><span>Enter your weight and reps for each set</span></div><div className="onboarding-step"><span className="onboarding-step-num">3</span><span>Tick the ✓ button or swipe right to complete a set</span></div><div className="onboarding-step"><span className="onboarding-step-num">4</span><span>Finish the workout to save your progress</span></div></div>
              <button className="start-btn" onClick={completeOnboarding}>Let's Go 💪</button></>
            )}
          </div>
        </div>
      )}

      {/* ── LEVEL UP ANIMATION ── */}
      {levelUpAnimation && (
        <div className="levelup-overlay">
          <div className="levelup-card">
            <div className="levelup-emoji">⬆️</div>
            <p className="levelup-label">LEVEL UP</p>
            <p className="levelup-level">Level {levelUpAnimation.toLevel}</p>
            <p className="levelup-title">{getLevelFromXP(LEVELS.find(l => l.level === levelUpAnimation.toLevel)?.xp || 0).title}</p>
            <div className="levelup-from">
              <span>Lv.{levelUpAnimation.fromLevel}</span>
              <span className="levelup-arrow">→</span>
              <span className="levelup-to">Lv.{levelUpAnimation.toLevel}</span>
            </div>
          </div>
        </div>
      )}

      {/* ── ACHIEVEMENT TOAST ── */}
      {achievementToast && (
        <div className="achievement-toast">
          <span className="achievement-toast-icon">{achievementToast.icon}</span>
          <div className="achievement-toast-content">
            <p className="achievement-toast-title">Achievement Unlocked!</p>
            <p className="achievement-toast-name">{achievementToast.name}</p>
            <p className="achievement-toast-label">{achievementToast.label}</p>
          </div>
          <span className="achievement-toast-xp">+{achievementToast.xp} XP</span>
        </div>
      )}

        {/* ── TIP MODAL ── */}
        {renderTipModal()}
        {/* ── SUBSTITUTION MODAL ── */}
        {renderSubModal()}

      {/* ── THEME TOGGLE + workout timer ── */}
      <div className="top-right-cluster">
        {currentScreen === 'workout' && workoutStartTime && <span className="timer-inline">⏱️ {formatTime(elapsedTime)}</span>}
        <button className="theme-toggle-btn" onClick={() => setDarkMode(prev => !prev)} aria-label="Toggle light/dark mode">{darkMode ? '☀️' : '🌙'}</button>
      </div>

      {/* ── BOTTOM NAV ── */}
      {isMainTab && (
        <div className="bottom-nav">
          <button className={`bottom-nav-btn ${currentScreen === 'home' ? 'bottom-nav-btn-active' : ''}`} onClick={() => setCurrentScreen('home')}><span className="bottom-nav-icon">🏠</span><span className="bottom-nav-label">Home</span></button>
          <button className={`bottom-nav-btn ${currentScreen === 'volume' ? 'bottom-nav-btn-active' : ''}`} onClick={() => setCurrentScreen('volume')}><span className="bottom-nav-icon">💪</span><span className="bottom-nav-label">Volume</span></button>
          <button className={`bottom-nav-btn ${currentScreen === 'progress' ? 'bottom-nav-btn-active' : ''}`} onClick={() => setCurrentScreen('progress')}><span className="bottom-nav-icon">📊</span><span className="bottom-nav-label">Progress</span></button>
          <button className={`bottom-nav-btn ${currentScreen === 'history' ? 'bottom-nav-btn-active' : ''}`} onClick={() => setCurrentScreen('history')}><span className="bottom-nav-icon">📅</span><span className="bottom-nav-label">History</span></button>
          <button className={`bottom-nav-btn ${currentScreen === 'profile' ? 'bottom-nav-btn-active' : ''}`} onClick={() => setCurrentScreen('profile')}><span className="bottom-nav-icon">👤</span><span className="bottom-nav-label">Profile</span></button>
        </div>
      )}

      {/* ── MODALS ── */}
      {showMuscleGroupPicker && (
        <div className="modal-overlay" style={{ zIndex: 400 }}><div className="modal">
          <h2>📂 Muscle Group</h2>
          <p className="subtitle" style={{ textAlign: 'center' }}>Which muscle group is <strong style={{ color: 'var(--text-primary)' }}>"{pendingCustomExercise}"</strong>?</p>
          <div className="muscle-picker-grid">{Object.keys(DEFAULT_EXERCISE_CATALOGUE).map(group => <button key={group} className="muscle-picker-btn" onClick={() => handleMuscleGroupChosen(group)}><span>{MUSCLE_GROUP_ICONS[group]}</span><span>{group}</span></button>)}</div>
          <button className="cancel-btn" onClick={() => { _addExerciseToProgram(pendingCustomExercise, pendingFromWorkout); setShowMuscleGroupPicker(false); setPendingCustomExercise(''); setPendingFromWorkout(false); }}>Skip & Add Without Saving</button>
        </div></div>
      )}

      {showDetailedMusclePicker && pendingMuscleGroup && (
        <div className="modal-overlay" style={{ zIndex: 400 }}><div className="modal detailed-muscle-modal">
          <h2>🎯 Specific Muscle</h2>
          <p className="subtitle" style={{ textAlign: 'center' }}>Which muscle does <strong style={{ color: 'var(--text-primary)' }}>"{pendingCustomExercise}"</strong> primarily target?</p>
          <div className="detailed-muscle-list">
            {(DETAILED_MUSCLES_BY_GROUP[pendingMuscleGroup] || []).map(muscle => {
              const helper = DETAILED_MUSCLE_HELPER[muscle]; const isExpanded = expandedMuscleInfo === muscle;
              return <div key={muscle} className="detailed-muscle-item"><div className="detailed-muscle-item-top"><button className="detailed-muscle-btn" onClick={() => handleDetailedMuscleChosen(muscle)}><span className="detailed-muscle-icon">{DETAILED_MUSCLE_ICONS[muscle]}</span><span className="detailed-muscle-name">{muscle}</span></button>{helper && <button className="muscle-info-toggle" onClick={() => setExpandedMuscleInfo(isExpanded ? null : muscle)}>{isExpanded ? '▲' : '?'}</button>}</div>{isExpanded && helper && <div className="muscle-helper-box"><p className="muscle-helper-desc">{helper.description}</p><p className="muscle-helper-tip">💡 {helper.tip}</p><div className="muscle-helper-examples"><span className="muscle-helper-label">Examples: </span>{helper.tipExercises.map((ex, i) => <span key={i} className="muscle-helper-pill">{ex}</span>)}</div></div>}</div>;
            })}
          </div>
          <button className="cancel-btn" onClick={handleSkipDetailedMuscle}>Skip — don't track detailed muscle</button>
        </div></div>
      )}

      {showCustomExerciseManager && (
        <div className="modal-overlay" style={{ zIndex: 300 }}><div className="modal catalogue-modal">
          <h2>🗂️ Custom Exercises</h2>
          {(() => { const allCustom = getAllCustomExercises(); if (allCustom.length === 0) return <div className="groups-empty"><p className="empty-text">No custom exercises yet.</p></div>; const missing = allCustom.filter(e => !e.detailedMuscle); return <>{missing.length > 0 && <div className="custom-manager-warning"><span>⚠️</span><span>{missing.length} exercise{missing.length > 1 ? 's are' : ' is'} missing a detailed muscle — tap to fix</span></div>}<div className="catalogue-list">{allCustom.map(exercise => <div key={exercise.name} className="custom-manager-item" onClick={() => handleOpenEditCustomExercise(exercise)}><div className="custom-manager-item-left"><div className="custom-manager-item-name-row"><span className="custom-manager-item-name">{exercise.name}</span>{!exercise.detailedMuscle && <span className="custom-manager-missing-tag">⚠️ missing</span>}</div><div className="custom-manager-item-tags"><span className="custom-manager-group-tag">{MUSCLE_GROUP_ICONS[exercise.muscleGroup]} {exercise.muscleGroup}</span>{exercise.detailedMuscle && <span className="custom-manager-detailed-tag">{DETAILED_MUSCLE_ICONS[exercise.detailedMuscle]} {exercise.detailedMuscle}</span>}</div></div><span className="custom-manager-edit-icon">✏️</span></div>)}</div></>; })()}
          <button className="cancel-btn" onClick={() => setShowCustomExerciseManager(false)}>Close</button>
        </div></div>
      )}

      {editingCustomExercise && (
        <div className="modal-overlay" style={{ zIndex: 350 }}><div className="modal detailed-muscle-modal">
          <h2>✏️ Edit Custom Exercise</h2>
          <div className="edit-custom-section"><p className="edit-custom-label">Exercise Name</p><input className="input" type="text" value={editCustomName} onChange={e => setEditCustomName(e.target.value)} placeholder="Exercise name..." /></div>
          <div className="edit-custom-section"><p className="edit-custom-label">Muscle Group</p><div className="muscle-picker-grid">{Object.keys(DEFAULT_EXERCISE_CATALOGUE).map(group => <button key={group} className={`muscle-picker-btn ${editCustomMuscleGroup === group ? 'muscle-picker-btn-active' : ''}`} onClick={() => { setEditCustomMuscleGroup(group); setEditCustomDetailedMuscle(''); setEditMuscleInfoExpanded(null); }}><span>{MUSCLE_GROUP_ICONS[group]}</span><span>{group}</span></button>)}</div></div>
          {editCustomMuscleGroup && (DETAILED_MUSCLES_BY_GROUP[editCustomMuscleGroup] || []).length > 1 && <div className="edit-custom-section"><p className="edit-custom-label">Specific Muscle</p><div className="detailed-muscle-list">{(DETAILED_MUSCLES_BY_GROUP[editCustomMuscleGroup] || []).map(muscle => { const helper = DETAILED_MUSCLE_HELPER[muscle]; const isExpanded = editMuscleInfoExpanded === muscle; const isSelected = editCustomDetailedMuscle === muscle; return <div key={muscle} className="detailed-muscle-item"><div className="detailed-muscle-item-top"><button className={`detailed-muscle-btn ${isSelected ? 'detailed-muscle-btn-selected' : ''}`} onClick={() => setEditCustomDetailedMuscle(isSelected ? '' : muscle)}><span className="detailed-muscle-icon">{DETAILED_MUSCLE_ICONS[muscle]}</span><span className="detailed-muscle-name">{muscle}</span>{isSelected && <span className="detailed-muscle-check">✓</span>}</button>{helper && <button className="muscle-info-toggle" onClick={() => setEditMuscleInfoExpanded(isExpanded ? null : muscle)}>{isExpanded ? '▲' : '?'}</button>}</div>{isExpanded && helper && <div className="muscle-helper-box"><p className="muscle-helper-desc">{helper.description}</p><p className="muscle-helper-tip">💡 {helper.tip}</p><div className="muscle-helper-examples"><span className="muscle-helper-label">Examples: </span>{helper.tipExercises.map((ex, i) => <span key={i} className="muscle-helper-pill">{ex}</span>)}</div></div>}</div>; })}</div></div>}
          <div className="modal-buttons"><button className="create-btn" onClick={handleSaveCustomExercise} disabled={!editCustomName.trim() || !editCustomMuscleGroup}>✅ Save Changes</button><button className="danger-btn" onClick={() => handleDeleteCustomExercise(editingCustomExercise)}>🗑️ Delete Exercise</button><button className="cancel-btn" onClick={() => setEditingCustomExercise(null)}>Cancel</button></div>
        </div></div>
      )}

      {showFinishWorkoutModal && (
        <div className="modal-overlay"><div className="modal">
          <div className="delete-modal-icon">🏁</div><h2>Finish Workout?</h2>
          {(() => {
            const currentExercises = programs[selectedProgram]?.exercises.filter(ex => !ex.removedThisSession && !ex.workoutOnly) || [];
            const incompleteSets = currentExercises.reduce((count, exercise) => { const exerciseId = String(exercise.id); const completed = completedSets[exerciseId]?.length || 0; return count + Math.max(0, exercise.sets - completed); }, 0);
            const totalCompletedSets = Object.values(completedSets).reduce((a, b) => a + (Array.isArray(b) ? b.length : 0), 0);
            const alltimePRs = Object.values(setPRStatuses).filter(s => s === 'alltime').length;
            return (<>{incompleteSets > 0 ? <p className="delete-modal-text">You still have <strong style={{ color: 'var(--text-primary)' }}>{incompleteSets} set{incompleteSets > 1 ? 's' : ''}</strong> unfinished.</p> : <p className="delete-modal-text">All sets complete! Great workout 💪</p>}<div className="finish-workout-stats"><div className="finish-workout-stat"><span className="finish-workout-stat-value">{doneExercises.length}</span><span className="finish-workout-stat-label">/ {currentExercises.length} exercises</span></div><div className="finish-workout-stat"><span className="finish-workout-stat-value">{totalCompletedSets}</span><span className="finish-workout-stat-label">sets done</span></div>{alltimePRs > 0 && <div className="finish-workout-stat"><span className="finish-workout-stat-value" style={{ color: '#c9a84c' }}>{alltimePRs}</span><span className="finish-workout-stat-label">all-time PRs</span></div>}</div></>);
          })()}
          <div className="modal-buttons"><button className="start-btn" onClick={() => { setShowFinishWorkoutModal(false); finishWorkout(); }}>✅ Yes, Finish Workout</button><button className="cancel-btn" onClick={() => setShowFinishWorkoutModal(false)}>Keep Going</button></div>
        </div></div>
      )}

      {showDeleteProgramModal && programToDelete !== null && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">🗑️</div><h2>Delete Program</h2><p className="delete-modal-text">Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{programs[programToDelete]?.name}</strong>?</p><p className="delete-modal-subtext">Your workout history and PRs will not be affected.</p><div className="modal-buttons"><button className="danger-btn" onClick={handleConfirmDeleteProgram}>🗑️ Yes, Delete Program</button><button className="cancel-btn" onClick={handleCancelDeleteProgram}>Cancel</button></div></div></div>}
      {showRemoveExerciseModal && exerciseToRemove !== null && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">🗑️</div><h2>Remove Exercise</h2><p className="delete-modal-text">Remove <strong style={{ color: 'var(--text-primary)' }}>{exerciseToRemove.name}</strong> from this program?</p><div className="modal-buttons"><button className="danger-btn" onClick={handleConfirmRemoveProgramExercise}>🗑️ Yes, Remove</button><button className="cancel-btn" onClick={handleCancelRemoveProgramExercise}>Cancel</button></div></div></div>}
      {showRenameModal && exerciseToRename !== null && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">✏️</div><h2>Rename Exercise</h2><input className="input" type="text" value={renameText} onChange={(e) => setRenameText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleConfirmRename()} placeholder="Exercise name..." autoFocus /><div className="modal-buttons"><button className="create-btn" onClick={handleConfirmRename} disabled={!renameText.trim()}>✏️ Rename</button><button className="cancel-btn" onClick={handleCancelRename}>Cancel</button></div></div></div>}
      {showRemoveWorkoutModal && exerciseToRemoveFromWorkout !== null && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">🗑️</div><h2>Remove Exercise</h2><p className="delete-modal-text">Remove <strong style={{ color: 'var(--text-primary)' }}>{exerciseToRemoveFromWorkout.name}</strong>?</p><div className="modal-buttons"><button className="cancel-btn" onClick={handleRemoveWorkoutExerciseSessionOnly}>⚡ This Session Only</button><button className="danger-btn" onClick={handleRemoveWorkoutExerciseFromProgram}>🗑️ Remove from Program</button><button className="cancel-btn" onClick={handleCancelRemoveWorkoutExercise}>Cancel</button></div></div></div>}
      {showSaveToProgram && pendingWorkoutExercise !== null && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">➕</div><h2>Save to Program?</h2><p className="delete-modal-text">Do you want to add <strong style={{ color: 'var(--text-primary)' }}>{pendingWorkoutExercise.name}</strong> permanently?</p><div className="modal-buttons"><button className="start-btn" onClick={handleSaveExerciseToProgram}>✅ Yes, Add to Program</button><button className="cancel-btn" onClick={handleDiscardExerciseFromProgram}>⚡ This Session Only</button></div></div></div>}
      {showPlateCalc && renderPlateCalcModal()}
      {showImportLinkModal && (
          <div className="modal-overlay"><div className="modal">
            <div className="delete-modal-icon">🔗</div><h2>Import from Link</h2>
            <p className="delete-modal-subtext">Paste a program share link below. Your friend can copy it from their app using the 🔗 button on any program.</p>
            <input className="input" type="text" placeholder="Paste share link here..." value={importLinkText} onChange={(e) => { setImportLinkText(e.target.value); setImportLinkError(''); }} autoFocus />
            {importLinkError && <p style={{ color: 'var(--accent-red)', fontSize: '0.82rem', textAlign: 'center' }}>{importLinkError}</p>}
            <div className="modal-buttons">
              <button className="start-btn" onClick={handleImportFromLink} disabled={!importLinkText.trim()}>📥 Import Program</button>
              <button className="cancel-btn" onClick={() => { setShowImportLinkModal(false); setImportLinkText(''); setImportLinkError(''); }}>Cancel</button>
            </div>
          </div></div>
        )}
        {showSubGuideModal && subGuideExercises.length > 0 && (
          <div className="modal-overlay" style={{ zIndex: 400 }}>
            <div className="modal">
              <div style={{ textAlign: 'center', fontSize: '2rem', marginBottom: '-4px' }}>🏋️</div>
              <h2 style={{ textAlign: 'center' }}>Equipment Required</h2>
              <p className="delete-modal-subtext" style={{ textAlign: 'center' }}>
                This program contains exercises that require specific equipment. If you don't have access, you can swap them out using the <strong style={{ color: 'var(--accent-red)' }}>🔄</strong> button on any exercise.
              </p>
              <div className="sub-guide-list">
                {subGuideExercises.map((ex, i) => {
                  const sub = EXERCISE_SUBSTITUTIONS[ex.name];
                  return (
                    <div key={i} className="sub-guide-item">
                      <div className="sub-guide-item-left">
                        <p className="sub-guide-item-name">{ex.name}</p>
                        <p className="sub-guide-item-reason">⚠️ {sub.reason}</p>
                      </div>
                      <button
                        className="sub-guide-swap-btn"
                        onClick={() => {
                          setShowSubGuideModal(false);
                          setSubExercise(ex);
                          setShowSubModal(true);
                        }}
                      >
                        🔄 Swap
                      </button>
                    </div>
                  );
                })}
              </div>
              <p className="subtitle" style={{ textAlign: 'center', fontSize: '0.75rem' }}>
                You can also swap exercises at any time using the 🔄 button on each exercise card.
              </p>
              <button className="start-btn" onClick={() => setShowSubGuideModal(false)}>Got it — I have the equipment</button>
              <button className="cancel-btn" onClick={() => setShowSubGuideModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showJoinGroupModal && joinGroupTarget && (
          <div className="modal-overlay" style={{ zIndex: 400 }}>
            <div className="modal">
              <div className="delete-modal-icon">⊕</div>
              <h2>Add to Group</h2>
              {joinGroupTarget.mode === 'pick' ? (
                <>
                  <p className="delete-modal-subtext">Join an existing superset or create a new group</p>
                  <div className="join-group-list">
                    {joinGroupTarget.existingGroups.map(group => (
                      <button
                        key={group.groupId}
                        className="join-group-item"
                        onClick={() => setJoinGroupTarget(prev => ({ ...prev, selectedGroupId: group.groupId, mode: 'confirm' }))}
                      >
                        <span className="join-group-item-name">{group.groupName}</span>
                        <span className="join-group-item-count">{group.memberCount} exercises</span>
                      </button>
                    ))}
                  </div>
                  <button className="cancel-btn" style={{ marginTop: '4px' }} onClick={() => {
                    setShowJoinGroupModal(false);
                    setJoinGroupTarget(null);
                    setGroupingSourceId(joinGroupTarget.exerciseId);
                    setGroupingSelectedIds([joinGroupTarget.exerciseId]);
                  }}>＋ Create New Group Instead</button>
                  <button className="cancel-btn" onClick={() => { setShowJoinGroupModal(false); setJoinGroupTarget(null); }}>Cancel</button>
                </>
              ) : (
                <>
                  <p className="delete-modal-text">Add this exercise to the <strong style={{ color: 'var(--text-primary)' }}>{joinGroupTarget.existingGroups.find(g => g.groupId === joinGroupTarget.selectedGroupId)?.groupName}</strong> superset.</p>
                  <div className="modal-buttons">
                    <button className="cancel-btn" onClick={() => handleConfirmJoinGroup(joinGroupTarget.selectedGroupId, true)}>⚡ This Session Only</button>
                    <button className="start-btn" onClick={() => handleConfirmJoinGroup(joinGroupTarget.selectedGroupId, false)}>💾 Update Program Too</button>
                    <button className="cancel-btn" onClick={() => setJoinGroupTarget(prev => ({ ...prev, mode: 'pick' }))}>← Back</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      {showSyncSetupModal && (
        <div className="modal-overlay" style={{ zIndex: 500 }}>
          <div className="modal">
            <div className="delete-modal-icon">{syncModalMode === 'restore' ? '🔄' : '🔐'}</div>

            {/* ── RESTORE MODE ── */}
            {syncModalMode === 'restore' && (
              <>
                <h2>Restore with PIN</h2>
                <p className="delete-modal-subtext">Enter the PIN you used when you first set up sync on your other device.</p>
                <input
                  className="input"
                  type="password"
                  placeholder="Enter your PIN"
                  value={syncPinInput}
                  onChange={e => { setSyncPinInput(e.target.value); setSyncPinError(''); }}
                  onKeyDown={e => e.key === 'Enter' && handleRestoreWithPin(syncPinInput)}
                  autoFocus
                />
                {syncPinError && <p style={{ color: 'var(--accent-red)', fontSize: '0.82rem', textAlign: 'center' }}>{syncPinError}</p>}
                <div className="modal-buttons">
                  <button className="start-btn" onClick={() => handleRestoreWithPin(syncPinInput)} disabled={syncPinInput.trim().length < 4}>
                    🔄 Restore My Data
                  </button>
                  <button className="cancel-btn" onClick={() => { setShowSyncSetupModal(false); setSyncPinInput(''); setSyncPinError(''); }}>Cancel</button>
                </div>
              </>
            )}

            {/* ── CREATE MODE ── */}
            {syncModalMode === 'create' && (
              <>
                <h2>{syncSetupStep === 'create' ? 'Create Sync PIN' : 'Confirm PIN'}</h2>
                {syncSetupStep === 'create' ? (
                  <><p className="delete-modal-subtext">Choose a PIN to sync across devices. Write it down — you need it to restore.</p>
                  <input className="input" type="password" placeholder="Enter a PIN (min 4 characters)" value={syncPinInput} onChange={e => { setSyncPinInput(e.target.value); setSyncPinError(''); }} onKeyDown={e => e.key === 'Enter' && handleCreateSyncPin()} autoFocus /></>
                ) : (
                  <><p className="delete-modal-subtext">Enter your PIN again to confirm.</p>
                  <input className="input" type="password" placeholder="Confirm your PIN" value={syncPinConfirm} onChange={e => { setSyncPinConfirm(e.target.value); setSyncPinError(''); }} onKeyDown={e => e.key === 'Enter' && handleCreateSyncPin()} autoFocus /></>
                )}
                {syncPinError && <p style={{ color: 'var(--accent-red)', fontSize: '0.82rem', textAlign: 'center' }}>{syncPinError}</p>}
                <div className="modal-buttons">
                  <button className="start-btn" onClick={handleCreateSyncPin}>{syncSetupStep === 'create' ? 'Next →' : '✅ Create & Sync'}</button>
                  {syncSetupStep === 'confirm' && <button className="cancel-btn" onClick={() => { setSyncSetupStep('create'); setSyncPinConfirm(''); setSyncPinError(''); }}>← Back</button>}
                  <button className="cancel-btn" onClick={() => { setShowSyncSetupModal(false); setSyncPinInput(''); setSyncPinConfirm(''); setSyncSetupStep('create'); setSyncPinError(''); }}>Cancel</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

        {showSyncRestoreModal && syncRestoreData && (
          <div className="modal-overlay" style={{ zIndex: 500 }}>
            <div className="modal">
              <div className="delete-modal-icon">☁️</div>
              <h2>Restore from Cloud</h2>
              <p className="delete-modal-text">Backup found from <strong style={{ color: 'var(--text-primary)' }}>{syncRestoreData.updatedAt ? new Date(syncRestoreData.updatedAt).toLocaleDateString() + ' at ' + new Date(syncRestoreData.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'unknown date'}</strong></p>
              <p className="delete-modal-subtext">This will replace all your current data. This cannot be undone.</p>
              <div className="drive-restore-preview">
                <div className="drive-restore-stat"><span className="drive-restore-stat-value">{syncRestoreData.programs?.length || 0}</span><span className="drive-restore-stat-label">Programs</span></div>
                <div className="drive-restore-stat"><span className="drive-restore-stat-value">{syncRestoreData.workoutHistory?.length || 0}</span><span className="drive-restore-stat-label">Workouts</span></div>
                <div className="drive-restore-stat"><span className="drive-restore-stat-value">{Object.keys(syncRestoreData.globalPRHistory || {}).length}</span><span className="drive-restore-stat-label">Exercises w/ PRs</span></div>
              </div>
              <div className="modal-buttons">
                <button className="start-btn" onClick={confirmSyncRestore}>✅ Yes, Restore My Data</button>
                <button className="cancel-btn" onClick={() => { setShowSyncRestoreModal(false); setSyncRestoreData(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Restore with PIN modal */}
        {syncRestoreStatus === 'loading' && (
          <div className="modal-overlay" style={{ zIndex: 500 }}>
            <div className="modal" style={{ textAlign: 'center', gap: '16px' }}>
              <div className="delete-modal-icon">⏳</div>
              <h2>Finding your backup...</h2>
              <p className="delete-modal-subtext">Connecting to cloud storage</p>
            </div>
          </div>
        )}

        {showUngroupModal && ungroupTarget && (
          <div className="modal-overlay" style={{ zIndex: 400 }}>
            <div className="modal">
              <div className="delete-modal-icon">⊕</div>
              <h2>{ungroupTarget.type === 'all' ? 'Ungroup All' : 'Remove from Group'}</h2>
              <p className="delete-modal-text">
                {ungroupTarget.type === 'all'
                  ? 'Split all exercises in this superset back into individual cards.'
                  : 'Remove this exercise from the superset.'}
              </p>
              <div className="modal-buttons">
                <button className="cancel-btn" onClick={() => handleConfirmUngroup(true)}>⚡ This Session Only</button>
                <button className="danger-btn" onClick={() => handleConfirmUngroup(false)}>💾 Update Program Too</button>
                <button className="cancel-btn" onClick={() => { setShowUngroupModal(false); setUngroupTarget(null); }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
        {showCancelWorkoutModal && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">⚠️</div><h2>Cancel Workout?</h2><p className="delete-modal-text">Are you sure? All progress will be lost.</p><div className="modal-buttons"><button className="danger-btn" onClick={() => { setShowCancelWorkoutModal(false); goHome(); }}>Yes, Cancel Workout</button><button className="cancel-btn" onClick={() => setShowCancelWorkoutModal(false)}>Keep Going</button></div></div></div>}

        {showWeeklyPlanModal && weeklyPlanTag && (
          <div className="modal-overlay" style={{ zIndex: 350 }}>
            <div className="modal catalogue-modal">
              <h2>🗓️ Weekly Plan</h2>
              <p className="subtitle" style={{ textAlign: 'center' }}>{weeklyPlanTag} — choose how many days per week you train</p>
              <div className="weekly-plan-day-picker">
                {(weeklyPlanTag === 'PPL' ? [3, 4, 5, 6] : [2, 3, 4, 5, 6]).map(d => (
                  <button key={d} className={`weekly-plan-day-btn ${weeklyPlanDays === d ? 'weekly-plan-day-btn-active' : ''}`} onClick={() => setWeeklyPlanDays(d)}>{d} days</button>
                ))}
              </div>
              <div className="catalogue-list" style={{ maxHeight: '360px' }}>
                {(() => {
                  const matchingPlans = HOME_WEEKLY_PLANS.filter(p => p.tag === weeklyPlanTag && p.days === weeklyPlanDays);
                  if (matchingPlans.length === 0) return <p className="empty-text" style={{ padding: '20px 0' }}>No plan available for {weeklyPlanDays} days with {weeklyPlanTag}</p>;
                  return matchingPlans.map(plan => {
                    const alreadyAdded = isPlanAlreadyAdded(plan);
                    return (
                      <div key={plan.id} className="weekly-plan-card">
                        <div className="weekly-plan-card-header">
                          <div><p className="weekly-plan-card-title">{plan.label}</p><p className="weekly-plan-card-desc">{plan.description}</p></div>
                          <button className={`catalogue-add-btn ${alreadyAdded ? 'catalogue-added-btn' : ''}`} onClick={() => !alreadyAdded && handleAddWeeklyPlan(plan)} disabled={alreadyAdded}>{alreadyAdded ? '✓ Added' : '+ Add All'}</button>
                        </div>
                        {plan.note && <div className="weekly-plan-note">{plan.note}</div>}
                        <div className="weekly-plan-programs">
                          {plan.programs.map((templateId, idx) => {
                            const template = PROGRAM_TEMPLATES.find(t => t.id === templateId); if (!template) return null;
                            return (
                              <div key={idx} className="weekly-plan-program-row">
                                <span className="weekly-plan-day-label">{plan.dayLabels?.[idx] || `Day ${idx + 1}`}</span>
                                <span className="weekly-plan-program-name">{template.type === 'mobility' ? '🧘 ' : ''}{template.label}</span>
                                <span className="weekly-plan-program-count">{template.exercises.length} ex</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
              <button className="cancel-btn" onClick={() => setShowWeeklyPlanModal(false)}>Close</button>
            </div>
          </div>
        )}
        {showTemplateModal && (
          <div className="modal-overlay"><div className="modal catalogue-modal">
            <h2>📋 Program Templates</h2>
            <div className="template-tabs">
              {[
                { id: 'all', label: 'All' },
                { id: 'gym', label: '🏋️ Gym' },
                { id: 'bodyweight', label: '🤸 BW' },
                { id: 'dumbbells', label: '💪 DB' },
                { id: 'mobility', label: '🧘 Mobility' },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`template-tab-btn ${templateTab === tab.id ? 'template-tab-active' : ''}`}
                  onClick={() => setTemplateTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="catalogue-list" style={{ maxHeight: '380px' }}>
              {(() => {
                const filterTag = (tag) => {
                  if (templateTab === 'all') return true;
                  if (templateTab === 'gym') return ['PPL', 'Upper/Lower', 'Full Body', 'Specialisation'].includes(tag);
                  if (templateTab === 'bodyweight') return tag === 'Home (Bodyweight)';
                  if (templateTab === 'dumbbells') return tag === 'Home (Dumbbells)';
                  if (templateTab === 'mobility') return tag === 'Mobility';
                  return true;
                };
                const visibleGroups = TEMPLATE_GROUPS.filter(filterTag);
                if (visibleGroups.length === 0) return <p className="empty-text" style={{ padding: '20px 0' }}>No templates in this category</p>;
                return visibleGroups.map(tag => (
                  <div key={tag}>
                    <div className="template-group-header">
                      <p className="catalogue-group-label" style={{ margin: 0 }}>{tag}</p>
                      {(tag === 'Home (Bodyweight)' || tag === 'Home (Dumbbells)' || tag === 'PPL' || tag === 'Upper/Lower' || tag === 'Full Body') && (
                        <button className="weekly-plan-trigger-btn" onClick={() => {
                          setWeeklyPlanTag(tag);
                          setWeeklyPlanDays(tag === 'PPL' ? 6 : tag === 'Upper/Lower' ? 4 : tag === 'Full Body' ? 3 : 3);
                          setShowWeeklyPlanModal(true);
                        }}>🗓️ Weekly Plan</button>
                      )}
                    </div>
                    {PROGRAM_TEMPLATES.filter(t => t.tag === tag).map(template => {
                      const alreadyAdded = programs.some(p => p.name === template.label);
                      return (
                        <div key={template.id} className="template-item">
                          <div className="template-item-left">
                            <p className="template-item-name">{template.type === 'mobility' ? '🧘 ' : ''}{template.label}</p>
                            <p className="template-item-desc">{template.description}</p>
                            <p className="template-item-count">{template.exercises.length} exercises{template.subTag ? ` · ${template.subTag}` : ''}</p>
                          </div>
                          <button className={`catalogue-add-btn ${alreadyAdded ? 'catalogue-added-btn' : ''}`} onClick={() => !alreadyAdded && handleAddTemplate(template)} disabled={alreadyAdded}>{alreadyAdded ? '✓ Added' : '+ Add'}</button>
                        </div>
                      );
                    })}
                  </div>
                ));
              })()}
            </div>
            <button className="cancel-btn" onClick={() => { setShowTemplateModal(false); setTemplateTab('all'); }}>Close</button>
          </div></div>
        )}

      {showRepeatWorkoutModal && workoutToRepeat && (
        <div className="modal-overlay"><div className="modal">
          <div className="delete-modal-icon">🔄</div><h2>Repeat Workout?</h2>
          <p className="delete-modal-text">Repeat <strong style={{ color: 'var(--text-primary)' }}>{workoutToRepeat.programName}</strong> from {workoutToRepeat.date}?</p>
          <p className="delete-modal-subtext">Last session's weights will be pre-filled as a starting point.</p>
          <div className="modal-buttons">
            <button className="start-btn" onClick={() => handleConfirmRepeatWorkout(true)}>➕ Add to Programs & Start</button>
            <button className="cancel-btn" onClick={() => handleConfirmRepeatWorkout(false)}>⚡ This Session Only</button>
            <button className="cancel-btn" onClick={() => { setShowRepeatWorkoutModal(false); setWorkoutToRepeat(null); }}>Cancel</button>
          </div>
        </div></div>
      )}

      {showImportProgramModal && importProgramData && (
        <div className="modal-overlay"><div className="modal">
          <div className="delete-modal-icon">📥</div><h2>Import Program</h2>
          <p className="delete-modal-text"><strong style={{ color: 'var(--text-primary)' }}>{importProgramData.name}</strong></p>
          <p className="delete-modal-subtext">{importProgramData.type === 'mobility' ? '🧘 Mobility program · ' : ''}{importProgramData.exercises.length} exercises</p>
          <div className="import-program-exercise-list">{importProgramData.exercises.slice(0, 6).map((ex, i) => <div key={i} className="import-program-exercise-item"><span>{ex.name}</span><span className="import-program-exercise-sets">{ex.sets} sets</span></div>)}{importProgramData.exercises.length > 6 && <p className="subtitle" style={{ textAlign: 'center', marginTop: '6px' }}>+{importProgramData.exercises.length - 6} more exercises</p>}</div>
          <div className="modal-buttons">
            <button className="start-btn" onClick={() => { setPrograms(prev => [...prev, { ...importProgramData, exercises: importProgramData.exercises.map(ex => ({ ...ex, id: generateId() })) }]); setShowImportProgramModal(false); setImportProgramData(null); }}>✅ Import Program</button>
            <button className="cancel-btn" onClick={() => { setShowImportProgramModal(false); setImportProgramData(null); }}>Cancel</button>
          </div>
        </div></div>
      )}

      {/* ══ HOME ══ */}
      {currentScreen === 'home' && (
        <div style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', paddingTop: '44px' }}>
          <h1 className="title">💪 Workout Tracker</h1>
          <div className="home-xp-bar">
            <div className="home-xp-top-row">
              <div className="home-xp-left">
                <span className="home-xp-level">Lv.{levelInfo.level}</span>
                <div>
                  <p className="home-xp-title">{levelInfo.title}</p>
                  <p className="home-xp-xp-text">{animatedXP.toLocaleString()} XP total</p>
                </div>
              </div>
              {getCurrentStreak() > 0 && (
                <div className="home-xp-streak">
                  <span className="home-xp-streak-icon">🔥</span>
                  <span className="home-xp-streak-count">{getCurrentStreak()}</span>
                  <span className="home-xp-streak-label">week streak</span>
                </div>
              )}
            </div>
            <div className="home-xp-bar-thick-bg">
              <div
                className="home-xp-bar-thick-fill"
                style={{
                  width: `${barOverride !== null ? barOverride : animatedLevelInfo.progress}%`,
                  transition: barOverride === 0 ? 'none' : barOverride === 100 ? 'width 0.4s ease' : 'none',
                }}
              >
                <span className="home-xp-bar-pct-label">
                  {barOverride !== null ? `${Math.round(barOverride)}%` : `${Math.round(animatedLevelInfo.progress)}%`}
                </span>
              </div>
            </div>
            {levelInfo.nextLevel && (
              <div className="home-xp-next-row">
                <span className="home-xp-next-text">{(levelInfo.nextLevel.xp - animatedXP).toLocaleString()} XP to {levelInfo.nextLevel.title}</span>
                <span className="home-xp-next-text">{levelInfo.nextLevel.xp.toLocaleString()} XP</span>
              </div>
            )}
          </div>
          {deloadWeek && (
            <div className="deload-banner">
              <span className="deload-banner-icon">😴</span>
              <div>
                <p className="deload-banner-title">Deload Week Active</p>
                <p className="deload-banner-sub">Volume targets are halved. Focus on recovery.</p>
              </div>
            </div>
          )}
          {(() => {
            const recovery = getMuscleRecovery();
            const statusEmoji = (s) => s === 'green' ? '🟢' : s === 'yellow' ? '🟡' : '🔴';
            const statusLabel = (s, hoursAgo) => {
              if (s === 'red') return `${Math.round(hoursAgo)}h ago`;
              if (s === 'yellow') return `${Math.round(hoursAgo)}h ago`;
              if (hoursAgo === null) return 'Never trained';
              return `${Math.round(hoursAgo)}h ago`;
            };
            const parentGroups = {};
            Object.entries(recovery).forEach(([muscle, data]) => {
              const parent = DETAILED_MUSCLE_GROUPS[muscle]?.parent;
              if (!parent) return;
              if (!parentGroups[parent]) parentGroups[parent] = [];
              parentGroups[parent].push({ muscle, ...data });
            });
            return (
              <div className="recovery-card">
                <div className="recovery-card-header" onClick={() => setExpandedBalanceSection(p => !p)}>
                  <p className="recovery-card-title">💪 Muscle Recovery</p>
                  <span className="expand-arrow">{expandedBalanceSection ? '▲' : '▼'}</span>
                </div>
                {expandedBalanceSection && (
                  <>
                    <div className="recovery-legend">
                      <span>🟢 Recovered (48h+)</span>
                      <span>🟡 Caution (24–48h)</span>
                      <span>🔴 Rest (&lt;24h)</span>
                    </div>
                    {Object.entries(parentGroups).map(([parent, muscles]) => (
                      <div key={parent} className="recovery-group">
                        <p className="recovery-group-label">{MUSCLE_GROUP_ICONS[parent]} {parent}</p>
                        <div className="recovery-muscle-grid">
                          {muscles.map(({ muscle, status, hoursAgo }) => (
                            <div key={muscle} className={`recovery-muscle-item recovery-muscle-${status}`}>
                              <span className="recovery-muscle-emoji">{statusEmoji(status)}</span>
                              <span className="recovery-muscle-name">{muscle}</span>
                              <span className="recovery-muscle-time">{statusLabel(status, hoursAgo)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            );
          })()}
          {/* Sync status banner — shows briefly after a sync */}
          {syncUserId && syncStatus === 'success' && (
            <div className="sync-success-banner">
              <span className="sync-success-icon">☁️</span>
              <p className="sync-success-text">Workout synced to cloud ✓</p>
            </div>
          )}
          {syncUserId && syncStatus === 'syncing' && (
            <div className="sync-syncing-banner">
              <span className="sync-syncing-icon">⏳</span>
              <p className="sync-syncing-text">Syncing to cloud...</p>
            </div>
          )}
          {syncUserId && syncStatus === 'error' && (
            <div className="sync-error-banner">
              <span className="sync-error-icon">❌</span>
              <div>
                <p className="sync-error-title">Sync failed</p>
                <p className="sync-error-sub">Tap to retry</p>
              </div>
              <button className="sync-error-btn" onClick={() => syncToSupabase(syncUserId)}>Retry</button>
            </div>
          )}
          {/* No sync set up reminder */}
          {!syncUserId && showExportReminder && (
            <div className="export-reminder-banner">
              <div className="export-reminder-left">
                <span className="export-reminder-icon">☁️</span>
                <div>
                  <p className="export-reminder-title">Your data is not backed up</p>
                  <p className="export-reminder-sub">It has been over 4 weeks with no backup. Enable cloud sync to protect your data automatically.</p>
                </div>
              </div>
              <div className="export-reminder-actions">
                <button className="export-reminder-btn" onClick={() => { setSyncSetupStep('create'); setSyncPinInput(''); setSyncPinError(''); setShowSyncSetupModal(true); }}>Enable Sync</button>
                <button className="export-reminder-dismiss" onClick={() => { setShowExportReminder(false); setLastExportDate(new Date(Date.now() - 3 * 7 * 24 * 60 * 60 * 1000).toISOString()); }}>Later</button>
              </div>
            </div>
          )}
          <div className="home-btn-row"><button className="create-btn" style={{ marginBottom: 0 }} onClick={() => setShowModal(true)}>+ Create Program</button><button className="template-btn" onClick={() => setShowTemplateModal(true)}>📋 Templates</button></div>
          <div className="program-list" style={{ marginTop: '16px' }}>
            {programs.length === 0 ? <p className="empty-text">No programs yet. Create one or pick a template!</p> : (
              <>
                {sortedProgramIndices.filter(i => favourites.includes(i)).length > 0 && (
                  <><p className="program-section-label">⭐ Favourites</p>
                  {sortedProgramIndices.filter(i => favourites.includes(i)).map(index => {
                    const lastSession = getProgramLastSession(programs[index].name);
                    const progType = programs[index].type || 'strength';
                    const status = getProgramRecoveryStatus(programs[index]);
                    const showRecovery = status === 'red' || status === 'yellow';
                    const recoveryEmoji = status === 'yellow' ? '🟡' : '🔴';
                    const recoveryLabel = status === 'yellow' ? 'Partial' : 'Rest needed';
                    const metaLine = [
                      `${programs[index].exercises.filter(e => !e.workoutOnly).length} exercises`,
                      lastSession ? (lastSession.days === 0 ? 'Today' : lastSession.days === 1 ? 'Yesterday' : `${lastSession.days}d ago`) : null,
                    ].filter(Boolean).join(' · ');
                    return (
                      <div key={index} className="program-card program-card-favourite"
                      onClick={() => openProgram(index)}
                    >
                      <div className="program-card-main">
                        <div className="program-card-info">
                          <h2>{progType === 'mobility' ? '🧘 ' : ''}{programs[index].name}</h2>
                          <div className="program-card-meta-row">
                            <p className="subtitle">{metaLine}</p>
                            {showRecovery && <span className={`program-recovery-tag program-recovery-${status}`}>{recoveryEmoji} {recoveryLabel}</span>}
                          </div>
                        </div>
                        <div className="program-card-right-actions">
                          <MuscleHeatmap program={programs[index]} customExercises={customExercises} customDetailedMuscles={customDetailedMuscles} />
                          <button className="program-menu-btn" onClick={(e) => { e.stopPropagation(); setProgramOptionsIndex(programOptionsIndex === index ? null : index); }}>···</button>
                        </div>
                      </div>
                      {programOptionsIndex === index && (
                        <div className="program-card-options" onClick={e => e.stopPropagation()}>
                          <button className="program-option-btn" onClick={(e) => { handleDuplicateProgram(e, index); setProgramOptionsIndex(null); }}>⧉ Duplicate</button>
                          <button className="program-option-btn" onClick={(e) => { e.stopPropagation(); handleShareProgram(index); setProgramOptionsIndex(null); }}>🔗 Share</button>
                          <button className="program-option-btn" onClick={(e) => { toggleFavourite(e, index); setProgramOptionsIndex(null); }}>⭐ Unfavourite</button>
                          <button className="program-option-btn program-option-danger" onClick={(e) => { handleDeleteProgramPress(e, index); setProgramOptionsIndex(null); }}>🗑️ Delete</button>
                        </div>
                      )}
                    </div>
                    );
                  })}
                  </>
                )}
                {sortedProgramIndices.filter(i => !favourites.includes(i)).length > 0 && <p className="program-section-label" style={{ marginTop: '12px' }}>All Programs</p>}
                {sortedProgramIndices.filter(i => !favourites.includes(i)).map(index => {
                  const lastSession = getProgramLastSession(programs[index].name);
                  const progType = programs[index].type || 'strength';
                  const status = getProgramRecoveryStatus(programs[index]);
                  const showRecovery = status === 'red' || status === 'yellow';
                  const recoveryEmoji = status === 'yellow' ? '🟡' : '🔴';
                  const recoveryLabel = status === 'yellow' ? 'Partial' : 'Rest needed';
                  const metaLine = [
                    `${programs[index].exercises.filter(e => !e.workoutOnly).length} exercises`,
                    lastSession ? (lastSession.days === 0 ? 'Today' : lastSession.days === 1 ? 'Yesterday' : `${lastSession.days}d ago`) : null,
                  ].filter(Boolean).join(' · ');
                  return (
                    <div key={index} className="program-card"
                    onClick={() => openProgram(index)}
                    >
                      <div className="program-card-main">
                        <div className="program-card-info">
                          <h2>{progType === 'mobility' ? '🧘 ' : ''}{programs[index].name}</h2>
                          <div className="program-card-meta-row">
                            <p className="subtitle">{metaLine}</p>
                            {showRecovery && <span className={`program-recovery-tag program-recovery-${status}`}>{recoveryEmoji} {recoveryLabel}</span>}
                          </div>
                        </div>
                        <div className="program-card-right-actions">
                          <MuscleHeatmap program={programs[index]} customExercises={customExercises} customDetailedMuscles={customDetailedMuscles} />
                          <button className="program-menu-btn" onClick={(e) => { e.stopPropagation(); setProgramOptionsIndex(programOptionsIndex === index ? null : index); }}>···</button>
                        </div>
                      </div>
                      {programOptionsIndex === index && (
                        <div className="program-card-options" onClick={e => e.stopPropagation()}>
                          <button className="program-option-btn" onClick={(e) => { handleDuplicateProgram(e, index); setProgramOptionsIndex(null); }}>⧉ Duplicate</button>
                          <button className="program-option-btn" onClick={(e) => { e.stopPropagation(); handleShareProgram(index); setProgramOptionsIndex(null); }}>🔗 Share</button>
                          <button className="program-option-btn" onClick={(e) => { toggleFavourite(e, index); setProgramOptionsIndex(null); }}>☆ Favourite</button>
                          <button className="program-option-btn program-option-danger" onClick={(e) => { handleDeleteProgramPress(e, index); setProgramOptionsIndex(null); }}>🗑️ Delete</button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
          {showModal && (
            <div className="modal-overlay"><div className="modal">
              <h2>Create New Program</h2>
              <input className="input" type="text" placeholder="Program name (e.g. Push Day)" value={newProgramName} onChange={(e) => setNewProgramName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleCreateProgram()} />
              <div className="program-type-selector"><p className="edit-custom-label">Program Type</p><div className="program-type-btns"><button className={`program-type-btn ${newProgramType === 'strength' ? 'program-type-btn-active' : ''}`} onClick={() => setNewProgramType('strength')}>🏋️ Strength</button><button className={`program-type-btn ${newProgramType === 'mobility' ? 'program-type-btn-active' : ''}`} onClick={() => setNewProgramType('mobility')}>🧘 Mobility</button></div></div>
              <div className="modal-buttons"><button className="create-btn" onClick={handleCreateProgram}>Create</button><button className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button></div>
            </div></div>
          )}
        </div>
      )}

      {/* ══ VOLUME ══ */}
      {currentScreen === 'volume' && (
        <div style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', paddingTop: '44px' }}>
          <div className="volume-title-row">
            <h1 className="title" style={{ marginBottom: 0 }}>💪 Weekly Volume</h1>
            <span className="volume-week-label-inline">{getWeekLabel()}</span>
          </div>
          <div className="volume-list">
            {Object.keys(musclesByParent).map(parent => {
              const muscles = musclesByParent[parent]; const parentTotal = parentVolume[parent] || 0; const parentTarget = muscles.reduce((a, m) => a + (adjustedTargets[m] || 6), 0); const parentPct = Math.min((parentTotal / parentTarget) * 100, 100); const parentComplete = parentTotal >= parentTarget; const isExpanded = expandedVolumeGroups[parent] === true;
              return (
                <div key={parent} className="volume-parent-card">
                  <div className="volume-parent-header volume-parent-header-clickable" onClick={() => toggleVolumeGroup(parent)}>
                    <div className="volume-card-title"><span className="volume-collapse-icon">{isExpanded ? '－' : '＋'}</span><span className="volume-icon">{MUSCLE_GROUP_ICONS[parent]}</span><span className="volume-parent-name">{parent}</span></div>
                    <div className="volume-card-right-compact">
                      <div className="volume-bar-bg-inline"><div className={`volume-bar-fill ${parentComplete ? 'volume-bar-complete' : ''}`} style={{ width: `${parentPct}%` }} /></div>
                      <span className={`volume-count ${parentComplete ? 'volume-count-complete' : ''}`}>{parentTotal}/{parentTarget}</span>
                      {parentComplete && <span className="volume-badge">✓</span>}
                    </div>
                  </div>
                  {isExpanded && <div style={{ height: '8px' }} />}
                  {isExpanded && <div className="volume-detailed-list">{muscles.map(muscle => { const done = detailedVolume[muscle] || 0; const target = adjustedTargets[muscle] || 6; const pct = Math.min((done / target) * 100, 100); const isComplete = done >= target; return <div key={muscle} className="volume-detail-row"><div className="volume-detail-header"><div className="volume-detail-title"><span className="volume-detail-icon">{DETAILED_MUSCLE_ICONS[muscle]}</span><span className="volume-detail-name">{muscle}</span></div><div className="volume-card-right"><span className={`volume-detail-count ${isComplete ? 'volume-count-complete' : ''}`}>{done} / {target}</span>{isComplete && <span className="volume-detail-badge">✓</span>}</div></div><div className="volume-detail-bar-bg"><div className={`volume-detail-bar-fill ${isComplete ? 'volume-bar-complete' : ''}`} style={{ width: `${pct}%` }} /></div></div>; })}</div>}
                </div>
              );
            })}
          </div>
          <div className="volume-section-card">
            <div className="volume-section-header" onClick={() => setExpandedBalanceSection(p => !p)}>
              <span className="volume-section-title">⚖️ Balance & Trends</span>
              <span className="expand-arrow">{expandedBalanceSection ? '▲' : '▼'}</span>
            </div>
            {expandedBalanceSection && (
              <>
                <div className="balance-trend-tabs">
                  <button className={`balance-trend-tab-btn ${balanceTrendTab === 'balance' ? 'balance-trend-tab-active' : ''}`} onClick={() => setBalanceTrendTab('balance')}>⚖️ Balance</button>
                  <button className={`balance-trend-tab-btn ${balanceTrendTab === 'trends' ? 'balance-trend-tab-active' : ''}`} onClick={() => setBalanceTrendTab('trends')}>📈 Trends</button>
                </div>
                {balanceTrendTab === 'balance' && (() => {
                  const balance = getMuscleBalance();
                  const statusEmoji = (s) => s === 'green' ? '🟢' : s === 'yellow' ? '🟡' : s === 'red' ? '🔴' : '⚪';
                  return (
                    <div className="balance-list">
                      <div className="balance-row"><div className="balance-row-left"><span className="balance-label">Push vs Pull</span><span className="balance-values">{balance.push} push sets · {balance.pull} pull sets</span></div><span style={{ fontSize: '1.2rem' }}>{statusEmoji(balance.pushPullStatus)}</span></div>
                      <div className="balance-row"><div className="balance-row-left"><span className="balance-label">Upper vs Lower</span><span className="balance-values">{balance.upper} upper sets · {balance.lower} lower sets</span></div><span style={{ fontSize: '1.2rem' }}>{statusEmoji(balance.upperLowerStatus)}</span></div>
                      <p className="subtitle" style={{ marginTop: '8px', fontSize: '0.72rem' }}>Push/Pull: 🟢 within 20% · 🟡 within 40% · 🔴 off by more than 40% — Upper/Lower: 🟢 legs ≥ 25% of upper · 🟡 legs ≥ 15% · 🔴 legs under 15%</p>
                    </div>
                  );
                })()}
                {balanceTrendTab === 'trends' && (() => {
                  const trendData = getVolumeTrendData(volumeTrendMuscle);
                  const isTrendCardio = volumeTrendMuscle === 'Cardio';
                  const activeWeeksData = trendData.filter(d => d.value > 0);
                  const peakAvg = Math.max(...trendData.map(d => d.value), 0);
                  const latestAvg = activeWeeksData.length > 0 ? activeWeeksData[activeWeeksData.length - 1].value : 0;
                  const firstAvg = activeWeeksData.length > 0 ? activeWeeksData[0].value : 0;
                  const progressPct = firstAvg > 0 ? Math.round(((latestAvg - firstAvg) / firstAvg) * 100) : 0;
                  return (
                    <div style={{ padding: '12px' }}>
                      <div className="muscle-group-filter" style={{ marginBottom: '12px' }}>
                        {Object.keys(MUSCLE_GROUP_ICONS).filter(g => g !== 'Other').map(group => (
                          <button key={group} className={`muscle-group-btn ${volumeTrendMuscle === group ? 'muscle-group-btn-active' : ''}`} onClick={() => setVolumeTrendMuscle(group)}>
                            {MUSCLE_GROUP_ICONS[group]} {group}
                          </button>
                        ))}
                      </div>
                      <p className="volume-summary-label" style={{ marginBottom: '8px' }}>{isTrendCardio ? 'Total km' : 'Avg kg per set'} — {volumeTrendMuscle} — last 8 weeks</p>
                      <VolumeBarChart data={trendData} darkMode={darkMode} />
                      <div className="trend-stats-row">
                        <div className="trend-stat"><span className="trend-stat-value" style={{ color: progressPct > 0 ? 'var(--accent-green)' : progressPct < 0 ? 'var(--accent-red)' : 'var(--text-secondary)' }}>{progressPct > 0 ? '+' : ''}{progressPct}%</span><span className="trend-stat-label">Progress</span></div>
                        <div className="trend-stat"><span className="trend-stat-value">{peakAvg}{isTrendCardio ? 'km' : 'kg'}</span><span className="trend-stat-label">Best Week</span></div>
                        <div className="trend-stat"><span className="trend-stat-value">{latestAvg}{isTrendCardio ? 'km' : 'kg'}</span><span className="trend-stat-label">Latest</span></div>
                      </div>
                    </div>
                  );
                })()}
              </>
            )}
          </div>
          <div className="volume-summary-card">
            <p className="volume-summary-title">Week Summary</p>
            <div className="volume-summary-row">
              <div className="volume-summary-stat"><p className="volume-summary-value">{Object.values(detailedVolume).reduce((a, b) => a + b, 0)}</p><p className="volume-summary-label">Total Sets</p></div>
              <div className="volume-summary-stat"><p className="volume-summary-value">{Object.entries(detailedVolume).filter(([, v]) => v >= 6).length} / {Object.keys(DETAILED_MUSCLE_GROUPS).length}</p><p className="volume-summary-label">Muscles Hit</p></div>
              <div className="volume-summary-stat"><p className="volume-summary-value">{workoutHistory.filter(w => new Date(w.dateTimestamp) >= getWeekStart()).length}</p><p className="volume-summary-label">Workouts</p></div>
            </div>
          </div>
        </div>
      )}

      {/* ══ PROGRESS ══ */}
      {currentScreen === 'progress' && (
        <div style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', paddingTop: '44px' }}>
          <h1 className="title">📊 Progress</h1>
          <input className="input" type="text" placeholder="🔍 Search exercises..." value={progressSearch} onChange={(e) => setProgressSearch(e.target.value)} style={{ marginBottom: '15px' }} />
          {(() => {
            const weeklyPRs = getWeeklyPRData();
            if (weeklyPRs.length === 0) return null;
            const totalPRs = weeklyPRs.reduce((a, w) => a + w.value, 0);
            const peakWeek = weeklyPRs.length > 0 ? weeklyPRs.reduce((best, w) => w.value > best.value ? w : best, weeklyPRs[0]) : null;
            const weeksWithPRs = weeklyPRs.filter(w => w.value > 0).length;
            const maxVal = Math.max(...weeklyPRs.map(w => w.value), 1);
            const reversedWeeks = [...weeklyPRs].reverse();
            return (
              <div className="volume-section-card" style={{ marginBottom: '16px' }}>
                <div className="volume-section-header" onClick={() => setExpandedTrendSection(p => !p)}>
                  <span className="volume-section-title">🏆 PRs Per Week</span>
                  <span className="expand-arrow">{expandedTrendSection ? '▲' : '▼'}</span>
                </div>
                {expandedTrendSection && (
                  <div style={{ padding: '8px 12px 16px 12px' }}>
                    <div className="trend-stats-row" style={{ marginBottom: '12px' }}>
                      <div className="trend-stat">
                        <span className="trend-stat-value">{totalPRs}</span>
                        <span className="trend-stat-label">Total PRs</span>
                      </div>
                      <div className="trend-stat">
                        <span className="trend-stat-value">{peakWeek?.value || 0}</span>
                        <span className="trend-stat-label">Best Week</span>
                      </div>
                      <div className="trend-stat">
                        <span className="trend-stat-value">{weeklyPRs.length}</span>
                        <span className="trend-stat-label">Wks Trained</span>
                      </div>
                      <div className="trend-stat">
                        <span className="trend-stat-value">{weeksWithPRs}</span>
                        <span className="trend-stat-label">Wks w/ PRs</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '400px', overflowY: 'auto', paddingRight: '2px' }}>
                      {reversedWeeks.map((week, i) => (
                        <div key={i} className="pr-week-row">
                          <span className="pr-week-label">{week.label}</span>
                          <div className="pr-week-bar-bg">
                            <div className="pr-week-bar-fill" style={{ width: `${(week.value / maxVal) * 100}%`, opacity: week.value === 0 ? 0.15 : 1 }} />
                          </div>
                          <span className="pr-week-count" style={{ color: week.value > 0 ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                            {week.value > 0 ? `${week.value} PR${week.value !== 1 ? 's' : ''}` : 'none'}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="subtitle" style={{ textAlign: 'center', fontSize: '0.72rem', marginTop: '8px' }}>All weeks you trained — most recent first</p>
                  </div>
                )}
              </div>
            );
          })()}
          {filteredPRData.length === 0 ? <div className="progress-empty"><p className="empty-text">No PR data yet.</p><p className="subtitle" style={{ textAlign: 'center', marginTop: '8px' }}>Complete a workout to start tracking your progress!</p></div> : (
            <div className="program-list">
              {(() => {
                const grouped = {};
                filteredPRData.forEach(exercise => {
                  const muscleGroup = findMuscleGroup(exercise.name, customExercises) || 'Other';
                  if (!grouped[muscleGroup]) grouped[muscleGroup] = [];
                  grouped[muscleGroup].push(exercise);
                });
                const groupOrder = ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core', 'Cardio', 'Other'];
                const sortedGroups = Object.keys(grouped).sort((a, b) => {
                  const ai = groupOrder.indexOf(a); const bi = groupOrder.indexOf(b);
                  return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                });
                return sortedGroups.map(group => (
                  <div key={group}>
                    <p className="progress-group-label-small">{MUSCLE_GROUP_ICONS[group] || '❓'} {group}</p>
                    {grouped[group].map((exercise) => {
                const isExpanded = expandedExercise === exercise.name; const latestPR = exercise.prHistory[exercise.prHistory.length - 1]; const firstPR = exercise.prHistory[0]; const totalGain = (latestPR.weight - firstPR.weight).toFixed(1); const totalRepsGain = (latestPR.reps || 0) - (firstPR.reps || 0);
                return (
                  <div key={exercise.name} className="progress-card">
                    <div className="progress-card-header" onClick={() => setExpandedExercise(isExpanded ? null : exercise.name)}>
                      {!isExpanded ? (
                        <div className="progress-card-header-compact">
                          <span className="progress-card-name-compact">{exercise.name}</span>
                          <div className="progress-card-summary-compact">
                            <span className="pr-text">🏆 {latestPR.weight}kg × {latestPR.reps}r</span>
                            <span className="expand-arrow">▼</span>
                          </div>
                        </div>
                      ) : (
                        <div className="progress-card-header-expanded">
                          <div className="progress-card-title"><h2>{exercise.name}</h2><p className="subtitle">{exercise.program}</p></div>
                          <div className="progress-card-summary"><p className="pr-text">🏆 {latestPR.weight}kg</p><p className="subtitle">{exercise.prHistory.length} PR{exercise.prHistory.length > 1 ? 's' : ''}</p><span className="expand-arrow">▲</span></div>
                        </div>
                      )}
                    </div>
                    {isExpanded && (
                      <div className="progress-card-body">
                        <div className="progress-stats-row">
                          <div className="progress-stat"><p className="progress-stat-value">{exercise.prHistory.length}</p><p className="progress-stat-label">Total PRs</p></div>
                          <div className="progress-stat"><p className="progress-stat-value" style={{ color: totalGain >= 0 ? 'var(--accent-green)' : '#c0392b', fontSize: '0.95rem' }}>{totalGain >= 0 ? '+' : ''}{totalGain}kg{totalRepsGain !== 0 ? ` / ${totalRepsGain > 0 ? '+' : ''}${totalRepsGain}r` : ''}</p><p className="progress-stat-label">Total Gain</p></div>
                          <div className="progress-stat"><p className="progress-stat-value">{firstPR.weight}kg</p><p className="progress-stat-label">First PR</p></div>
                        </div>
                        <div className="pr-chart-section"><p className="progress-timeline-label">Progress Chart</p><PRLineChart data={exercise.prHistory} darkMode={darkMode} showReps={true} /></div>
                        <p className="progress-timeline-label" style={{ marginTop: '16px' }}>PR Timeline</p>
                        <div className="progress-timeline">
                          {exercise.prHistory.map((pr, index) => { const isLatest = index === exercise.prHistory.length - 1; const daysSinceLast = index > 0 ? daysBetween(exercise.prHistory[index - 1].date, pr.date) : null; return <div key={index} className="timeline-item"><div className="timeline-left"><div className={`timeline-dot ${isLatest ? 'timeline-dot-latest' : ''}`} />{index < exercise.prHistory.length - 1 && <div className="timeline-line" />}</div><div className="timeline-content"><div className="timeline-row"><span className={`timeline-weight ${isLatest ? 'timeline-weight-latest' : ''}`}>{isLatest && '🏆 '}{pr.weight}kg{pr.reps ? ` × ${pr.reps} reps` : ''}</span><span className="timeline-date">{pr.date}</span></div>                          {daysSinceLast !== null && !isNaN(daysSinceLast) && <p className="timeline-days">⏱️ {daysSinceLast} day{daysSinceLast !== 1 ? 's' : ''} since last PR</p>}</div></div>; })}
                        </div>
                        {(() => {
                          const bestPR = exercise.prHistory[exercise.prHistory.length - 1];
                          const oneRM = calculate1RM(bestPR.weight, bestPR.reps);
                          if (!oneRM) return null;
                          const table = getRepMaxTable(oneRM);
                          return (
                            <div className="orm-section">
                              <p className="progress-timeline-label" style={{ marginTop: '16px' }}>Estimated 1RM</p>
                              <div className="orm-result">
                                <span className="orm-value">{oneRM}kg</span>
                                <span className="orm-formula">Epley formula · {bestPR.weight}kg × {bestPR.reps} reps</span>
                              </div>
                              <p className="progress-timeline-label" style={{ marginTop: '12px' }}>Rep Max Table</p>
                              <div className="orm-table">
                                <div className="orm-table-header">
                                  <span className="orm-col">Reps</span>
                                  <span className="orm-col">% 1RM</span>
                                  <span className="orm-col">Weight</span>
                                </div>
                                {table.map((row, i) => (
                                  <div key={i} className={`orm-table-row ${row.reps === 1 ? 'orm-table-row-highlight' : ''}`}>
                                    <span className="orm-col">{row.reps}</span>
                                    <span className="orm-col orm-col-pct">{row.pct}%</span>
                                    <span className="orm-col orm-col-weight">{row.weight}kg</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                );
              })}
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  )}
  {/* ══ HISTORY ══ */}
      {currentScreen === 'history' && (
        <div style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', paddingTop: '44px' }}>
          <h1 className="title">📅 History</h1>
          <div className="history-tabs">
            <button className={`history-tab-btn ${historyTab === 'workouts' ? 'history-tab-active' : ''}`} onClick={() => setHistoryTab('workouts')}>Workouts</button>
            <button className={`history-tab-btn ${historyTab === 'balance' ? 'history-tab-active' : ''}`} onClick={() => setHistoryTab('balance')}>Balance</button>
          </div>
          {historyTab === 'workouts' && (workoutHistory.length === 0 ? <div className="progress-empty"><p className="empty-text">No workouts logged yet.</p><p className="subtitle" style={{ textAlign: 'center', marginTop: '8px' }}>Complete a workout to see it here!</p></div> : (
            <div className="program-list">
              {workoutHistory.map((workout) => {
                const isExpanded = expandedWorkout === workout.id; const totalSets = workout.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
                return (
                  <div key={workout.id} className="history-card">
                    <div className="history-card-header" onClick={() => setExpandedWorkout(isExpanded ? null : workout.id)}>
                    <div className="history-card-left">
                        <div className="history-card-title-row">
                          <p className="history-program-name">{(workout.programType || 'strength') === 'mobility' ? '🧘 ' : ''}{workout.programName}</p>
                          <span className="history-date-inline">{workout.date}</span>
                        </div>
                        <div className="history-meta"><span className="history-meta-item">⏱️ {formatTime(workout.duration)}</span>{workout.totalWeight > 0 && <span className="history-meta-item">🏋️ {workout.totalWeight.toLocaleString()}kg</span>}<span className="history-meta-item">✅ {totalSets} sets · {workout.exercises.length} exercises</span></div>
                      </div>
                      <div className="history-card-right-compact">
                        <button className="repeat-workout-btn" onClick={(e) => { e.stopPropagation(); handleRepeatWorkout(workout); }}>🔄</button>
                        <span className="expand-arrow">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="history-card-body">
                        {workout.exercises.map((exercise, exIndex) => (
                          <div key={exIndex} className="history-exercise">
                            <div className="history-exercise-header">
                              <p className="history-exercise-name">{exercise.name}</p>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '3px' }}>
                                {exercise.muscleGroup && exercise.muscleGroup !== 'Mobility' && <span className="history-muscle-tag">{MUSCLE_GROUP_ICONS[exercise.muscleGroup]} {exercise.muscleGroup}</span>}
                                {exercise.type === 'mobility' && <span className="history-muscle-tag">🧘 Mobility</span>}
                                {exercise.type === 'cardio' && <span className="history-muscle-tag">🏃 Cardio</span>}
                              </div>
                            </div>
                            <div className="history-sets-table">
                              <div className="history-sets-header"><span className="history-set-col">Set</span>{exercise.type === 'cardio' ? <><span className="history-set-col">km</span><span className="history-set-col">min</span><span className="history-set-col">Pace</span></> : exercise.type === 'mobility' ? <><span className="history-set-col">Duration</span><span className="history-set-col"></span><span className="history-set-col"></span></> : <><span className="history-set-col">Weight</span><span className="history-set-col">Reps</span><span className="history-set-col">Volume</span></>}</div>
                              {exercise.sets.map((set, setIndex) => <div key={setIndex} className="history-set-row"><span className="history-set-col history-set-num">{setIndex + 1}</span>{exercise.type === 'cardio' ? <><span className="history-set-col">{set.distance}km</span><span className="history-set-col">{set.duration}min</span><span className="history-set-col history-set-volume">{formatPace(parseFloat(set.distance), parseFloat(set.duration)) || '—'}</span></> : exercise.type === 'mobility' ? <><span className="history-set-col">{set.duration || 30}s</span><span className="history-set-col"></span><span className="history-set-col"></span></> : <><span className="history-set-col">{set.weight}kg</span><span className="history-set-col">{set.reps}</span><span className="history-set-col history-set-volume">{(parseFloat(set.weight) * parseInt(set.reps)).toFixed(0)}kg</span></>}</div>)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
          {historyTab === 'balance' && (() => {
            const balanceHistory = getWeeklyBalanceHistory();
            const statusEmoji = (s) => s === 'green' ? '🟢' : s === 'yellow' ? '🟡' : s === 'red' ? '🔴' : '⚪';
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <p className="subtitle" style={{ textAlign: 'center', marginBottom: '4px' }}>Push/pull and upper/lower balance — last 12 weeks</p>
                {balanceHistory.filter(w => w.hasData).length === 0 && <div className="progress-empty"><p className="empty-text">No balance data yet.</p><p className="subtitle" style={{ textAlign: 'center', marginTop: '8px' }}>Complete some workouts to see your balance history!</p></div>}
                {balanceHistory.filter(w => w.hasData).map((week, i) => (
                  <div key={i} className="balance-history-card">
                    <div className="balance-history-header">
                      <span className="balance-history-label">{week.label}</span>
                    </div>
                    <div className="balance-history-rows">
                      <div className="balance-history-row">
                        <span className="balance-history-type">Push vs Pull</span>
                        <span className="balance-history-values">{week.push} push · {week.pull} pull</span>
                        <span className="balance-history-status">{statusEmoji(week.pushPullStatus)}</span>
                      </div>
                      <div className="balance-history-row">
                        <span className="balance-history-type">Upper vs Lower</span>
                        <span className="balance-history-values">{week.upper} upper · {week.lower} lower</span>
                        <span className="balance-history-status">{statusEmoji(week.upperLowerStatus)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                <p className="subtitle" style={{ textAlign: 'center', fontSize: '0.72rem', marginTop: '4px' }}>🟢 Balanced · 🟡 Slight imbalance · 🔴 Significant imbalance</p>
              </div>
            );
          })()}
        </div>
      )}
      {/* ══ PROFILE ══ */}
      {currentScreen === 'profile' && (
        <div style={{ paddingBottom: 'calc(70px + env(safe-area-inset-bottom))', paddingTop: '44px' }}>
          <h1 className="title">👤 Profile</h1>
          <div className="profile-unified-card">
            {/* Level Section */}
            <div className="profile-level-section">
              <div className="profile-level-header">
                <div className="profile-level-info">
                  <span className="profile-level-badge">Lv.{levelInfo.level}</span>
                  <div>
                    <p className="profile-level-title">{levelInfo.title}</p>
                    <p className="profile-level-xp">{animatedXP.toLocaleString()} XP total</p>
                  </div>
                </div>
                {getCurrentStreak() > 0 && (
                  <div className="profile-streak">
                    <span className="profile-streak-icon">🔥</span>
                    <span className="profile-streak-count">{getCurrentStreak()}</span>
                    <span className="profile-streak-label">week streak</span>
                  </div>
                )}
              </div>
              <div className="profile-xp-bar-bg-thick">
              <div
                className="profile-xp-bar-fill-thick"
                style={{
                  width: `${barOverride !== null ? barOverride : animatedLevelInfo.progress}%`,
                  transition: barOverride === 0 ? 'none' : barOverride === 100 ? 'width 0.4s ease' : 'none',
                }}
              >
                <span className="profile-xp-bar-label">
                  {barOverride !== null ? `${Math.round(barOverride)}%` : `${Math.round(animatedLevelInfo.progress)}%`}
                </span>
              </div>
            </div>
            {levelInfo.nextLevel && (
              <div className="profile-xp-next-row">
                <span className="profile-xp-next">{(levelInfo.nextLevel.xp - animatedXP).toLocaleString()} XP to {levelInfo.nextLevel.title}</span>
                <span className="profile-xp-next">{levelInfo.nextLevel.xp.toLocaleString()} XP</span>
              </div>
            )}
            </div>

            {/* Divider */}
            <div className="profile-section-divider" />

            {/* Stats Section */}
            <div className="profile-stats-section">
              <p className="profile-section-title">Lifetime Stats</p>
              <div className="profile-stats-grid">
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.totalWorkouts}</span><span className="profile-stat-label">Workouts</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.totalSets.toLocaleString()}</span><span className="profile-stat-label">Total Sets</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{(lifetimeStats.totalWeight / 1000).toFixed(1)}t</span><span className="profile-stat-label">Weight Lifted</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.totalPRs}</span><span className="profile-stat-label">Total PRs</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.avgDuration > 0 ? formatTime(lifetimeStats.avgDuration) : '—'}</span><span className="profile-stat-label">Avg Duration</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.longestStreak}w</span><span className="profile-stat-label">Best Streak</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.favouriteMuscle ? MUSCLE_GROUP_ICONS[lifetimeStats.favouriteMuscle] : '—'}</span><span className="profile-stat-label">{lifetimeStats.favouriteMuscle || 'No data'}</span></div>
                <div className="profile-stat-item"><span className="profile-stat-value">{lifetimeStats.totalProgramsCreated}</span><span className="profile-stat-label">Programs</span></div>
              </div>
            </div>

            {/* Divider */}
            <div className="profile-section-divider" />

            {/* Achievements Section */}
            <div className="profile-achievements-section">
              <div className="achievement-tab-header">
                <p className="profile-section-title" style={{ margin: 0 }}>Achievements</p>
                <div className="achievement-tabs">
                  <button className={`achievement-tab-btn ${profileTab === 'active' ? 'achievement-tab-active' : ''}`} onClick={() => setProfileTab('active')}>Active</button>
                  <button className={`achievement-tab-btn ${profileTab === 'completed' ? 'achievement-tab-active' : ''}`} onClick={() => setProfileTab('completed')}>Completed</button>
                </div>
              </div>
              {(() => {
                const achievements = computeAchievements(workoutHistory, globalPRHistory);
                const completedCount = achievements.filter(a => a.isFullyComplete).length;
                const completedTiersCount = achievements.reduce((a, ach) => a + ach.completedTiers, 0);
                const totalTiersCount = achievements.reduce((a, ach) => a + ach.tiers.length, 0);
                return (
                  <div className="achievement-summary-bar">
                    <div className="achievement-summary-progress-bg">
                      <div className="achievement-summary-progress-fill" style={{ width: `${(completedTiersCount / totalTiersCount) * 100}%` }} />
                    </div>
                    <span className="achievement-summary-text">{completedTiersCount} / {totalTiersCount} tiers · {completedCount} fully complete</span>
                  </div>
                );
              })()}
            {(() => {
              const achievements = computeAchievements(workoutHistory, globalPRHistory);
              const active = achievements.filter(a => !a.isFullyComplete);
              const completed = achievements.filter(a => a.isFullyComplete);
              if (profileTab === 'active') {
                return (
                  <div className="achievement-list">
                    {active.length === 0 ? <p className="empty-text" style={{ padding: '20px 0' }}>All achievements completed! 🏆</p> : (
                      active.map(ach => (
                        <div key={ach.id} className="achievement-item">
                          <div className="achievement-item-header">
                            <span className="achievement-item-icon">{ach.icon}</span>
                            <div className="achievement-item-info"><span className="achievement-item-name">{ach.name}</span><span className="achievement-item-goal">{ach.currentTier.label}</span></div>
                            <span className="achievement-item-xp">+{ach.currentTier.xp} XP</span>
                          </div>
                          <div className="achievement-progress-bar-bg"><div className="achievement-progress-bar-fill" style={{ width: `${ach.progress * 100}%` }} /></div>
                          <div className="achievement-progress-text"><span>{ach.value.toLocaleString()} / {ach.currentTier.goal.toLocaleString()}</span>{ach.completedTiers > 0 && <span className="achievement-tiers-done">Tier {ach.completedTiers} / {ach.tiers.length} complete</span>}</div>
                        </div>
                      ))
                    )}
                  </div>
                );
              }
              const activesWithCompletedTiers = achievements.filter(a => !a.isFullyComplete && a.completedTiers > 0);
              return (
                <div className="achievement-list">
                  {completed.length === 0 && activesWithCompletedTiers.length === 0 ? (
                    <p className="empty-text" style={{ padding: '20px 0' }}>No completed tiers yet — keep training!</p>
                  ) : (
                    <>
                      {completed.map(ach => (
                        <div key={ach.id} className="achievement-item achievement-item-completed">
                          <div className="achievement-item-header">
                            <span className="achievement-item-icon">{ach.icon}</span>
                            <div className="achievement-item-info"><span className="achievement-item-name">{ach.name}</span><span className="achievement-item-goal" style={{ color: 'var(--accent-gold)' }}>All {ach.tiers.length} tiers complete 🏆</span></div>
                            <span className="achievement-item-xp">+{ach.tiers.reduce((a, t) => a + t.xp, 0)} XP</span>
                          </div>
                          <div className="achievement-completed-tiers">
                            {ach.tiers.map((tier, i) => <div key={i} className="achievement-completed-tier-row"><span className="achievement-completed-tier-check">🏆</span><span className="achievement-completed-tier-label">{tier.label}</span><span className="achievement-completed-tier-xp">+{tier.xp} XP</span></div>)}
                          </div>
                        </div>
                      ))}
                      {activesWithCompletedTiers.map(ach => (
                        <div key={ach.id} className="achievement-item">
                          <div className="achievement-item-header">
                            <span className="achievement-item-icon">{ach.icon}</span>
                            <div className="achievement-item-info"><span className="achievement-item-name">{ach.name}</span><span className="achievement-tiers-done">{ach.completedTiers} / {ach.tiers.length} tiers complete</span></div>
                            <span className="achievement-item-xp">+{ach.tiers.slice(0, ach.completedTiers).reduce((a, t) => a + t.xp, 0)} XP</span>
                          </div>
                          <div className="achievement-completed-tiers">
                            {ach.tiers.slice(0, ach.completedTiers).map((tier, i) => <div key={i} className="achievement-completed-tier-row"><span className="achievement-completed-tier-check">🏆</span><span className="achievement-completed-tier-label">{tier.label}</span><span className="achievement-completed-tier-xp">+{tier.xp} XP</span></div>)}
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })()}
            </div>
          </div>
          <div style={{ marginTop: '20px', marginBottom: '20px' }}>
            <p className="settings-group-label">Settings</p>
            <div className="settings-list">
              {showClearModal && clearTarget && <div className="modal-overlay"><div className="modal"><div className="delete-modal-icon">{CLEAR_TARGETS[clearTarget].icon}</div><h2>{CLEAR_TARGETS[clearTarget].label}</h2><p className="delete-modal-text">Are you sure? This action <strong style={{ color: 'var(--text-primary)' }}>cannot be undone</strong>.</p><p className="delete-modal-subtext">{CLEAR_TARGETS[clearTarget].description}</p><div className="modal-buttons"><button className="danger-btn" onClick={handleConfirmClear}>{CLEAR_TARGETS[clearTarget].icon} {CLEAR_TARGETS[clearTarget].btnLabel}</button><button className="cancel-btn" onClick={handleCancelClear}>Cancel</button></div></div></div>}

              {/* Training */}
              <div className="settings-section-label-inline">Training</div>
              <div className="settings-row">
                <div className="settings-row-left"><span className="settings-row-icon">😴</span><div><p className="settings-row-title">Deload Week</p><p className="settings-row-sub">{deloadWeek ? 'Active — targets halved. Auto-expires Monday.' : 'Halve volume targets this week.'}</p></div></div>
                <button className={`deload-toggle-btn ${deloadWeek ? 'deload-toggle-btn-active' : ''}`} onClick={toggleDeloadWeek}>{deloadWeek ? 'Turn Off' : 'Turn On'}</button>
              </div>
              <div className="settings-row-divider" />

              {/* Programs */}
              <div className="settings-section-label-inline">Programs</div>
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🔗</span><div><p className="settings-row-title">Import from Link</p><p className="settings-row-sub">Paste a program share link from a friend</p></div></div><button className="settings-clear-btn settings-export-btn" onClick={() => { setShowImportLinkModal(true); setImportLinkText(''); setImportLinkError(''); }}>Import</button></div>
              <div className="settings-row-divider" />

              {/* Cloud Sync */}
              <div className="settings-section-label-inline">Cloud Sync</div>
              {!syncUserId ? (
                <>
                  <div className="settings-row">
                    <div className="settings-row-left">
                      <span className="settings-row-icon">☁️</span>
                      <div>
                        <p className="settings-row-title">Enable Cloud Sync</p>
                        <p className="settings-row-sub">Auto backup after every workout. Works on all devices including iOS home screen.</p>
                      </div>
                    </div>
                    <button className="settings-clear-btn settings-export-btn" onClick={() => { setSyncModalMode('create'); setSyncSetupStep('create'); setSyncPinInput(''); setSyncPinError(''); setShowSyncSetupModal(true); }}>Set Up</button>
                  </div>
                  <div className="settings-row-divider" />
                  <div className="settings-row">
                    <div className="settings-row-left">
                      <span className="settings-row-icon">🔄</span>
                      <div>
                        <p className="settings-row-title">Restore with PIN</p>
                        <p className="settings-row-sub">Already have a PIN from another device</p>
                      </div>
                    </div>
                    <button className="settings-clear-btn settings-export-btn" onClick={() => { setSyncModalMode('restore'); setSyncSetupStep('create'); setSyncPinInput(''); setSyncPinError(''); setShowSyncSetupModal(true); }}>Restore</button>
                  </div>
                </>
              ) : (
                <>
                  <div className="settings-row">
                    <div className="settings-row-left">
                      <span className="settings-row-icon">
                        {syncStatus === 'syncing' ? '⏳' : syncStatus === 'success' ? '✅' : syncStatus === 'error' ? '❌' : '☁️'}
                      </span>
                      <div>
                        <p className="settings-row-title">Cloud Sync Active</p>
                        <p className="settings-row-sub">
                          {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'success' ? 'Synced successfully!' : syncStatus === 'error' ? 'Sync failed — tap to retry' : lastSyncDate ? `Last sync: ${new Date(lastSyncDate).toLocaleDateString()} ${new Date(lastSyncDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Never synced'}
                        </p>
                      </div>
                    </div>
                    <button className="settings-clear-btn settings-export-btn" onClick={() => syncToSupabase(syncUserId)} disabled={syncStatus === 'syncing'}>
                      {syncStatus === 'syncing' ? '...' : 'Sync Now'}
                    </button>
                  </div>
                  <div className="settings-row-divider" />
                  <div className="settings-row">
                    <div className="settings-row-left">
                      <span className="settings-row-icon">📥</span>
                      <div>
                        <p className="settings-row-title">Restore from Cloud</p>
                        <p className="settings-row-sub">Download your latest cloud backup</p>
                      </div>
                    </div>
                    <button className="settings-clear-btn settings-export-btn" onClick={() => restoreFromSupabase(syncUserId)} disabled={syncRestoreStatus === 'loading'}>
                      {syncRestoreStatus === 'loading' ? '...' : 'Restore'}
                    </button>
                  </div>
                  <div className="settings-row-divider" />
                  <div className="settings-row">
                    <div className="settings-row-left">
                      <span className="settings-row-icon">🔌</span>
                      <div>
                        <p className="settings-row-title">Disconnect Sync</p>
                        <p className="settings-row-sub">Your data stays on this device and in the cloud</p>
                      </div>
                    </div>
                    <button className="settings-clear-btn" onClick={disconnectSync}>Disconnect</button>
                  </div>
                </>
              )}
              <div className="settings-row-divider" />

              {/* Backup */}
              <div className="settings-section-label-inline">Backup & Restore</div>
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">📤</span><div><p className="settings-row-title">Export Data</p><p className="settings-row-sub">Download backup file{lastExportDate && <span style={{ color: '#4a9e5c' }}> · Last: {new Date(lastExportDate).toLocaleDateString()}</span>}</p></div></div><button className="settings-clear-btn settings-export-btn" onClick={handleExportData}>Export</button></div>
              <div className="settings-row-divider" />
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">📥</span><div><p className="settings-row-title">Import Data</p><p className="settings-row-sub">Restore from backup{importSuccess && <span className="import-success"> ✓ Imported!</span>}{importError && <span className="import-error"> ✗ Invalid file</span>}</p></div></div><button className="settings-clear-btn settings-export-btn" onClick={() => importInputRef.current?.click()}>Import</button><input ref={importInputRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleImportData} /></div>
              <div className="settings-row-divider" />

              {/* Custom Exercises */}
              <div className="settings-section-label-inline">Exercises</div>
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🗂️</span><div><p className="settings-row-title">Manage Custom Exercises</p><p className="settings-row-sub">Edit name, muscle group or detailed muscle{(() => { const missing = getAllCustomExercises().filter(e => !e.detailedMuscle).length; return missing > 0 ? <span className="import-error"> · {missing} missing detail</span> : null; })()}</p></div></div><button className="settings-clear-btn settings-export-btn" onClick={() => setShowCustomExerciseManager(true)}>Manage</button></div>
              <div className="settings-row-divider" />

              {/* Onboarding */}
              <div className="settings-section-label-inline">Help</div>
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🎓</span><div><p className="settings-row-title">View Guided Tour</p><p className="settings-row-sub">Replay the welcome walkthrough</p></div></div><button className="settings-clear-btn settings-export-btn" onClick={() => { setOnboardingStep(0); setShowOnboarding(true); }}>Start</button></div>
              <div className="settings-row-divider" />

              {/* Feedback */}
              <div className="settings-section-label-inline">Feedback</div>
              <div className="settings-row feedback-row"><div className="settings-row-left"><span className="settings-row-icon">💬</span><div><p className="settings-row-title">Send Feedback</p><p className="settings-row-sub">Report a bug or request a feature</p></div></div></div>
              <div className="feedback-textarea-row"><textarea className="input feedback-textarea" rows={3} placeholder="Describe your request, bug, or idea..." value={feedbackText} onChange={e => setFeedbackText(e.target.value)} /><button className="feedback-send-btn" disabled={!feedbackText.trim()} onClick={() => { const subject = encodeURIComponent('Workout App Feedback'); const body = encodeURIComponent(feedbackText.trim()); window.open(`mailto:madsmorkenborg@gmail.com?subject=${subject}&body=${body}`); setFeedbackText(''); }}>📧 Send via Email</button></div>
              <div className="settings-row-divider" />

              {/* Data Management */}
              <div className="settings-section-label-inline">Data Management</div>
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🏆</span><div><p className="settings-row-title">PRs & Exercise History</p><p className="settings-row-sub">Reset all personal records and session logs</p></div></div><button className="settings-clear-btn" onClick={() => handleClearPress('prs')}>Clear</button></div>
              <div className="settings-row-divider" />
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">📅</span><div><p className="settings-row-title">Workout History</p><p className="settings-row-sub">Delete all logged workout sessions</p></div></div><button className="settings-clear-btn" onClick={() => handleClearPress('history')}>Clear</button></div>
              <div className="settings-row-divider" />
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">📝</span><div><p className="settings-row-title">Exercise Notes</p><p className="settings-row-sub">Remove all notes from every exercise</p></div></div><button className="settings-clear-btn" onClick={() => handleClearPress('notes')}>Clear</button></div>
              <div className="settings-row-divider" />
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🗂️</span><div><p className="settings-row-title">Custom Exercises</p><p className="settings-row-sub">Remove custom exercises from the catalogue</p></div></div><button className="settings-clear-btn" onClick={() => handleClearPress('custom')}>Clear</button></div>
              <div className="settings-row-divider" />
              <div className="settings-row"><div className="settings-row-left"><span className="settings-row-icon">🗑️</span><div><p className="settings-row-title" style={{ color: '#c0392b' }}>Delete All Data</p><p className="settings-row-sub">Permanently wipe everything from this app</p></div></div><button className="settings-clear-btn settings-clear-btn-danger" onClick={() => handleClearPress('all')}>Delete</button></div>
            </div>
          </div>
        </div>
      )}

      {/* ══ PROGRAM ══ */}
      {currentScreen === 'program' && selectedProgram !== null && (
        <div style={{ paddingTop: '44px' }}>
          <button className="back-btn" onClick={goHome}>← Back</button>
          <h1 className="title">{(programs[selectedProgram]?.type || 'strength') === 'mobility' ? '🧘 ' : ''}{programs[selectedProgram].name}</h1>
          <button className="start-btn" onClick={startWorkout}>▶ Start Workout</button>
          <button className="create-btn" onClick={() => setShowExerciseModal(true)}>+ Add Exercise</button>
          {groupingSourceId && (
            <div className="grouping-banner">
              <p className="grouping-banner-text">✅ Tap exercises to add them to the group ({groupingSelectedIds.length - 1} selected)</p>
              <div className="grouping-banner-btns"><button className="grouping-confirm-btn" onClick={handleConfirmGroup} disabled={groupingSelectedIds.length < 2}>✓ Confirm Group</button><button className="grouping-cancel-btn" onClick={handleCancelGrouping}>✕ Cancel</button></div>
            </div>
          )}
          <div className="program-list">
            {programs[selectedProgram].exercises.filter(e => !e.workoutOnly).length === 0 ? <p className="empty-text">No exercises yet. Add one!</p> : renderExercises(programs[selectedProgram].exercises.filter(e => !e.workoutOnly))}
          </div>
          {showExerciseModal && renderCatalogueModal(false)}
          {showNoteModal && noteExercise && <div className="modal-overlay"><div className="modal"><h2>📝 {noteExercise.name}</h2><textarea className="input note-input" placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} /><div className="modal-buttons"><button className="create-btn" onClick={handleSaveNote}>Save Note</button><button className="cancel-btn" onClick={() => setShowNoteModal(false)}>Cancel</button></div></div></div>}
        </div>
      )}

      {/* ══ WORKOUT ══ */}
      {currentScreen === 'workout' && selectedProgram !== null && (
        <div>
          <div className="workout-header">
            <button className="workout-cancel-btn-visible" onClick={() => { if (Object.keys(setLogs).length > 0) setShowCancelWorkoutModal(true); else goHome(); }}>✕ Cancel</button>
            <div className="workout-title-block"><h1 className="workout-title">{(programs[selectedProgram]?.type || 'strength') === 'mobility' ? '🧘 ' : ''}{programs[selectedProgram].name}</h1></div>
          </div>
          {isResting && <div className="rest-bar"><div className="rest-bar-content"><span className="rest-text">😴 {formatRestTime(restTime)}</span><div className="rest-progress-bg"><div className="rest-progress-fill" style={{ width: `${(restTime / restDuration) * 100}%` }} /></div><button className="skip-rest-btn" onClick={skipRest}>Skip</button></div></div>}
          {groupingSourceId && (
            <div className="grouping-banner">
              <p className="grouping-banner-text">✅ Tap exercises to add them to the group ({groupingSelectedIds.length - 1} selected)</p>
            </div>
          )}
          {groupingSourceId && (
            <div className="grouping-sticky-footer">
              <button className="grouping-confirm-btn" onClick={handleConfirmWorkoutGroup} disabled={groupingSelectedIds.length < 2}>✓ Confirm Group</button>
              <button className="grouping-cancel-btn" onClick={handleCancelGrouping}>✕ Cancel</button>
            </div>
          )}
          <div className="program-list" style={{ paddingBottom: '20px' }}>{renderWorkoutExercises(programs[selectedProgram].exercises)}</div>
          <div className="workout-bottom-actions">
            <button className="add-workout-exercise-btn" style={{ margin: 0 }} onClick={() => setShowWorkoutExerciseModal(true)}>+ Add Exercise</button>
            {(programs[selectedProgram]?.type || 'strength') === 'strength' && <button className="plate-calc-btn" style={{ margin: 0 }} onClick={() => setShowPlateCalc(true)}>🏋️ Plates</button>}
          </div>
          <button className="finish-btn" onClick={() => setShowFinishWorkoutModal(true)}>🏁 Finish Workout</button>
          {showWorkoutExerciseModal && renderCatalogueModal(true)}
          {showNoteModal && noteExercise && <div className="modal-overlay"><div className="modal"><h2>📝 {noteExercise.name}</h2><textarea className="input note-input" placeholder="Add a note..." value={noteText} onChange={(e) => setNoteText(e.target.value)} rows={4} /><div className="modal-buttons"><button className="create-btn" onClick={handleSaveNote}>Save Note</button><button className="cancel-btn" onClick={() => setShowNoteModal(false)}>Cancel</button></div></div></div>}
        </div>
      )}

      {/* ══ SUMMARY ══ */}
      {currentScreen === 'summary' && summaryData && (
        <div style={{ paddingTop: '44px', paddingBottom: '40px' }}>
          <div className="summary-share-card" ref={summaryCardRef}>
            <div className="summary-share-header">
              <div className="summary-share-logo">{summaryData.programType === 'mobility' ? '🧘' : '💪'}</div>
              <div><h2 className="summary-share-program">{summaryData.programName}</h2><p className="summary-share-date">{summaryData.date}</p></div>
            </div>
            <div className="summary-share-stats">
              <div className="summary-share-stat"><span className="summary-share-stat-icon">⏱️</span><span className="summary-share-stat-value">{formatTime(summaryData.duration)}</span><span className="summary-share-stat-label">Duration</span></div>
              <div className="summary-share-stat-divider" />
              {summaryData.totalWeight > 0 && <><div className="summary-share-stat"><span className="summary-share-stat-icon">🏋️</span><span className="summary-share-stat-value">{summaryData.totalWeight.toLocaleString()}kg</span><span className="summary-share-stat-label">Volume</span></div><div className="summary-share-stat-divider" /></>}
              <div className="summary-share-stat"><span className="summary-share-stat-icon">✅</span><span className="summary-share-stat-value">{summaryData.totalSets}</span><span className="summary-share-stat-label">Sets</span></div>
            </div>
            {summaryData.prCount > 0 && <div className="summary-share-prs"><p className="summary-share-prs-title">🏆 New Personal Records</p><div className="summary-share-prs-list">{summaryData.alltimePRNames.map((name, i) => <span key={i} className="summary-share-pr-pill">{name}</span>)}</div></div>}
            <div className="summary-share-exercises">
              <p className="summary-share-section-label">Exercises</p>
              {summaryData.exercises.map((ex, i) => { const bestSet = ex.type === 'cardio' ? null : ex.sets.reduce((best, s) => (parseFloat(s.weight) || 0) > (parseFloat(best?.weight) || 0) ? s : best, ex.sets[0]); return <div key={i} className="summary-share-exercise-row"><div className="summary-share-exercise-left"><span className="summary-share-exercise-name">{ex.type === 'mobility' ? '🧘 ' : ex.type === 'cardio' ? '🏃 ' : ''}{ex.name}</span>{ex.muscleGroup && ex.muscleGroup !== 'Mobility' && <span className="summary-share-muscle-tag">{MUSCLE_GROUP_ICONS[ex.muscleGroup]} {ex.muscleGroup}</span>}</div><div className="summary-share-exercise-right"><span className="summary-share-exercise-sets">{ex.sets.length} sets</span>{bestSet && ex.type !== 'cardio' && ex.type !== 'mobility' && <span className="summary-share-exercise-best">{bestSet.weight}kg × {bestSet.reps}</span>}{ex.type === 'cardio' && ex.sets[0] && <span className="summary-share-exercise-best">{ex.sets[0].distance}km</span>}</div></div>; })}
            </div>
            <div className="summary-share-footer"><span>💪 Workout Tracker</span></div>
          </div>
          {syncUserId && (
            <div className={`summary-sync-status ${syncStatus === 'success' ? 'summary-sync-success' : syncStatus === 'error' ? 'summary-sync-error' : 'summary-sync-syncing'}`}>
              <span>{syncStatus === 'success' ? '☁️ ✓ Synced to cloud' : syncStatus === 'error' ? '❌ Sync failed — go to Profile to retry' : '⏳ Syncing to cloud...'}</span>
            </div>
          )}
          <button className="summary-share-btn" onClick={handleShareSummary}>📤 Share Workout</button>
          <button className="start-btn" onClick={goHome} style={{ marginTop: '10px' }}>🏠 Back to Home</button>
        </div>
      )}
      </>}
    </div>
  );
}
export default App;
