"use client";

import React, { useState } from 'react';
import {
  User,
  Settings as SettingsIcon,
  Info,
  LogOut,
  Vibrate,
  Volume2,
  Bell,
  Shield,
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
  BarChart2
} from 'lucide-react';

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

export default function FullFitnessTracker() {
  // Navigation States
  const [currentView, setCurrentView] = useState<AppView>('welcome');
  const [authMode, setAuthMode] = useState<'signup' | 'login'>('signup');
  const [onboardingStep, setOnboardingStep] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  
  // App States
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [currency, setCurrency] = useState<number>(350); // Gamified Credits/Gems
  
  // Set-by-Set Logging State
  // Tracking individual sets for each exercise ID
  const [workoutSets, setWorkoutSets] = useState<{ [key: number]: boolean[] }>({
    0: [true, false, false, false], // Pseudo-Planche Pushups (4 sets)
    1: [true, true, false],         // Diamond Pushups (3 sets)
    2: [false, false, false, false]  // Dumbbell Rows (4 sets)
  });

  const [settings, setSettings] = useState({
    vibration: true,
    sound: true,
    autoRestTimer: true,
    dailyReminder: true,
    streakAlerts: true,
    leaderboardVisible: true,
    units: 'kg' as 'kg' | 'lb',
  });

  // Onboarding Form States
  const [age, setAge] = useState<string>('22');
  const [weight, setWeight] = useState<string>('70');
  const [maxPushups, setMaxPushups] = useState<number>(20);
  const [experience, setExperience] = useState<string>('advanced');

  // --- NAVIGATION LOGIC ---
  const nextOnboardingStep = () => {
    if (onboardingStep < 3) {
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

  const toggleSetCompletion = (exerciseId: number, setIndex: number) => {
    setWorkoutSets(prev => {
      const updatedSets = [...prev[exerciseId]];
      updatedSets[setIndex] = !updatedSets[setIndex];
      
      // Reward user with gamified currency for completing a set
      if (updatedSets[setIndex]) {
        setCurrency(c => c + 10);
      } else {
        setCurrency(c => Math.max(0, c - 10));
      }

      return { ...prev, [exerciseId]: updatedSets };
    });
  };

  // --- MOCK DATA ---
  const workoutData = [
    {
      id: 0,
      title: "Pseudo-Planche Pushups",
      desc: "4 Sets • 8-10 Reps",
      icon: Dumbbell,
      imgSrc: "/download (2).jpg",
      steps: [
        "Place hands closer to hips, fingers pointing outward.",
        "Lean forward so shoulders extend far past wrists.",
        "Lower body while maintaining a strict hollow core."
      ]
    },
    {
      id: 1,
      title: "Diamond Pushups",
      desc: "3 Sets • 15 Reps",
      icon: TargetIcon, // Placeholder map helper
      imgSrc: "/download (1).jpg",
      steps: [
        "Form a diamond shape with your thumbs and index fingers.",
        "Keep elbows tucked tightly to your ribs.",
        "Press up explosively through the triceps."
      ]
    },
    {
      id: 2,
      title: "Dumbbell Rows",
      desc: "4 Sets • 12 Reps • 16kg",
      icon: BarChart2,
      imgSrc: "/download (3).jpg",
      steps: [
        "Hinge at the hips keeping a flat, braced back.",
        "Pull the weight toward your hip crease, not your chest.",
        "Squeeze the lat at the top for 1 second."
      ]
    }
  ];

  // Leaderboard Mock Data
  const leaderboardData = [
    { rank: 1, name: "Vanguard_Overlord", xp: "142,050", streak: 120, avatarColor: "from-yellow-400 to-amber-600", isMe: false },
    { rank: 2, name: "SleeperBuildPro", xp: "128,400", streak: 84, avatarColor: "from-purple-500 to-indigo-600", isMe: false },
    { rank: 3, name: "CalisthenicsKing", xp: "115,900", streak: 56, avatarColor: "from-cyan-400 to-blue-600", isMe: false },
    { rank: 4, name: "Nahom", xp: "98,350", streak: 28, avatarColor: "from-rose-500 to-purple-600", isMe: true },
    { rank: 5, name: "HollowBodyWarrior", xp: "84,100", streak: 19, avatarColor: "from-emerald-400 to-teal-600", isMe: false },
  ];

  // Shop Mock Data
  const shopItems = [
    { id: 'item_1', name: 'Streak Freeze Matrix', price: 150, desc: 'Prevents streak loss if you miss an active training window.', icon: Flame, purchased: false, color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
    { id: 'item_2', name: 'Cybernetic Avatar Border', price: 250, desc: 'Equip a neon animated halo glow around your profile token.', icon: Sparkles, purchased: true, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20' },
    { id: 'item_3', name: 'Shadow Overlord Aura', price: 500, desc: 'Unlocks custom visual design profiles across community ranking feeds.', icon: Crown, purchased: false, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20' },
  ];

  // Calendar mock data
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    if (i > 27) return { date: i + 1, status: 0 }; 
    if (i % 7 === 0 || i % 7 === 4) return { date: i + 1, status: 1 }; 
    if (i === 14) return { date: i + 1, status: 3 }; 
    return { date: i + 1, status: 2 }; 
  });

  // Custom Icon Selector to fix map reference inside component loops
  function TargetIcon({ className }: { className?: string }) {
    return <Dumbbell className={className} />;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white font-sans flex justify-center items-center p-0 sm:p-4">
      
      {/* INJECTED CSS ANIMATIONS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade { animation: fadeIn 0.4s ease-out forwards; }
        
        @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scan-overlay { background: linear-gradient(to bottom, transparent 40%, rgba(244, 63, 94, 0.1) 50%, transparent 60%); animation: scanline 3s linear infinite; }

        @keyframes subtleZoom { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .animate-anatomical { animation: subtleZoom 4s ease-in-out infinite; filter: invert(0.95) hue-rotate(180deg) contrast(1.2); }
        
        @keyframes fillRing { from { stroke-dasharray: 0, 100; } to { stroke-dasharray: 75, 100; } }
        .animate-ring { animation: fillRing 1.5s ease-out forwards; }
      `}} />

      {/* MOBILE APP FRAME */}
      <div className="w-full max-w-md bg-gray-900 min-h-screen sm:min-h-[850px] sm:rounded-3xl shadow-2xl relative flex flex-col border border-gray-800 overflow-hidden">
        
        {/* ==========================================
            VIEW 1: WELCOME SCREEN
           ========================================== */}
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

        {/* ==========================================
            VIEW 2: LOGIN VIEW
           ========================================== */}
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

        {/* ==========================================
            VIEW 3: ONBOARDING
           ========================================== */}
        {currentView === 'onboarding' && (
          <div className="absolute inset-0 flex flex-col justify-between p-8 z-30 bg-gray-950 animate-fade">
            <div>
              <div className="flex justify-between items-center mt-4 mb-8">
                <button onClick={prevOnboardingStep} className="text-sm text-gray-400 hover:text-white">← Back</button>
                <div className="flex space-x-2">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className={`h-1.5 rounded-full transition-all duration-300 ${step <= onboardingStep ? 'w-6 bg-rose-500' : 'w-2 bg-gray-800'}`} />
                  ))}
                </div>
                <span className="text-xs font-mono text-gray-500">STEP {onboardingStep}/3</span>
              </div>

              {onboardingStep === 1 && (
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

              {onboardingStep === 2 && (
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

              {onboardingStep === 3 && (
                <div className="space-y-6 animate-fade">
                  <div>
                    <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest block mb-1">Class Archetype</span>
                    <h2 className="text-2xl font-black">Training Background?</h2>
                  </div>
                  <div className="space-y-3 pt-2">
                    {[
                      { id: 'beginner', title: 'Recruit', icon: Circle, desc: "New to calisthenics — we'll start you light." },
                      { id: 'intermediate', title: 'Skilled Gladiator', icon: TargetIcon, desc: 'Comfortable with the bodyweight basics.' },
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
                {onboardingStep === 3 ? 'Generate Base Attributes' : 'Next Attribute'} →
              </button>
            </div>
          </div>
        )}

        {/* ==========================================
            VIEW 4: FULL APP DASHBOARD (TABS)
           ========================================== */}
        {currentView === 'dashboard' && (
          <div className="flex-1 flex flex-col h-full bg-gray-950 relative">
            
            {/* TAB: HOME */}
            {activeTab === 'home' && (
              <div className="flex-1 overflow-y-auto pb-24 animate-fade">
                <div className="p-6 bg-gradient-to-b from-gray-800 to-gray-900 rounded-b-3xl shadow-lg border-b border-gray-800">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Welcome back,</p>
                      <h1 className="text-2xl font-black text-white">Nahom</h1>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 flex items-center space-x-1.5">
                        <Sparkles size={14} className="text-yellow-400 animate-pulse" />
                        <span className="text-xs font-mono font-bold text-yellow-400">{currency}G</span>
                      </div>
                      <button
                        onClick={() => setShowAccountMenu(true)}
                        className="w-11 h-11 rounded-full border-2 border-rose-500 bg-gray-800 flex items-center justify-center overflow-hidden shadow-[0_0_15px_rgba(244,63,94,0.3)] active:scale-95 transition-transform"
                      >
                        <User size={18} className="text-rose-400" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-950 rounded-2xl p-5 border border-gray-800 flex items-center justify-between shadow-inner">
                    <div>
                      <h3 className="text-sm font-bold text-gray-300">Daily Target</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Upper Body Focus</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex items-center space-x-2">
                          <Flame size={14} className="text-rose-500" />
                          <span className="text-xs font-medium">450 / 600 kcal</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap size={14} className="text-purple-500" />
                          <span className="text-xs font-medium">45 / 60 mins</span>
                        </div>
                      </div>
                    </div>
                    <div className="relative w-24 h-24">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="3" />
                        <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f43f5e" strokeWidth="3" strokeDasharray="75, 100" className="animate-ring" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black">75%</span>
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
                    <button onClick={() => setActiveTab('calendar')} className="text-xs bg-gray-900 px-3 py-1.5 rounded-lg font-bold hover:bg-gray-700 transition">View Log</button>
                  </div>

                  <button onClick={() => setActiveTab('workouts')} className="w-full bg-gradient-to-r from-rose-500 to-purple-600 p-4 rounded-2xl font-black shadow-lg flex justify-between items-center group">
                    <div className="text-left">
                      <span className="block text-xl">Resume Workout</span>
                      <span className="text-xs text-white/70 font-medium">Progress matrix active</span>
                    </div>
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            )}

            {/* TAB: CALENDAR (High-Fidelity Matrix Interface) */}
            {activeTab === 'calendar' && (
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-2xl font-black">Training Log</h2>
                    <p className="text-sm text-gray-400">June 2026</p>
                  </div>
                  <BarChart2 size={22} className="text-rose-500" />
                </div>

                {/* Apple Fitness Inspired Ring Historical Row (Derived from preview.webp Layout) */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 mb-4 flex justify-between items-center overflow-x-auto gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center space-y-2 shrink-0">
                      <span className="text-[10px] font-bold text-gray-500">{day}</span>
                      <div className="relative w-8 h-8">
                        <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                          <circle cx="18" cy="18" r="16" fill="none" stroke="#2a2a35" strokeWidth="4" />
                          <circle cx="18" cy="18" r="16" fill="none" stroke={idx % 3 === 0 ? "#ef4444" : "#10b981"} strokeWidth="4" strokeDasharray={idx % 2 === 0 ? "70 100" : "100 100"} />
                        </svg>
                      </div>
                    </div>
                  ))}
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
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                          ${day.status === 0 ? 'text-gray-600 hover:bg-gray-700' : ''} 
                          ${day.status === 1 ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : ''} 
                          ${day.status === 2 ? 'bg-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.4)]' : ''} 
                          ${day.status === 3 ? 'bg-gray-900 border border-red-500/50 text-red-500' : ''} 
                        `}>
                          {day.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Micro Histogram Inspired by preview (1).webp and preview (2).webp metrics */}
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
                </div>
              </div>
            )}

            {/* TAB: WORKOUTS (Execution View with Set Logging and Micro-States) */}
            {activeTab === 'workouts' && (
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                 <div className="flex justify-between items-end mb-6">
                    <div>
                      <h2 className="text-xl font-bold tracking-tight">Today's Target</h2>
                      <p className="text-sm text-gray-400">Push Day Matrix</p>
                    </div>
                    <span className="text-xs text-rose-400 font-bold uppercase tracking-wider bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">Active</span>
                  </div>

                  <div className="space-y-4">
                    {workoutData.map((workout, index) => {
                      const sets = workoutSets[workout.id] || [];
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
                            <div className="px-4 pb-4 pt-2 border-t border-gray-700/50 bg-gray-800/40 space-y-4">
                              {/* Set Logging Micro-State Interaction Grid */}
                              <div>
                                <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">Track Sub-Sets</h4>
                                <div className="grid grid-cols-1 gap-2">
                                  {sets.map((setDone, setIdx) => (
                                    <div 
                                      key={setIdx}
                                      onClick={() => toggleSetCompletion(workout.id, setIdx)}
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
                                          {workout.id === 2 ? '12 Reps • 16kg' : workout.id === 1 ? '15 Reps' : '8-10 Reps'}
                                        </span>
                                      </div>
                                      
                                      {/* Micro-state interactive item check */}
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

                              <div className="relative w-full h-48 bg-[#0a0a0a] rounded-xl overflow-hidden border border-gray-700 flex items-center justify-center mt-2">
                                <img src={encodeURI(workout.imgSrc)} alt={workout.title} className="w-full h-full object-contain p-2 animate-anatomical" />
                                <div className="absolute inset-0 scan-overlay pointer-events-none" />
                                <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-rose-500/30 text-rose-400 flex items-center space-x-1 backdrop-blur-sm z-10">
                                  <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse mr-1"></span> Muscular Scan Active
                                </div>
                              </div>
                              <div className="space-y-2">
                                {workout.steps.map((step, stepIdx) => (
                                  <div key={stepIdx} className="flex items-start space-x-3">
                                    <div className="w-5 h-5 rounded-full bg-gray-700 text-gray-300 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{stepIdx + 1}</div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{step}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
              </div>
            )}

            {/* NEW TAB: LEADERBOARD / RANK SCREEN */}
            {activeTab === 'leaderboard' && (
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-black">Global Arena</h2>
                    <p className="text-sm text-gray-400">Ranks refresh in 4h 12m</p>
                  </div>
                  <Trophy size={24} className="text-yellow-500 animate-bounce" />
                </div>

                <div className="space-y-3">
                  {leaderboardData.map((warrior) => (
                    <div 
                      key={warrior.rank}
                      className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                        warrior.isMe 
                          ? 'bg-gradient-to-r from-rose-950/30 to-purple-950/30 border-rose-500 shadow-md shadow-rose-500/10' 
                          : 'bg-gray-900 border-gray-800'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <span className={`text-sm font-mono font-black w-5 text-center ${
                          warrior.rank === 1 ? 'text-yellow-400 text-base' : warrior.rank === 2 ? 'text-gray-300' : warrior.rank === 3 ? 'text-amber-600' : 'text-gray-500'
                        }`}>
                          #{warrior.rank}
                        </span>
                        <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${warrior.avatarColor} flex items-center justify-center shadow-inner`}>
                          <User size={14} className="text-white" />
                        </div>
                        <div>
                          <h4 className={`text-sm font-bold ${warrior.isMe ? 'text-rose-400' : 'text-gray-200'}`}>
                            {warrior.name} {warrior.isMe && <span className="text-[10px] font-mono text-purple-400 ml-1 border border-purple-500/30 px-1 py-0.5 rounded bg-purple-500/10">YOU</span>}
                          </h4>
                          <p className="text-[10px] text-gray-500 flex items-center">
                            <Flame size={10} className="text-orange-500 mr-0.5" /> {warrior.streak} Day Streak
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="block text-xs font-mono font-black text-gray-200">{warrior.xp}</span>
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Power XP</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* NEW TAB: ITEM SHOP / STORE SCREEN */}
            {activeTab === 'shop' && (
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
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
                          {item.purchased ? (
                            <button disabled className="bg-gray-800 text-gray-500 text-xs px-4 py-2 rounded-xl font-bold border border-gray-700 flex items-center space-x-1">
                              <Lock size={12} /> <span>Equipped</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => {
                                if (currency >= item.price) {
                                  setCurrency(c => c - item.price);
                                  item.purchased = true;
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
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-black">Commander Profile</h2>
                  <button onClick={handleLogout} className="text-xs font-bold text-gray-500 hover:text-rose-500 bg-gray-800 px-3 py-1.5 rounded-lg transition-colors border border-gray-700">
                    Log Out
                  </button>
                </div>
                
                <div className="bg-gray-800 p-5 rounded-2xl border border-gray-700 text-center relative overflow-hidden mb-6">
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>
                  <div className="w-20 h-20 mx-auto rounded-full border-4 border-purple-500 flex items-center justify-center bg-gray-900 mb-3 shadow-[0_0_20px_rgba(168,85,247,0.4)]">
                    <Crown size={32} className="text-purple-400" />
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
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                <div className="flex items-center space-x-3 mb-6">
                  <button onClick={() => setActiveTab('home')} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-black">Settings</h2>
                </div>

                <div className="space-y-6">
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
                </div>
              </div>
            )}

            {/* TAB: ABOUT US */}
            {activeTab === 'about' && (
              <div className="flex-1 overflow-y-auto pb-24 p-6 animate-fade">
                <div className="flex items-center space-x-3 mb-6">
                  <button onClick={() => setActiveTab('home')} className="text-gray-400 hover:text-white">
                    <ArrowLeft size={20} />
                  </button>
                  <h2 className="text-2xl font-black">About Us</h2>
                </div>

                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 text-center mb-6">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-rose-500 to-purple-600 flex items-center justify-center mb-4 shadow-lg">
                    <Dumbbell size={28} className="text-white" />
                  </div>
                  <h3 className="text-lg font-black">The RPG Fitness Experience</h3>
                  <p className="text-xs text-gray-500 mt-1">Version 1.0.0</p>
                </div>
              </div>
            )}

            {/* FIVE-BUTTON PREMIUM NAVIGATION BAR */}
            <div className="absolute bottom-0 w-full bg-gray-950/95 backdrop-blur-md border-t border-gray-800 p-4 pb-6 flex justify-between items-center z-20 px-6">
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

      </div>
    </div>
  );
}