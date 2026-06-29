"use client";

import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  Settings as SettingsIcon,
  LogOut,
  Vibrate,
  Volume2,
  Shield,
  ShieldCheck,
  Timer,
  Ruler,
  Flame,
  Dumbbell,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Trophy,
  ShoppingBag,
  Home,
  Calendar,
  CheckCircle2,
  Circle,
  Zap,
  Crown,
  Sparkles,
  Lock,
  BarChart2,
  Target,
  Activity,
  Info,
  Bell,
  MoveHorizontal,
  RotateCcw,
  Swords
} from 'lucide-react';

// --- AVATAR CUSTOMIZATION PRESETS ---
const AVATAR_ICONS: Record<string, any> = { Crown, Swords, Shield, Flame, Zap, Dumbbell, Target, Trophy };
const AVATAR_EMOJIS = ['💪', '🔥', '🏋️', '🥷', '⚡', '🦾', '🎯', '💎'];
const RANDOM_NAMES = [
  'IronWolf', 'SteelPhoenix', 'ShadowGrappler', 'CrimsonTitan', 'NightForge',
  'VoidStriker', 'StormAnvil', 'EmberKnight', 'GraniteFist', 'RogueSentinel'
];
const GRADIENT_PRESETS: Record<string, string> = {
  roseViolet: 'from-rose-500 to-purple-600',
  skyBlue: 'from-cyan-400 to-blue-600',
  goldAmber: 'from-yellow-400 to-orange-600',
  emerald: 'from-emerald-400 to-teal-600',
};
const SOLID_PRESETS: Record<string, string> = {
  rose: '#f43f5e',
  blue: '#3b82f6',
  emerald: '#10b981',
  amber: '#f59e0b',
  purple: '#a855f7',
  slate: '#64748b',
};

function AvatarGlyph({ config, size = 20 }: { config: { type: string; icon: string; emoji: string; colorMode: string; gradient: string; solidColor: string }; size?: number }) {
  const bgClass = config.colorMode === 'gradient' ? `bg-gradient-to-br ${GRADIENT_PRESETS[config.gradient] || GRADIENT_PRESETS.roseViolet}` : '';
  const bgStyle = config.colorMode === 'solid' ? { backgroundColor: SOLID_PRESETS[config.solidColor] || SOLID_PRESETS.rose } : {};
  const IconComp = AVATAR_ICONS[config.icon] || Crown;
  return (
    <div className={`w-full h-full rounded-full flex items-center justify-center ${bgClass}`} style={bgStyle}>
      {config.type === 'emoji' ? (
        <span style={{ fontSize: size, lineHeight: 1 }}>{config.emoji}</span>
      ) : (
        <IconComp size={size} className="text-white" />
      )}
    </div>
  );
}

// --- DATA MOVED OUTSIDE COMPONENT ---
// Static data that doesn't change can live outside to make the app faster
const leaderboardData = [
  { rank: 1, name: "Vanguard_Overlord", xp: "142,050", streak: 120, avatarColor: "from-yellow-400 to-amber-600", isMe: false, title: "Overlord", statsVisible: true, achievement: "Iron Will — 120 Day Unbroken Streak", power: 92, time: 88, discipline: 95, weekPattern: [70, 85, 60, 95, 100, 80, 90] },
  { rank: 2, name: "SleeperBuildPro", xp: "128,400", streak: 84, avatarColor: "from-purple-500 to-indigo-600", isMe: false, title: "Sleeper Build", statsVisible: true, achievement: "Diamond Push-Up Mastery", power: 80, time: 75, discipline: 85, weekPattern: [60, 70, 90, 50, 80, 95, 70] },
  { rank: 3, name: "CalisthenicsKing", xp: "115,900", streak: 56, avatarColor: "from-cyan-400 to-blue-600", isMe: false, title: "Calisthenics King", statsVisible: true, achievement: "Hollow Body Specialist", power: 70, time: 65, discipline: 78, weekPattern: [50, 60, 70, 65, 80, 55, 75] },
  { rank: 4, name: "You", xp: "98,350", streak: 28, avatarColor: "from-rose-500 to-purple-600", isMe: true, title: "Overlord", statsVisible: true, achievement: "8-Year Pushup Mastery", power: 0, time: 0, discipline: 0, weekPattern: [] },
  { rank: 5, name: "HollowBodyWarrior", xp: "84,100", streak: 19, avatarColor: "from-emerald-400 to-teal-600", isMe: false, title: "Rising Star", statsVisible: false, achievement: "Most Improved Warrior", power: 55, time: 60, discipline: 50, weekPattern: [40, 55, 30, 60, 45, 50, 35] },
];

const shopItems = [
  { id: 'item_1', name: 'Streak Freeze Matrix', price: 150, desc: 'Prevents streak loss if you miss an active training window.', icon: Flame, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  { id: 'item_2', name: 'Cybernetic Avatar Border', price: 250, desc: 'Equip a neon animated halo glow around your profile token.', icon: Sparkles, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
  { id: 'item_3', name: 'Shadow Overlord Aura', price: 500, desc: 'Unlocks custom visual design profiles across community ranking feeds.', icon: Crown, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
];

type AppView = 'welcome' | 'login' | 'onboarding' | 'dashboard';
type Tab = 'home' | 'calendar' | 'workouts' | 'profile' | 'settings' | 'about' | 'leaderboard' | 'shop';

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`w-11 h-6 rounded-full relative transition-colors shrink-0 ${
        checked ? 'bg-gradient-to-r from-rose-500 to-purple-600' : 'bg-gray-700'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

function RingStat({ pct, radius, color }: { pct: number; radius: number; color: string }) {
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(Math.max(pct, 0), 100) / 100);
  return (
    <circle
      cx="18" cy="18" r={radius}
      fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      style={{ transition: 'stroke-dashoffset 0.6s ease-out' }}
    />
  );
}

export default function FullFitnessTracker() {
  // Navigation States
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showResetModal, setShowResetModal] = useState(false);
  
  // App States
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [expandedProfile, setExpandedProfile] = useState<number | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currency, setCurrency] = useState<number>(350);
  const [purchasedItems, setPurchasedItems] = useState<string[]>(['item_2']);
  const [selectedDay, setSelectedDay] = useState<number | null>(27);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [workoutSets, setWorkoutSets] = useState<{ [key: number]: boolean[] }>({});

  const [settings, setSettings] = useState({
    vibration: true,
    sound: true,
    autoRestTimer: true,
    dailyReminder: true,
    streakAlerts: true,
    leaderboardVisible: true,
    units: 'kg' as 'kg' | 'lb',
  });

  const [age, setAge] = useState<string>('22');
  const [weight, setWeight] = useState<string>('70');
  const [maxPushups, setMaxPushups] = useState<number>(20);
  const [experience, setExperience] = useState<string>('advanced');
  const [userName, setUserName] = useState<string>('');

  const [avatarConfig, setAvatarConfig] = useState({
    type: 'icon' as 'icon' | 'emoji',
    icon: 'Crown',
    emoji: '💪',
    colorMode: 'gradient' as 'gradient' | 'solid',
    gradient: 'roseViolet',
    solidColor: 'rose',
  });

  // LOAD SAVED PROGRESS
  useEffect(() => {
    try {
      const saved = localStorage.getItem('fittrack_save');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.currentView) setCurrentView(data.currentView);
        if (data.authMode) setAuthMode(data.authMode);
        if (data.activeTab) setActiveTab(data.activeTab);
        if (typeof data.currency === 'number') setCurrency(data.currency);
        if (Array.isArray(data.purchasedItems)) setPurchasedItems(data.purchasedItems);
        if (data.workoutSets) setWorkoutSets(data.workoutSets);
        if (data.settings) setSettings((s) => ({ ...s, ...data.settings }));
        if (data.age) setAge(data.age);
        if (data.weight) setWeight(data.weight);
        if (typeof data.maxPushups === 'number') setMaxPushups(data.maxPushups);
        if (data.experience) setExperience(data.experience);
        if (data.avatarConfig) setAvatarConfig((a) => ({ ...a, ...data.avatarConfig }));
        if (typeof data.userName === 'string') setUserName(data.userName);
      }
    } catch (e) {
      console.error('Could not load saved progress', e);
    }
    setIsLoaded(true);
  }, []);

  // SAVE PROGRESS
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem('fittrack_save', JSON.stringify({
        currentView, authMode, activeTab, currency, purchasedItems, workoutSets,
        settings, age, weight, maxPushups, experience, avatarConfig, userName
      }));
    } catch (e) {
      console.error('Could not save progress', e);
    }
  }, [isLoaded, currentView, authMode, activeTab, currency, purchasedItems, workoutSets, settings, age, weight, maxPushups, experience, avatarConfig, userName]);

  // RESET BUTTON CONFIRMATION
  const resetProgress = () => {
  // Instead of window.confirm, we just show the modal
  setShowResetModal(true);
};

  // Reset scroll position whenever the active tab changes — otherwise the shared
  // scroll container keeps its old scrollTop and the new tab renders mid-scroll.
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [activeTab]);

  const nextOnboardingStep = () => {
    if (onboardingStep === 1 && userName.trim() === '') {
      setUserName(RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)]);
    }
    if (onboardingStep < 4) {
      setOnboardingStep(onboardingStep + 1);
    } else {
      setCurrentView('dashboard');
    }
  };

  const prevOnboardingStep = () => {
    if (onboardingStep > 1) {
      setOnboardingStep(onboardingStep - 1);
    } else {
      setCurrentView('login');
    }
  };

  const handleLogout = () => {
    setShowAccountMenu(false);
    setCurrentView('welcome');
    setAuthMode('login');
    setOnboardingStep(1);
    setActiveTab('home');
  };

  const toggleSetCompletion = (exerciseId: number, setIndex: number, totalSetsNeeded: number) => {
    setWorkoutSets(prev => {
      const currentSets = prev[exerciseId]?.length === totalSetsNeeded 
        ? [...prev[exerciseId]] 
        : Array(totalSetsNeeded).fill(false);

      currentSets[setIndex] = !currentSets[setIndex];
      
      if (currentSets[setIndex]) {
        setCurrency(c => c + 10);
      } else {
        setCurrency(c => Math.max(0, c - 10));
      }

      return { ...prev, [exerciseId]: currentSets };
    });
  };

  const workoutData = [
    {
      id: 0,
      title: "Pike Push-Ups",
      icon: Target,
      imgStart: "/Pike Push-Up up.jpg",   
      imgEnd: "/Pike Push-Up down.jpg",   
      mirrorStartFrame: false,    
      setsCount: experience === "beginner" ? 3 : experience === "advanced" ? 4 : 3,
      desc: experience === "beginner" ? "3 Sets • 5 Reps" : 
            experience === "advanced" ? "4 Sets • 12 Reps" : "3 Sets • 8 Reps",
      repLabel: experience === "beginner" ? "5 Reps" : 
                experience === "advanced" ? "12 Reps" : "8 Reps",
      mechanics: "Elevating the hips into an inverted-V shifts the angle of push from a horizontal press to a vertical overhead press. Notice how the head properly tracks forward to form a perfect tripod base.",
      primary: "Shoulders (Anterior & Lateral Deltoids) & Upper Chest.",
      secondary: "Triceps Brachii and Serratus Anterior.",
      synergists: "Upper Trapezius and Core.",
      steps: [
        "Pike your hips up high into an inverted V-shape position.",
        "Lower your head forward down toward the floor between your hands.",
        "Press forcefully through your shoulders to drive yourself back up."
      ]
    },
    {
      id: 1,
      title: "Diamond Push-Ups",
      icon: Dumbbell, 
      imgStart: "/Diamond Push-Up up.jpg",
      imgEnd: "/Diamond Push-Up down.jpg",
      mirrorStartFrame: false,
      setsCount: experience === "beginner" ? 3 : experience === "advanced" ? 4 : 3,
      desc: experience === "beginner" ? "3 Sets • 5 Reps" : 
            experience === "advanced" ? "4 Sets • 15 Reps" : "3 Sets • 10 Reps",
      repLabel: experience === "beginner" ? "5 Reps" : 
                experience === "advanced" ? "15 Reps" : "10 Reps",
      mechanics: "Bringing the hands close together forces the elbows through a massive degree of flexion and extension, shifting the load directly onto the arms.",
      primary: "Triceps Brachii (Lateral & Long Heads).",
      secondary: "Inner Chest (Sternal Pectoralis).",
      synergists: "Anterior Deltoids, Core, and Glutes.",
      steps: [
        "Form a diamond shape with your thumbs and index fingers.",
        "Keep elbows tucked tightly to your ribs as you descend.",
        "Press up explosively through the triceps."
      ]
    },
    {
      id: 2,
      title: "Wide Push-Ups",
      icon: MoveHorizontal,
      imgStart: "/Wide Push-Up up.jpg",    
      imgEnd: "/Wide Push-Up down.jpg",    
      mirrorStartFrame: false,
      setsCount: experience === "beginner" ? 3 : experience === "advanced" ? 5 : 3,
      desc: experience === "beginner" ? "3 Sets • 10 Reps" : 
            experience === "advanced" ? "5 Sets • 25 Reps" : "3 Sets • 15 Reps",
      repLabel: experience === "beginner" ? "10 Reps" : 
                experience === "advanced" ? "25 Reps" : "15 Reps",
      mechanics: "By moving the hands out past shoulder width, you reduce the range of motion at the elbow and force the shoulder joint to do the heavy lifting.",
      primary: "Chest (Pectoralis Major - Outer & Sternal Head).",
      secondary: "Anterior Deltoids (Front Shoulders).",
      synergists: "Triceps Brachii & Core.",
      steps: [
        "Set your hands considerably wider than shoulder-width apart.",
        "Keep your core completely rigid and lower your chest down smoothly.",
        "Drive upward focused on contracting your outer chest muscles."
      ]
    }
  ];

  const getSetsArray = (workout: { id: number; setsCount: number }) =>
    workoutSets[workout.id]?.length === workout.setsCount ? workoutSets[workout.id] : Array(workout.setsCount).fill(false);

  const totalSetsToday = workoutData.reduce((sum, w) => sum + w.setsCount, 0);
  const completedSetsToday = workoutData.reduce((sum, w) => sum + getSetsArray(w).filter(Boolean).length, 0);
  const exercisesFullyDone = workoutData.filter((w) => {
    const s = getSetsArray(w);
    return s.length > 0 && s.every(Boolean);
  }).length;
  const allWorkoutsDone = totalSetsToday > 0 && exercisesFullyDone === workoutData.length;

  const CALORIES_PER_SET = 12;
  const MINUTES_PER_SET = 1.5;
  const CALORIE_GOAL = 600;
  const MINUTE_GOAL = 60;
  const caloriesBurned = Math.round(completedSetsToday * CALORIES_PER_SET);
  const minutesActive = Math.round(completedSetsToday * MINUTES_PER_SET);
  const calorieProgress = Math.min(100, Math.round((caloriesBurned / CALORIE_GOAL) * 100));
  const minuteProgress = Math.min(100, Math.round((minutesActive / MINUTE_GOAL) * 100));
  const dailyTargetPct = Math.min(100, Math.round((calorieProgress + minuteProgress) / 2));

  const TODAY_INDEX = 27;
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const date = i + 1;
    let status = 2; 
    if (i > 27) status = 0;
    else if (i % 7 === 0 || i % 7 === 4) status = 1;
    else if (i === 14) status = 3;

    const seed = (i * 53) % 97;
    let power = status === 2 ? 60 + (seed % 50) : status === 1 ? 20 + (seed % 15) : 0;
    let time = status === 2 ? 70 + (seed % 40) : status === 1 ? 15 + (seed % 20) : 0;
    let discipline = status === 2 ? 80 + (seed % 30) : status === 1 ? 30 : 0;

    if (i === TODAY_INDEX) {
      power = calorieProgress;
      time = minuteProgress;
      discipline = dailyTargetPct;
      status = completedSetsToday > 0 ? 2 : 1;
    }

    return { date, status, power, time, discipline };
  });
  const last7Days = calendarDays.slice(Math.max(0, TODAY_INDEX - 6), TODAY_INDEX + 1);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-gray-700 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex justify-center items-center p-0 sm:p-4">
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scan-overlay { background: linear-gradient(to bottom, transparent 40%, rgba(244, 63, 94, 0.1) 50%, transparent 60%); animation: scanline 3s linear infinite; }

        @keyframes repLoop { 
          0%, 35% { opacity: 1; }      
          45%, 85% { opacity: 0; }     
          95%, 100% { opacity: 1; }    
        }
        .animate-rep-loop { animation: repLoop 5s ease-in-out infinite; }
        
        @keyframes fillRing { from { stroke-dasharray: 0, 100; } to { stroke-dasharray: 75, 100; } }
        .animate-ring { animation: fillRing 1.5s ease-out forwards; }
      `}} />

      {/* MOBILE APP FRAME - Fixed height layout implemented here */}
      <div className="w-full max-w-md bg-gray-900 h-[100dvh] sm:h-[850px] sm:rounded-3xl shadow-2xl relative flex flex-col border border-gray-800 overflow-hidden">
        
        {/* VIEW 1: WELCOME SCREEN */}
        {currentView === 'welcome' && (
          <div className="absolute inset-0 flex flex-col justify-between p-8 z-30 transition-all duration-500">
            <div className="absolute inset-0 bg-cover bg-center z-0 scale-105" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80')` }} />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-gray-900/50 z-10" />

            <div className="z-20 text-center mt-6">
              <span className="text-xs font-bold tracking-widest text-rose-500 uppercase bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
                The RPG Fitness Experience
              </span>
              <h1 className="text-4xl font-black tracking-tight mt-3 text-white drop-shadow-md">
                BECOME THE <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500">OVERLORD</span>
              </h1>
            </div>

            <div className="z-20 mb-6 space-y-6">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-xl font-bold text-gray-100">Forge Your Sleeper Build.</h2>
                <p className="text-sm text-gray-400 leading-relaxed">Gamify your calisthenics training, unlock elite ranks, safeguard your daily streak, and master your discipline.</p>
              </div>
              <button onClick={() => setCurrentView('login')} className="w-full bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center space-x-2">
                <span>Begin Your Journey</span> <span>→</span>
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: LOGIN VIEW */}
        {currentView === 'login' && (
          <div className="absolute inset-0 flex flex-col justify-between p-8 z-30 bg-gray-950 animate-fade">
            <div className="mt-8 z-10">
              <button onClick={() => setCurrentView('welcome')} className="text-sm text-gray-400 hover:text-white flex items-center space-x-1 mb-8">
                <span>← Back</span>
              </button>
              <h2 className="text-3xl font-black tracking-tight mb-2">
                {authMode === 'signup' ? 'Enter the Arena' : 'Welcome Back, Warrior'}
              </h2>
              <p className="text-sm text-gray-400">
                {authMode === 'signup'
                  ? "Create your profile to start tracking your gains."
                  : "Log in to secure your streak and check today's targets."}
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email Address</label>
                  <input type="email" placeholder="warrior@fittrack.com" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:outline-none text-sm" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
                    {authMode === 'login' && (
                      <button type="button" className="text-xs font-semibold text-rose-400 hover:text-rose-300">
                        Forgot?
                      </button>
                    )}
                  </div>
                  <input type="password" placeholder="••••••••••••" className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 text-white focus:border-rose-500 focus:outline-none text-sm" />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}
                className="mt-6 w-full text-center text-xs text-gray-400 hover:text-white"
              >
                {authMode === 'signup' ? (
                  <>Already a Warrior? <span className="text-rose-400 font-bold">Log In</span></>
                ) : (
                  <>New Recruit? <span className="text-rose-400 font-bold">Create Account</span></>
                )}
              </button>
            </div>
            <div className="mb-4 z-10">
              <button
                onClick={() => {
                  if (authMode === 'signup') {
                    setOnboardingStep(1);
                    setCurrentView('onboarding');
                  } else {
                    setCurrentView('dashboard');
                  }
                }}
                className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold py-3.5 rounded-xl shadow-md"
              >
                {authMode === 'signup' ? 'Initialize Profile' : 'Log In'}
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: ONBOARDING */}
        {currentView === 'onboarding' && (
          <div className="absolute inset-0 flex flex-col justify-between p-8 z-30 bg-gray-950 animate-fade">
            <div>
              <div className="flex justify-between items-center mt-4 mb-8">
                <button onClick={prevOnboardingStep} className="text-sm text-gray-400 hover:text-white">← Back</button>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${step <= onboardingStep ? 'w-6 bg-rose-500' : 'w-2 bg-gray-800'}`} />
                  ))}
                </div>
                <span className="text-xs font-mono text-gray-500">STEP {onboardingStep}/4</span>
              </div>

              {onboardingStep === 1 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block mb-1">Identity</span>
                    <h2 className="text-2xl font-black">What's your warrior name?</h2>
                  </div>
                  <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 focus-within:border-rose-500">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Callsign</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Leave blank for a random one"
                      maxLength={20}
                      className="w-full bg-transparent text-2xl font-black focus:outline-none text-white placeholder:text-gray-600 placeholder:text-base"
                    />
                  </div>
                  <p className="text-xs text-gray-500 px-1">This is how you'll appear on the leaderboard. Skip it and we'll forge a callsign for you.</p>
                </div>
              )}

              {onboardingStep === 2 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-widest block mb-1">Character Registry</span>
                    <h2 className="text-2xl font-black">What are your vitals?</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 focus-within:border-rose-500">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Age</label>
                      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} className="w-full bg-transparent text-2xl font-black focus:outline-none text-white" />
                      <span className="text-xs text-gray-500">years old</span>
                    </div>
                    <div className="bg-gray-900 p-4 rounded-2xl border border-gray-800 focus-within:border-rose-500">
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Weight</label>
                      <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-transparent text-2xl font-black focus:outline-none text-white" />
                      <span className="text-xs text-gray-500">kg</span>
                    </div>
                  </div>
                  <div className="mt-6 p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-start space-x-3">
                    <Zap size={16} className="text-rose-500 mt-0.5 shrink-0" />
                    <p className="text-xs text-gray-400 leading-relaxed">We use this to calibrate your starting difficulty and XP curve. It's never shown on a public leaderboard.</p>
                  </div>
                </div>
              )}

              {onboardingStep === 3 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest block mb-1">Power Level</span>
                    <h2 className="text-2xl font-black">Max Pushups?</h2>
                  </div>
                  <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 text-center space-y-4 my-8">
                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-purple-400">
                      {maxPushups} <span className="text-base font-medium text-gray-400">Reps</span>
                    </div>
                    <input type="range" min="0" max="100" value={maxPushups} onChange={(e) => setMaxPushups(parseInt(e.target.value))} className="w-full accent-rose-500 bg-gray-800 h-2 rounded-lg cursor-pointer" />
                    <div className="flex justify-between text-[10px] text-gray-500 px-0.5">
                      <span>0</span>
                      <span>50</span>
                      <span>100+</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 text-center px-4">Don't worry about being exact — your Power Level recalibrates every week based on real performance.</p>
                </div>
              )}

              {onboardingStep === 4 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block mb-1">Class Archetype</span>
                    <h2 className="text-2xl font-black">Training Background?</h2>
                  </div>
                  <div className="space-y-3 pt-2">
                    {[
                      { id: 'beginner', title: 'Recruit', icon: Circle, desc: "New to calisthenics — we'll start you light." },
                      { id: 'intermediate', title: 'Skilled Gladiator', icon: Dumbbell, desc: 'Comfortable with the bodyweight basics.' },
                      { id: 'advanced', title: 'Movement Overlord', icon: Crown, desc: 'Advanced strength, control, and skill work.' }
                    ].map((tier) => {
                      const IconComponent = tier.icon;
                      return (
                        <div key={tier.id} onClick={() => setExperience(tier.id)} className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${experience === tier.id ? 'bg-purple-950/20 border-purple-500/80' : 'bg-gray-900 border-gray-800'}`}>
                          <div className="flex items-center space-x-3">
                            <IconComponent size={22} className={experience === tier.id ? 'text-purple-400' : 'text-gray-400'} />
                            <div>
                              <h4 className="text-sm font-bold text-gray-100">{tier.title}</h4>
                              <p className="text-[11px] text-gray-500 mt-0.5">{tier.desc}</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${experience === tier.id ? 'border-purple-500 bg-purple-500' : 'border-gray-600'}`}>
                            {experience === tier.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="mb-4">
              <button onClick={nextOnboardingStep} className="w-full bg-gradient-to-r from-rose-500 to-purple-600 text-white font-bold py-4 rounded-xl shadow-lg">
                {onboardingStep === 4 ? 'Generate Base Attributes' : onboardingStep === 1 ? 'Confirm Identity' : 'Next Attribute'} →
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: FULL APP DASHBOARD (TABS) */}
        {currentView === 'dashboard' && (
          <div className="flex-1 flex flex-col bg-gray-950 relative overflow-hidden">
            
            {/* Scrollable Tab Area */}
            <div ref={scrollContainerRef} className="flex-1 overflow-y-auto pb-24">
              
              {/* TAB: HOME */}
              {activeTab === 'home' && (
                <div className="animate-fade">
                  <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-3xl shadow-lg border-b border-gray-800">
                    <div className="flex justify-between items-center mb-6 pr-16">
                      <div>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Welcome back,</p>
                        <h1 className="text-2xl font-black text-white">{userName || 'Warrior'}</h1>
                      </div>
                      <div className="bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 flex items-center space-x-1.5">
                        <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-yellow-400">{currency}G</span>
                      </div>
                    </div>

                    <div className="bg-gray-950 rounded-2xl p-5 border border-gray-800 flex items-center justify-between shadow-inner">
                      <div>
                        <h3 className="text-sm font-bold text-gray-300">Daily Target</h3>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Upper Body Focus</p>
                        <div className="mt-4 space-y-2">
                          <div className="flex items-center space-x-2">
                            <Flame size={14} className="text-rose-500" />
                            <span className="text-xs font-medium">{caloriesBurned} / {CALORIE_GOAL} kcal</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Zap size={14} className="text-purple-500" />
                            <span className="text-xs font-medium">{minutesActive} / {MINUTE_GOAL} mins</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative w-24 h-24">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3" />
                          <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray={`${dailyTargetPct}, 100`} style={{ transition: 'stroke-dasharray 0.6s ease-out' }} strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-xl font-black">{dailyTargetPct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="bg-gray-800 rounded-2xl p-4 border border-gray-700 flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center border border-orange-500/50">
                          <Flame className="text-orange-500" size={20} />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm">28 Day Streak</h4>
                          <p className="text-[10px] text-gray-400">Personal Best: 42 Days</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {purchasedItems.includes('item_1') && (
                          <span className="flex items-center space-x-1 text-[9px] font-bold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/30">
                            <ShieldCheck size={11} /> <span>Shielded</span>
                          </span>
                        )}
                        <button onClick={() => setActiveTab('calendar')} className="text-xs bg-gray-900 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 transition">View Log</button>
                      </div>
                    </div>

                    <button onClick={() => setActiveTab('workouts')} className={`w-full p-4 rounded-2xl font-black shadow-lg flex justify-between items-center group transition-colors ${
                      allWorkoutsDone ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-gradient-to-r from-rose-500 to-purple-600'
                    }`}>
                      <div className="text-left">
                        <span className="block text-xl">{allWorkoutsDone ? 'Workout Complete!' : 'Resume Workout'}</span>
                        <span className="text-xs text-white/70 font-medium">
                          {exercisesFullyDone} of {workoutData.length} exercises &middot; {completedSetsToday}/{totalSetsToday} sets logged
                        </span>
                      </div>
                      {allWorkoutsDone ? <Trophy size={24} /> : <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                  </div>
                </div>
              )}

              {/* TAB: CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="p-6 animate-fade">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h2 className="text-2xl font-black">Training Log</h2>
                      <p className="text-sm text-gray-400">
                        {/* DYNAMIC DATE ADDED HERE */}
                        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <BarChart2 size={22} className="text-rose-500" />
                  </div>

                  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4 flex justify-between items-center overflow-x-auto gap-2">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((label, idx) => {
                      const dayIndex = TODAY_INDEX - 6 + idx;
                      const day = last7Days[idx];
                      if (!day) return null;
                      const ringColor = day.status === 3 ? '#ef4444' : day.status === 1 ? '#3b82f6' : '#f43f5e';
                      return (
                        <button key={idx} onClick={() => setSelectedDay(dayIndex)} className="flex flex-col items-center space-y-2 shrink-0">
                          <span className={`text-[10px] font-bold ${selectedDay === dayIndex ? 'text-rose-400' : 'text-gray-500'}`}>{label}</span>
                          <div className={`relative w-8 h-8 rounded-full transition-all ${selectedDay === dayIndex ? 'ring-2 ring-rose-500 ring-offset-2 ring-offset-gray-900' : ''}`}>
                            <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                              <circle cx="18" cy="18" r="16" fill="none" stroke="#2a2a35" strokeWidth="4" />
                              <circle cx="18" cy="18" r="16" fill="none" stroke={ringColor} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${day.power}, 100`} />
                            </svg>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="bg-gray-800 rounded-2xl p-5 border border-gray-700 shadow-lg">
                    <div className="grid grid-cols-7 gap-2 mb-4 text-center">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <span key={i} className="text-[10px] font-bold text-gray-500">{day}</span>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {calendarDays.map((day, i) => (
                        <div key={i} className="aspect-square flex items-center justify-center relative">
                          <button
                            onClick={() => day.status !== 0 && setSelectedDay(i)}
                            disabled={day.status === 0}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                              ${day.status === 0 ? 'text-gray-600' : ''} 
                              ${day.status === 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''} 
                              ${day.status === 2 ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]' : ''} 
                              ${day.status === 3 ? 'bg-gray-900 border border-red-500/50 text-red-500' : ''} 
                              ${selectedDay === i ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white/80' : ''}
                            `}
                          >
                            {day.date}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedDay !== null && calendarDays[selectedDay] && (
                    <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-5 animate-fade">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-200">
                          {new Date().toLocaleString('default', { month: 'long' })} {calendarDays[selectedDay].date}, {new Date().getFullYear()} {selectedDay === TODAY_INDEX && <span className="text-rose-400">&middot; Today</span>}
                        </h3>
                        <button onClick={() => setSelectedDay(null)} className="text-gray-500 hover:text-white text-xs font-bold">Close</button>
                      </div>

                      <div className="flex items-center justify-center mb-5">
                        <div className="relative w-36 h-36">
                          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                            <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3.2" />
                            <circle cx="18" cy="18" r="10.8" fill="none" stroke="#27272a" strokeWidth="3.2" />
                            <circle cx="18" cy="18" r="6.6" fill="none" stroke="#27272a" strokeWidth="3.2" />
                            <RingStat pct={calendarDays[selectedDay].power} radius={15} color="#f43f5e" />
                            <RingStat pct={calendarDays[selectedDay].time} radius={10.8} color="#34d399" />
                            <RingStat pct={calendarDays[selectedDay].discipline} radius={6.6} color="#38bdf8" />
                          </svg>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                            <span className="text-xs font-bold text-gray-300">Power</span>
                          </div>
                          <span className="text-xs text-gray-400">{calendarDays[selectedDay].power}% of goal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                            <span className="text-xs font-bold text-gray-300">Time</span>
                          </div>
                          <span className="text-xs text-gray-400">{calendarDays[selectedDay].time}% of goal</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                            <span className="text-xs font-bold text-gray-300">Discipline</span>
                          </div>
                          <span className="text-xs text-gray-400">{calendarDays[selectedDay].discipline}% of goal</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 bg-gray-900 border border-gray-800 rounded-2xl p-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Hourly Caloric Burn Intensity</h4>
                    <div className="h-16 flex items-end justify-between px-2 pt-2 border-b border-gray-800">
                      {[30, 15, 45, 80, 95, 40, 20, 65, 100, 35, 10, 5].map((val, i) => (
                        <div key={i} className="w-2 rounded-t-sm transition-all duration-500 bg-gradient-to-t from-purple-600 to-rose-500" style={{ height: `${val}%` }} />
                      ))}
                    </div>
                    <div className="flex justify-between text-[9px] text-gray-500 mt-1 px-1">
                      <span>06:00</span>
                      <span>12:00</span>
                      <span>18:00</span>
                    </div>
                    <p className="text-[10px] text-gray-600 mt-2 italic">Illustrative hourly pattern — per-set timestamps aren't tracked yet.</p>
                  </div>
                </div>
              )}

              {/* TAB: WORKOUTS */}
              {activeTab === 'workouts' && (
                <div className="p-6 animate-fade">
                   <div className="flex justify-between items-end mb-6">
                      <div>
                        <h2 className="text-xl font-bold tracking-tight">Today's Target</h2>
                        <p className="text-sm text-gray-400">Push Day Matrix</p>
                      </div>
                      <span className="text-xs text-rose-400 font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Active</span>
                    </div>

                    <div className="space-y-6">
                      {workoutData.map((workout, index) => {
                        const sets = getSetsArray(workout);
                        
                        const completedCount = sets.filter(Boolean).length;
                        const isFullyCompleted = completedCount === sets.length;
                        const isExpanded = expandedExercise === index;
                        const IconComponent = workout.icon;

                        return (
                          <div 
                            key={workout.id}
                            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                              isFullyCompleted ? 'bg-rose-950/10 border-rose-500/40' : isExpanded ? 'bg-gray-800 border-gray-600 shadow-lg' : 'bg-gray-800 border-gray-700'
                            }`}
                          >
                            <div 
                              onClick={() => setExpandedExercise(isExpanded ? null : index)}
                              className="p-4 flex justify-between items-center cursor-pointer"
                            >
                              <div className="flex items-center space-x-4">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                                  isFullyCompleted ? 'bg-rose-500 text-white' : 'bg-gray-700 text-gray-400'
                                }`}>
                                  <IconComponent size={18} />
                                </div>
                                <div>
                                  <h3 className={`font-bold text-sm transition-colors ${isFullyCompleted ? 'text-rose-300 line-through' : 'text-white'}`}>{workout.title}</h3>
                                  <p className="text-xs text-gray-400 mt-0.5">{workout.desc}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xs font-mono bg-gray-900 px-2 py-1 rounded-md border border-gray-700 text-gray-400">
                                  {completedCount}/{sets.length} Sets
                                </span>
                                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="px-4 pb-4 pt-2 border-t border-gray-700/50 bg-gray-800/40 space-y-5">
                                
                                <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center mt-2 group">
                                  <img 
                                    src={workout.imgEnd} 
                                    alt={`${workout.title} down`} 
                                    className="absolute w-full h-full object-cover" 
                                  />
                                  <img 
                                    src={workout.imgStart} 
                                    alt={`${workout.title} up`} 
                                    className={`absolute w-full h-full object-cover animate-rep-loop ${workout.mirrorStartFrame ? 'scale-x-[-1]' : ''}`} 
                                  />
                                  
                                  <div className="absolute inset-0 scan-overlay pointer-events-none" />
                                  <div className="absolute top-3 left-3 bg-black/80 px-2.5 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider border border-rose-500/30 text-rose-400 flex items-center space-x-1.5 backdrop-blur-sm z-10">
                                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse mr-1"></span> 5s Target Pace
                                  </div>
                                </div>

                                <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-700/50 space-y-4">
                                  <p className="text-xs text-gray-400 italic mb-4 border-b border-gray-800 pb-3">{workout.mechanics}</p>
                                  
                                  <div className="flex items-start space-x-3">
                                    <div className="mt-0.5 bg-rose-500/20 p-1.5 rounded-lg shrink-0">
                                      <Target size={14} className="text-rose-400" />
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block mb-0.5">Primary Focus</span>
                                      <span className="text-xs text-gray-300">{workout.primary}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-start space-x-3">
                                    <div className="mt-0.5 bg-purple-500/20 p-1.5 rounded-lg shrink-0">
                                      <Activity size={14} className="text-purple-400" />
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block mb-0.5">Secondary Focus</span>
                                      <span className="text-xs text-gray-300">{workout.secondary}</span>
                                    </div>
                                  </div>

                                  <div className="flex items-start space-x-3">
                                    <div className="mt-0.5 bg-blue-500/20 p-1.5 rounded-lg shrink-0">
                                      <Shield size={14} className="text-blue-400" />
                                    </div>
                                    <div>
                                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-0.5">Stabilizers</span>
                                      <span className="text-xs text-gray-300">{workout.synergists}</span>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">Form Check</h4>
                                  {workout.steps.map((step, stepIdx) => (
                                    <div key={stepIdx} className="flex items-start space-x-3">
                                      <div className="w-5 h-5 rounded-full bg-gray-700 text-gray-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{stepIdx + 1}</div>
                                      <p className="text-xs text-gray-400 leading-relaxed">{step}</p>
                                    </div>
                                  ))}
                                </div>

                                <div className="pt-4 border-t border-gray-700">
                                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-3">Track Sub-Sets</h4>
                                  <div className="grid grid-cols-1 gap-2">
                                    {sets.map((setDone, setIdx) => (
                                      <div 
                                        key={setIdx}
                                        onClick={() => toggleSetCompletion(workout.id, setIdx, workout.setsCount)}
                                        className={`p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                                          setDone 
                                            ? 'bg-rose-500/10 border-rose-500/40 text-rose-200' 
                                            : 'bg-gray-900 border-gray-800 hover:border-gray-700 text-gray-400'
                                        }`}
                                      >
                                        <div className="flex items-center space-x-3">
                                          <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${setDone ? 'bg-rose-500/20 text-rose-300' : 'bg-gray-800 text-gray-500'}`}>
                                            SET {setIdx + 1}
                                          </span>
                                          <span className="text-xs font-medium">
                                            {workout.repLabel}
                                          </span>
                                        </div>
                                        
                                        {setDone ? (
                                          <div className="flex items-center space-x-1 text-rose-400">
                                            <span className="text-[10px] font-bold font-mono tracking-wider uppercase bg-rose-500/10 px-1.5 py-0.5 rounded border border-rose-500/20">Logged (+10G)</span>
                                            <CheckCircle2 size={18} className="fill-rose-500 text-gray-900" />
                                          </div>
                                        ) : (
                                          <Circle size={18} className="text-gray-600 hover:text-gray-400" />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                </div>
              )}

              {/* TAB: LEADERBOARD */}
              {activeTab === 'leaderboard' && (
                <div className="p-6 animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-black">Global Arena</h2>
                      <p className="text-sm text-gray-400">Ranks refresh in 4h 12m</p>
                    </div>
                    <Trophy size={24} className="text-yellow-500 animate-bounce" />
                  </div>

                  <div className="space-y-3">
                    {leaderboardData.map((warrior) => {
                      const hasAura = warrior.isMe && purchasedItems.includes('item_3');
                      const isExpanded = expandedProfile === warrior.rank;
                      const isVisible = warrior.isMe ? settings.leaderboardVisible : warrior.statsVisible;
                      const dPower = warrior.isMe ? calorieProgress : warrior.power;
                      const dTime = warrior.isMe ? minuteProgress : warrior.time;
                      const dDiscipline = warrior.isMe ? dailyTargetPct : warrior.discipline;
                      const dWeek = warrior.isMe ? last7Days.map((d) => d.power) : warrior.weekPattern;

                      return (
                        <div 
                          key={warrior.rank}
                          className={`rounded-2xl border transition-all overflow-hidden ${
                            warrior.isMe 
                              ? hasAura
                                ? 'bg-gradient-to-r from-yellow-950/30 to-rose-950/30 border-yellow-500 shadow-md shadow-yellow-500/20'
                                : 'bg-gradient-to-r from-rose-950/30 to-purple-950/30 border-rose-500 shadow-md shadow-rose-500/10' 
                              : 'bg-gray-900 border-gray-800'
                          }`}
                        >
                          <button
                            onClick={() => setExpandedProfile(isExpanded ? null : warrior.rank)}
                            className="w-full p-4 flex items-center justify-between text-left"
                          >
                            <div className="flex items-center space-x-4">
                              <span className={`text-sm font-mono font-black w-5 text-center ${
                                warrior.rank === 1 ? 'text-yellow-400 text-base' : warrior.rank === 2 ? 'text-gray-300' : warrior.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                              }`}>
                                #{warrior.rank}
                              </span>
                              <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${warrior.avatarColor} flex items-center justify-center shadow-inner shrink-0`}>
                                {warrior.isMe ? <AvatarGlyph config={avatarConfig} size={14} /> : <User size={14} className="text-white" />}
                              </div>
                              <div>
                                <h4 className={`text-sm font-bold ${warrior.isMe ? 'text-rose-400' : 'text-gray-200'}`}>
                                  {warrior.isMe ? (userName || 'Warrior') : warrior.name}{' '}
                                  {warrior.isMe && <span className="text-[10px] font-mono text-purple-400 ml-1 border border-purple-500/30 px-1 py-0.5 rounded bg-purple-500/10">YOU</span>}
                                  {hasAura && <Crown size={12} className="inline text-yellow-400 ml-1 -translate-y-0.5" />}
                                </h4>
                                <p className="text-[10px] text-gray-500 flex items-center">
                                  <Flame size={10} className="text-orange-500 mr-0.5" /> {warrior.streak} Day Streak
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2">
                              <div className="text-right">
                                <span className="block text-xs font-mono font-black text-gray-200">{warrior.xp}</span>
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Power XP</span>
                              </div>
                              <ChevronDown size={16} className={`text-gray-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 border-t border-gray-800/60">
                              {isVisible ? (
                                <div className="space-y-4 animate-fade pt-3">
                                  <div className="flex items-center justify-center gap-6">
                                    <div className="relative w-20 h-20 shrink-0">
                                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                        <circle cx="18" cy="18" r="15" fill="none" stroke="#27272a" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="10.8" fill="none" stroke="#27272a" strokeWidth="3" />
                                        <circle cx="18" cy="18" r="6.6" fill="none" stroke="#27272a" strokeWidth="3" />
                                        <RingStat pct={dPower} radius={15} color="#f43f5e" />
                                        <RingStat pct={dTime} radius={10.8} color="#34d399" />
                                        <RingStat pct={dDiscipline} radius={6.6} color="#38bdf8" />
                                      </svg>
                                    </div>
                                    <div className="space-y-1.5">
                                      <p className="text-xs font-bold text-gray-300">{warrior.title}</p>
                                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-rose-500" /><span>Power {dPower}%</span></div>
                                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span>Time {dTime}%</span></div>
                                      <div className="flex items-center space-x-1.5 text-[10px] text-gray-500"><span className="w-2 h-2 rounded-full bg-sky-400" /><span>Discipline {dDiscipline}%</span></div>
                                    </div>
                                  </div>

                                  <div className="flex justify-between px-1">
                                    {dWeek.map((val: number, i: number) => (
                                      <div key={i} className="w-6 h-6">
                                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                                          <circle cx="18" cy="18" r="16" fill="none" stroke="#2a2a35" strokeWidth="4" />
                                          <circle cx="18" cy="18" r="16" fill="none" stroke="#f43f5e" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${val}, 100`} />
                                        </svg>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="bg-gray-950/60 rounded-xl p-3 flex items-center space-x-2">
                                    <Trophy size={14} className="text-yellow-400 shrink-0" />
                                    <p className="text-xs text-gray-300">{warrior.achievement}</p>
                                  </div>
                                </div>
                              ) : (
                                <div className="relative pt-3">
                                  <div className="space-y-4 filter blur-md opacity-40 pointer-events-none select-none">
                                    <div className="flex items-center justify-center">
                                      <div className="w-20 h-20 rounded-full border-[6px] border-gray-700" />
                                    </div>
                                    <div className="h-8 bg-gray-700 rounded-xl w-full" />
                                  </div>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <Lock size={20} className="text-gray-500 mb-1" />
                                    <p className="text-xs font-bold text-gray-400">Can't View This Profile</p>
                                    <p className="text-[10px] text-gray-600 mt-0.5 text-center px-6">This warrior has chosen to keep their stats private.</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: ITEM SHOP */}
              {activeTab === 'shop' && (
                <div className="p-6 animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-2xl font-black">Armory Store</h2>
                      <p className="text-sm text-gray-400">Trade hard-earned gold attributes</p>
                    </div>
                    <div className="bg-gray-900 px-3 py-1.5 rounded-xl border border-gray-800 flex items-center space-x-1.5">
                      <Sparkles size={14} className="text-yellow-400" />
                      <span className="text-sm font-mono font-black text-yellow-400">{currency}G</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {shopItems.map((item) => {
                      const ItemIcon = item.icon;
                      const isOwned = purchasedItems.includes(item.id);
                      return (
                        <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden">
                          <div className="flex items-start space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border ${item.color}`}>
                              <ItemIcon size={22} />
                            </div>
                            <div className="space-y-1 pr-12">
                              <h4 className="text-sm font-bold text-gray-100">{item.name}</h4>
                              <p className="text-xs text-gray-400 leading-normal">{item.desc}</p>
                            </div>
                          </div>

                          <div className="mt-4 pt-3 border-t border-gray-800/60 flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Item Grade: Tier 1</span>
                            {isOwned ? (
                              <button disabled className="bg-gray-800 text-gray-500 text-xs px-4 py-2 rounded-xl font-bold border border-gray-700 flex items-center space-x-1">
                                <Lock size={12} /> <span>Equipped</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => {
                                  if (currency >= item.price) {
                                    setCurrency(c => c - item.price);
                                    setPurchasedItems(prev => [...prev, item.id]);
                                  }
                                }} 
                                disabled={currency < item.price}
                                className={`text-xs px-4 py-2 rounded-xl font-black shadow transition-all ${
                                  currency >= item.price 
                                    ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white hover:opacity-90 active:scale-95' 
                                    : 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-800'
                                }`}
                              >
                                Unlock For {item.price}G
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB: PROFILE */}
              {activeTab === 'profile' && (
                <div className="px-6 pb-6 pt-24 animate-fade">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black">Commander Profile</h2>
                  </div>
                  
                  <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 text-center relative overflow-hidden mb-6">
                    <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      {purchasedItems.includes('item_2') && (
                        <span className="absolute inset-[-3px] rounded-full bg-[conic-gradient(from_0deg,#f43f5e,#a855f7,#22d3ee,#f43f5e)] animate-spin" style={{ animationDuration: '3s' }} />
                      )}
                      <div className={`absolute flex items-center justify-center rounded-full overflow-hidden ${
                        purchasedItems.includes('item_2') ? 'inset-[3px]' : 'inset-0 border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                      }`}>
                        <AvatarGlyph config={avatarConfig} size={32} />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold">Level 42 Overlord</h3>
                    <p className="text-xs text-purple-400 font-medium mt-1">Next rank in 14,000 XP</p>
                    
                    <div className="w-full bg-gray-900 h-2 rounded-full mt-4 border border-gray-700 overflow-hidden">
                      <div className="bg-gradient-to-r from-rose-500 to-purple-500 h-full w-[80%] rounded-full"></div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Achievements & Badges</h4>
                    
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center p-3 bg-gray-900 rounded-xl border border-gray-800">
                        <div className="text-2xl mr-4 p-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                          <Timer className="text-yellow-500" size={20} />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-yellow-500">8-Year Pushup Mastery</h5>
                          <p className="text-[10px] text-gray-400">Maintained calisthenics discipline for 8 years.</p>
                        </div>
                      </div>
                      <div className="flex items-center p-3 bg-gray-900 rounded-xl border border-gray-800">
                        <div className="text-2xl mr-4 p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                          <Shield className="text-blue-400" size={20} />
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-blue-400">Iron Core</h5>
                          <p className="text-[10px] text-gray-400">Unlocked Advanced Hollow-Body Movements.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS */}
              {activeTab === 'settings' && (
                <div className="px-6 pb-6 pt-24 animate-fade">
                  <h2 className="text-2xl font-black mb-6">Settings</h2>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Avatar</h4>
                      <div className="bg-gray-900 rounded-2xl border border-gray-800 p-4 space-y-4">
                        <div className="flex justify-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-700">
                            <AvatarGlyph config={avatarConfig} size={28} />
                          </div>
                        </div>

                        <div className="flex bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => setAvatarConfig((a) => ({ ...a, type: 'icon' }))}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${avatarConfig.type === 'icon' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                          >
                            Icon
                          </button>
                          <button
                            onClick={() => setAvatarConfig((a) => ({ ...a, type: 'emoji' }))}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${avatarConfig.type === 'emoji' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                          >
                            Emoji
                          </button>
                        </div>

                        {avatarConfig.type === 'icon' ? (
                          <div className="grid grid-cols-4 gap-2">
                            {Object.keys(AVATAR_ICONS).map((iconKey) => {
                              const IconOption = AVATAR_ICONS[iconKey];
                              return (
                                <button
                                  key={iconKey}
                                  onClick={() => setAvatarConfig((a) => ({ ...a, icon: iconKey }))}
                                  className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${avatarConfig.icon === iconKey ? 'border-rose-500 bg-rose-500/10' : 'border-gray-800 bg-gray-800/50'}`}
                                >
                                  <IconOption size={18} className={avatarConfig.icon === iconKey ? 'text-rose-400' : 'text-gray-400'} />
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="grid grid-cols-4 gap-2">
                            {AVATAR_EMOJIS.map((emo) => (
                              <button
                                key={emo}
                                onClick={() => setAvatarConfig((a) => ({ ...a, emoji: emo }))}
                                className={`aspect-square rounded-xl flex items-center justify-center text-lg border transition-all ${avatarConfig.emoji === emo ? 'border-rose-500 bg-rose-500/10' : 'border-gray-800 bg-gray-800/50'}`}
                              >
                                {emo}
                              </button>
                            ))}
                          </div>
                        )}

                        <div className="flex bg-gray-800 rounded-lg p-1">
                          <button
                            onClick={() => setAvatarConfig((a) => ({ ...a, colorMode: 'gradient' }))}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${avatarConfig.colorMode === 'gradient' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                          >
                            Gradient
                          </button>
                          <button
                            onClick={() => setAvatarConfig((a) => ({ ...a, colorMode: 'solid' }))}
                            className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-colors ${avatarConfig.colorMode === 'solid' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                          >
                            Plain Color
                          </button>
                        </div>

                        {avatarConfig.colorMode === 'gradient' ? (
                          <div className="flex justify-between px-1">
                            {Object.keys(GRADIENT_PRESETS).map((key) => (
                              <button
                                key={key}
                                onClick={() => setAvatarConfig((a) => ({ ...a, gradient: key }))}
                                className={`w-9 h-9 rounded-full bg-gradient-to-br ${GRADIENT_PRESETS[key]} ${avatarConfig.gradient === key ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="flex justify-between px-1">
                            {Object.keys(SOLID_PRESETS).map((key) => (
                              <button
                                key={key}
                                onClick={() => setAvatarConfig((a) => ({ ...a, solidColor: key }))}
                                style={{ backgroundColor: SOLID_PRESETS[key] }}
                                className={`w-9 h-9 rounded-full ${avatarConfig.solidColor === key ? 'ring-2 ring-white ring-offset-2 ring-offset-gray-900' : ''}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Feedback</h4>
                      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Vibrate size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Vibration</p>
                              <p className="text-[11px] text-gray-500">Haptic feedback on reps & milestones</p>
                            </div>
                          </div>
                          <Toggle checked={settings.vibration} onChange={() => setSettings((s) => ({ ...s, vibration: !s.vibration }))} />
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Volume2 size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Sound Effects</p>
                              <p className="text-[11px] text-gray-500">Level-up & rep-complete chimes</p>
                            </div>
                          </div>
                          <Toggle checked={settings.sound} onChange={() => setSettings((s) => ({ ...s, sound: !s.sound }))} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Workout</h4>
                      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Timer size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Auto Rest Timer</p>
                              <p className="text-[11px] text-gray-500">Starts a countdown between sets</p>
                            </div>
                          </div>
                          <Toggle checked={settings.autoRestTimer} onChange={() => setSettings((s) => ({ ...s, autoRestTimer: !s.autoRestTimer }))} />
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Ruler size={18} className="text-gray-400 shrink-0" />
                            <p className="text-sm font-medium text-gray-200">Weight Unit</p>
                          </div>
                          <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                              onClick={() => setSettings((s) => ({ ...s, units: 'kg' }))}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.units === 'kg' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                            >
                              KG
                            </button>
                            <button
                              onClick={() => setSettings((s) => ({ ...s, units: 'lb' }))}
                              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${settings.units === 'lb' ? 'bg-rose-500 text-white' : 'text-gray-400'}`}
                            >
                              LB
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Notifications</h4>
                      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Bell size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Daily Reminder</p>
                              <p className="text-[11px] text-gray-500">Nudge if you haven't trained by 6 PM</p>
                            </div>
                          </div>
                          <Toggle checked={settings.dailyReminder} onChange={() => setSettings((s) => ({ ...s, dailyReminder: !s.dailyReminder }))} />
                        </div>
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Flame size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Streak Risk Alerts</p>
                              <p className="text-[11px] text-gray-500">Warn before your streak expires</p>
                            </div>
                          </div>
                          <Toggle checked={settings.streakAlerts} onChange={() => setSettings((s) => ({ ...s, streakAlerts: !s.streakAlerts }))} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Privacy</h4>
                      <div className="bg-gray-900 rounded-2xl border border-gray-800 divide-y divide-gray-800">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center space-x-3">
                            <Shield size={18} className="text-gray-400 shrink-0" />
                            <div>
                              <p className="text-sm font-medium text-gray-200">Show on Leaderboard</p>
                              <p className="text-[11px] text-gray-500">Let other warriors see your rank</p>
                            </div>
                          </div>
                          <Toggle checked={settings.leaderboardVisible} onChange={() => setSettings((s) => ({ ...s, leaderboardVisible: !s.leaderboardVisible }))} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-3">Danger Zone</h4>
                      <div className="bg-rose-950/10 rounded-2xl border border-rose-500/20 p-4 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-200">Reset Progress</p>
                          <p className="text-[11px] text-gray-500">Clears gold, sets, and shop items.</p>
                        </div>
                        {/* ADDED CONFIRMATION MODAL LOGIC HERE */}
                        <button onClick={resetProgress} className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 bg-rose-500/10 px-3 py-2 rounded-lg border border-rose-500/30 hover:bg-rose-500/20 transition-colors shrink-0 ml-3">
                          <RotateCcw size={13} /> <span>Reset</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: ABOUT US */}
              {activeTab === 'about' && (
                <div className="px-6 pb-6 pt-24 animate-fade">
                  <h2 className="text-2xl font-black mb-6">About Us</h2>

                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                      <Dumbbell size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg font-black">The RPG Fitness Experience</h3>
                    <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
                  </div>

                  <p className="text-sm text-gray-400 leading-relaxed mb-6">
                    Built for warriors who'd rather grind XP than count reps in silence. Every set earns progress, every streak protects your rank, and every milestone unlocks something worth showing off.
                  </p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 p-4">
                      <span className="text-sm text-gray-300">Contact Support</span>
                      <span className="text-xs text-rose-400 font-medium">support@fittrack.com</span>
                    </div>
                    <button className="w-full flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                      <span className="text-sm text-gray-300">Privacy Policy</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </button>
                    <button className="w-full flex items-center justify-between bg-gray-900 rounded-xl border border-gray-800 p-4 hover:border-gray-700 transition-colors">
                      <span className="text-sm text-gray-300">Terms of Service</span>
                      <ChevronRight size={16} className="text-gray-500" />
                    </button>
                  </div>

                  {/* ADDED SPACING AND UPWORK LINK HERE */}
                  <div className="mt-12 pb-32 text-center flex flex-col items-center justify-center border-t border-gray-800 pt-8">
                    <p className="text-gray-500 text-xs tracking-widest uppercase mb-1">
                      Designed & Built By
                    </p>
                    <h3 className="font-bold text-white text-lg">Nahom</h3>
                    <p className="text-gray-400 text-sm mt-1">
                      Available for freelance work on{' '}
                      <a
                        href="https://www.upwork.com/freelancers/~01YOURPROFILEID" // <-- UPDATE THIS LINK
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#14a800] hover:underline font-medium transition-all"
                      >
                        Upwork
                      </a>
                    </p>
                  </div>
                </div>
              )}

            </div>

            {/* FLOATING TOP CONTROLS — fixed in place; everything else scrolls beneath them */}
            {(activeTab === 'settings' || activeTab === 'about' || activeTab === 'profile') && (
              <button
                onClick={() => setActiveTab('home')}
                className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-700 flex items-center justify-center text-gray-300 hover:text-white active:scale-95 transition-all shadow-lg"
              >
                <ArrowLeft size={18} />
              </button>
            )}

            {activeTab === 'home' && (
              <button
                onClick={() => setShowAccountMenu(true)}
                className="absolute top-6 right-6 z-30 w-11 h-11 active:scale-95 transition-transform"
              >
                {purchasedItems.includes('item_2') && (
                  <span className="absolute inset-[-2px] rounded-full bg-[conic-gradient(from_0deg,#f43f5e,#a855f7,#22d3ee,#f43f5e)] animate-spin" style={{ animationDuration: '3s' }} />
                )}
                <span className={`absolute flex items-center justify-center rounded-full overflow-hidden ${
                  purchasedItems.includes('item_2') ? 'inset-[2px]' : 'inset-0 border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                }`}>
                  <AvatarGlyph config={avatarConfig} size={18} />
                </span>
              </button>
            )}

            {/* FIXED BOTTOM NAVIGATION BAR */}
            <div className="flex-none absolute bottom-0 w-full bg-gray-950/95 backdrop-blur-md border-t border-gray-800 p-4 pb-6 flex justify-between items-center z-20 px-6">
              <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center transition-colors ${activeTab === 'home' ? 'text-rose-500' : 'text-gray-500 hover:text-gray-300'}`}>
                <Home size={18} className="mb-1" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Home</span>
              </button>
              
              <button onClick={() => setActiveTab('calendar')} className={`flex flex-col items-center transition-colors ${activeTab === 'calendar' ? 'text-rose-500' : 'text-gray-500 hover:text-gray-300'}`}>
                <Calendar size={18} className="mb-1" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Log</span>
              </button>

              <button onClick={() => setActiveTab('workouts')} className={`p-4 rounded-full shadow-lg transform -translate-y-5 border-4 border-gray-900 transition-all ${activeTab === 'workouts' ? 'bg-gradient-to-r from-rose-400 to-purple-500 scale-110' : 'bg-gradient-to-r from-rose-600 to-purple-700'}`}>
                <Dumbbell size={20} className="text-white block" />
              </button>

              <button onClick={() => setActiveTab('leaderboard')} className={`flex flex-col items-center transition-colors ${activeTab === 'leaderboard' ? 'text-rose-500' : 'text-gray-500 hover:text-gray-300'}`}>
                <Trophy size={18} className="mb-1" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Rank</span>
              </button>

              <button onClick={() => setActiveTab('shop')} className={`flex flex-col items-center transition-colors ${activeTab === 'shop' ? 'text-rose-500' : 'text-gray-500 hover:text-gray-300'}`}>
                <ShoppingBag size={18} className="mb-1" />
                <span className="text-[9px] font-bold tracking-wider uppercase">Shop</span>
              </button>
            </div>

            {/* ACCOUNT DROPDOWN MENU */}
            {showAccountMenu && (
              <>
                <div className="absolute inset-0 z-40" onClick={() => setShowAccountMenu(false)} />
                <div className="absolute top-20 right-6 z-50 w-56 bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl overflow-hidden animate-fade">
                  <button
                    onClick={() => { setActiveTab('profile'); setShowAccountMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left"
                  >
                    <User size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">Profile</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('settings'); setShowAccountMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left border-t border-gray-800"
                  >
                    <SettingsIcon size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">Settings</span>
                  </button>
                  <button
                    onClick={() => { setActiveTab('about'); setShowAccountMenu(false); }}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-800 transition-colors text-left border-t border-gray-800"
                  >
                    <Info size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-200">About Us</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-rose-950/30 transition-colors text-left border-t border-gray-800"
                  >
                    <LogOut size={18} className="text-rose-400" />
                    <span className="text-sm font-medium text-rose-400">Log Out</span>
                  </button>
                </div>
              </>
            )}

          </div>
        )}
        {/* This is the Modal that only shows when showResetModal is true */}
          {showResetModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
              <div className="bg-gray-800 border border-gray-700 p-6 rounded-2xl w-full max-w-xs shadow-2xl">
                <h3 className="text-lg font-bold text-white mb-2">Reset Progress</h3>
                <p className="text-sm text-gray-400 mb-6">
                  Are you sure you want to reset all your progress? This action cannot be undone.
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // THIS IS WHERE YOUR ACTUAL RESET LOGIC GOES
                      try {
                        localStorage.removeItem('fittrack_save');
                      } catch (e) {
                        console.error('Could not clear saved progress', e);
                      }
                      window.location.reload();
                    }}
                    className="flex-1 px-4 py-2 bg-rose-600 rounded-lg text-sm font-medium hover:bg-rose-500 transition"
                  >
                    Confirm
                  </button>
                </div>
              </div>
             </div>
          )}

      </div>
    </div>
  );
}