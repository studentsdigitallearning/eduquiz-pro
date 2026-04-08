'use client';

import React, { useEffect, useState, useCallback, useRef, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, Bell, Share2, X, ChevronLeft, ChevronRight, Lock,
  Home, Newspaper, Target, Briefcase, Trophy, Star,
  Clock, CheckCircle2, XCircle, SkipForward, Award,
  Download, ExternalLink, FileText, Video, Link as LinkIcon,
  MessageCircle, Send, Play, RotateCcw, Eye, Volume2,
  BookOpen, GraduationCap, Users, Shield, Info, Mail,
  Phone, MapPin, Globe, ArrowLeft, Zap, BarChart3,
  Crown, Medals, Flame, ChevronDown
} from 'lucide-react';
import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

// ─── Custom useFetch hook (avoids sync setState in effects) ──
function useFetch<T>(url: string | null, enabled: boolean = true) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!url || !enabled) return;
    let cancelled = false;
    startTransition(() => { setData(null); setLoading(true); });
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (!cancelled) { setData(d); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [url, enabled, startTransition]);

  return { data, loading, setData };
}

// ─── Types ─────────────────────────────────────────
interface Category { id: string; title: string; description?: string; iconUrl?: string; categoryType: string; colorCode: string; isNew: boolean; _count?: { courses: number } }
interface Course { id: string; name: string; description?: string; categoryId: string; _count?: { subjects: number; syllabus: number; dailyTests: number; mockTests: number } }
interface Subject { id: string; name: string; nameHindi?: string; courseId: string; _count?: { sets: number } }
interface Set { id: string; title: string; titleHindi?: string; subjectId: string; totalQuestions: number; durationMinutes?: number; isLocked: boolean; unlockType: string; _count?: { questions: number } }
interface Question { id: string; questionText: string; optionA?: string; optionB?: string; optionC?: string; optionD?: string; correctAnswer: string; explanation?: string; marks: number; negativeMarks: number }
interface DailyTest { id: string; courseId: string; testDate: string; language: string; totalQuestions: number; durationMinutes: number; isLocked: boolean; _count?: { questions: number } }
interface MockTest { id: string; courseId: string; title: string; description?: string; totalQuestions: number; durationMinutes: number; fullMock: boolean; _count?: { questions: number } }
interface PreviousPaper { id: string; courseId: string; examYear: number; examMonth?: string; title: string; isDownloadable: boolean; subject?: { id: string; name: string } }
interface SyllabusItem { id: string; courseId: string; title: string; fileType: string; externalLink?: string; fileUrl?: string; isDownloadable: boolean; badgeColor?: string; badgeText?: string }
interface UpdateSection { id: string; title: string; iconUrl?: string; items: UpdateItem[] }
interface UpdateItem { id: string; title: string; subtitle?: string; status: string; publishedDate: string; buttons: UpdateButton[] }
interface UpdateButton { id: string; label: string; buttonType: string; url?: string; action?: string }
interface Notification { id: string; title: string; message?: string; notificationType: string; link?: string; priority: string; publishedDate: string }

// ─── Gradient Colors for set badges ───────────────
const setGradients = [
  'from-red-500 to-rose-600',
  'from-pink-500 to-fuchsia-600',
  'from-purple-500 to-violet-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-teal-600',
  'from-emerald-500 to-green-600',
  'from-amber-500 to-orange-600',
  'from-lime-500 to-green-600',
];

// ─── Header Component ──────────────────────────────
function AppHeader() {
  const { currentView, sidebarOpen, setSidebarOpen, siteSettings, navigate } = useAppStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const showBack = !['home', 'updates', 'mock-test', 'jobs', 'daily-test', 'daily-result'].includes(currentView);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#4a5b7a] flex items-center justify-between px-3 pt-safe shadow-md">
        <div className="flex items-center gap-2">
          {showBack ? (
            <button onClick={() => useAppStore.getState().goBack()} className="text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <button onClick={() => setSidebarOpen(true)} className="text-white p-1 rounded-lg hover:bg-white/10 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
          )}
        </div>
        <h1 className="text-white font-bold text-[17px] truncate max-w-[200px]">
          {siteSettings?.siteName || 'EduQuiz Pro'}
        </h1>
        <div className="flex items-center gap-1">
          <button onClick={() => navigate('notifications')} className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors relative">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => { if (navigator.share) { navigator.share({ title: siteSettings?.siteName, url: window.location.href }); }}} className="text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Notification dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-14 right-3 z-50 w-72 bg-white rounded-xl shadow-xl border p-3"
          >
            <p className="text-sm font-medium text-gray-700">Notifications</p>
            <p className="text-xs text-gray-500 mt-1">Tap bell icon to see all</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Sidebar Component ─────────────────────────────
function Sidebar() {
  const { sidebarOpen, setSidebarOpen, siteSettings, navigate } = useAppStore();

  const menuItems = [
    { label: 'Home', icon: Home, action: () => { navigate('home'); setSidebarOpen(false); } },
    { label: 'Share App', icon: Share2, action: () => { if (navigator.share) navigator.share({ title: siteSettings?.siteName, url: window.location.href }); setSidebarOpen(false); } },
    { label: 'Rate App', icon: Star, action: () => { setSidebarOpen(false); } },
  ];

  const policyItems = [
    { label: 'Privacy Policy', view: 'privacy' },
    { label: 'About Us', view: 'about' },
    { label: 'Terms & Conditions', view: 'terms' },
    { label: 'Disclaimer', view: 'disclaimer' },
    { label: 'Contact Us', view: 'contact' },
  ];

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 z-50 w-[280px] bg-white shadow-2xl flex flex-col"
          >
            {/* Logo area */}
            <div className="bg-[#4a5b7a] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">{siteSettings?.siteName || 'EduQuiz Pro'}</h2>
                  <p className="text-white/60 text-xs">Premium Learning App</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-white p-1 rounded-lg hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Menu items */}
            <div className="flex-1 overflow-y-auto p-3">
              <div className="space-y-1">
                {menuItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={item.action}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="my-3">
                <Separator />
              </div>

              <p className="px-3 text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">More</p>
              <div className="space-y-1">
                {policyItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => { navigate(item.view); setSidebarOpen(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                  >
                    <Info className="w-5 h-5 text-gray-500" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* App version */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-xs text-gray-400 text-center">Version 1.0.0</p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Bottom Navigation ─────────────────────────────
function BottomNav() {
  const { currentView, navigate } = useAppStore();
  const isQuiz = ['quiz', 'mock-quiz', 'daily-quiz'].includes(currentView);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'updates', label: 'Updates', icon: Newspaper },
    { id: 'mock-test', label: 'Mock Test', icon: Target },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
  ];

  if (isQuiz) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-14">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl transition-all duration-200 min-w-[64px] ${
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-medium ${isActive ? 'text-green-600' : ''}`}>
                {item.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="navIndicator"
                  className="absolute -bottom-px left-1/2 -translate-x-1/2 w-8 h-0.5 bg-green-600 rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// ─── Floating Action Buttons ───────────────────────
function FloatingActions() {
  const { currentView, siteSettings } = useAppStore();
  const isQuiz = ['quiz', 'mock-quiz', 'daily-quiz'].includes(currentView);

  if (isQuiz) return null;

  return (
    <div className="fixed bottom-20 right-4 z-30 flex flex-col gap-2">
      {siteSettings?.whatsappLink && (
        <a
          href={siteSettings.whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-all hover:scale-105 animate-pulse-green"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      )}
      {siteSettings?.telegramLink && (
        <a
          href={siteSettings.telegramLink}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all hover:scale-105"
        >
          <Send className="w-6 h-6 text-white" />
        </a>
      )}
    </div>
  );
}

// ─── Loading Skeletons ─────────────────────────────
function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
          <Skeleton className="w-16 h-16 rounded-2xl mx-auto mb-3" />
          <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
          <Skeleton className="h-3 w-1/2 mx-auto" />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
          <Skeleton className="w-14 h-14 rounded-xl shrink-0" />
          <div className="flex-1">
            <Skeleton className="h-4 w-3/4 mb-2" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page Transition Wrapper ───────────────────────
function PageTransition({ children, keyStr }: { children: React.ReactNode; keyStr: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyStr}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="min-h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 1: HOME VIEW
// ═══════════════════════════════════════════════════
function HomeView() {
  const { categories, setCategories, navigate, siteSettings } = useAppStore();
  const { data: fetchedCats, loading } = useFetch<Category[]>('/api/categories');

  useEffect(() => {
    if (fetchedCats && fetchedCats.length > 0 && categories.length === 0) {
      setCategories(fetchedCats);
    }
  }, [fetchedCats, categories.length, setCategories]);

  const handleCategoryTap = (cat: Category) => {
    switch (cat.categoryType) {
      case 'mcq':
        navigate('courses', { selectedCategoryId: cat.id });
        break;
      case 'syllabus':
        navigate('syllabus', { selectedCategoryId: cat.id });
        break;
      case 'updates':
        navigate('updates');
        break;
      case 'daily_test':
        navigate('daily-test', { selectedCategoryId: cat.id });
        break;
      case 'daily_result':
        navigate('daily-result', { selectedCategoryId: cat.id });
        break;
      case 'previous_papers':
        navigate('previous-papers', { selectedCategoryId: cat.id });
        break;
      case 'mock_test':
        navigate('mock-test', { selectedCategoryId: cat.id });
        break;
      case 'jobs':
        navigate('jobs');
        break;
      default:
        navigate('courses', { selectedCategoryId: cat.id });
    }
  };

  return (
    <PageTransition keyStr="home">
      <div className="p-3 space-y-4">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-[#4a5b7a] to-[#5a6d8a] rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold mb-1">Welcome to {siteSettings?.siteName || 'EduQuiz Pro'}! 🎓</h2>
          <p className="text-white/80 text-sm">Practice MCQs, take daily tests & ace your exams</p>
        </div>

        {loading && categories.length === 0 ? (
          <CategorySkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleCategoryTap(cat)}
                className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md active:scale-[0.97] transition-all duration-200 text-center relative"
              >
                {cat.isNew && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                <div className="text-4xl mb-2">{cat.iconUrl || '📝'}</div>
                <h3 className="text-sm font-semibold text-gray-800 leading-tight">{cat.title}</h3>
                {cat._count && cat._count.courses > 0 && (
                  <p className="text-[11px] text-gray-400 mt-1">{cat._count.courses} courses</p>
                )}
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 2: COURSES VIEW
// ═══════════════════════════════════════════════════
function CoursesView() {
  const { selectedCategoryId, courses, setCourses, navigate } = useAppStore();
  const { data: fetchedCourses, loading } = useFetch<Course[] | null>(
    selectedCategoryId ? `/api/courses?categoryId=${selectedCategoryId}` : null
  );

  useEffect(() => {
    if (fetchedCourses) setCourses(fetchedCourses);
  }, [fetchedCourses, setCourses]);

  return (
    <PageTransition keyStr="courses">
      <div className="p-3">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Select Course</h2>
        {loading && courses.length === 0 ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-3">
            {courses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate('subjects', { selectedCourseId: course.id })}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{course.name}</h3>
                  {course.description && <p className="text-xs text-gray-500 truncate mt-0.5">{course.description}</p>}
                  {course._count && (
                    <p className="text-[11px] text-gray-400 mt-1">
                      {course._count.subjects > 0 && `${course._count.subjects} subjects • `}
                      {course._count.syllabus > 0 && `${course._count.syllabus} syllabus`}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 3: SUBJECTS VIEW
// ═══════════════════════════════════════════════════
function SubjectsView() {
  const { selectedCourseId, subjects, setSubjects, navigate } = useAppStore();
  const { data: fetchedSubjects, loading } = useFetch<Subject[] | null>(
    selectedCourseId ? `/api/subjects?courseId=${selectedCourseId}` : null
  );

  useEffect(() => {
    if (fetchedSubjects) setSubjects(fetchedSubjects);
  }, [fetchedSubjects, setSubjects]);

  return (
    <PageTransition keyStr="subjects">
      <div className="p-3">
        <h2 className="text-lg font-bold text-gray-800 mb-3">Select Subject</h2>
        {loading && subjects.length === 0 ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-3">
            {subjects.map((subject, idx) => (
              <motion.div
                key={subject.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => navigate('sets', { selectedSubjectId: subject.id })}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${setGradients[idx % setGradients.length]}`}>
                  <span className="text-white font-bold text-lg">{idx + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">{subject.name}</h3>
                  {subject.nameHindi && <p className="text-xs text-gray-500 truncate mt-0.5">{subject.nameHindi}</p>}
                  {subject._count && (
                    <p className="text-[11px] text-gray-400 mt-1">{subject._count.sets} practice sets</p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 4: SETS VIEW
// ═══════════════════════════════════════════════════
function SetsView() {
  const { selectedSubjectId, sets, setSets, navigate, selectedLanguage, setSelectedLanguage } = useAppStore();
  const { data: fetchedSets, loading } = useFetch<Set[] | null>(
    selectedSubjectId ? `/api/sets?subjectId=${selectedSubjectId}` : null
  );

  useEffect(() => {
    if (fetchedSets) setSets(fetchedSets);
  }, [fetchedSets, setSets]);

  const handleSetTap = (set: Set) => {
    if (set.isLocked) return;
    navigate('quiz', {
      selectedSetId: set.id,
      selectedTestType: 'practice_set',
    });
  };

  return (
    <PageTransition keyStr="sets">
      <div className="p-3 space-y-3">
        {/* Language Toggle */}
        <div className="bg-white rounded-2xl p-3 shadow-sm flex items-center justify-center gap-2">
          <button
            onClick={() => setSelectedLanguage('hindi')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedLanguage === 'hindi'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            हिन्दी माध्यम
          </button>
          <button
            onClick={() => setSelectedLanguage('english')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedLanguage === 'english'
                ? 'bg-green-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-500'
            }`}
          >
            English Medium
          </button>
        </div>

        {loading && sets.length === 0 ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-3">
            {sets.map((set, idx) => (
              <motion.div
                key={set.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleSetTap(set)}
                className={`bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all duration-200 ${
                  set.isLocked ? 'opacity-70' : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br ${setGradients[idx % setGradients.length]}`}>
                  {set.isLocked ? <Lock className="w-5 h-5 text-white" /> : <span className="text-white font-bold text-lg">{idx + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-sm truncate">
                    {selectedLanguage === 'hindi' && set.titleHindi ? set.titleHindi : set.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {set._count?.questions || set.totalQuestions} Questions
                    {set.durationMinutes && ` • ${set.durationMinutes} min`}
                  </p>
                  <div className="flex gap-1.5 mt-1.5">
                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                      {set.difficulty === 'easy' ? '🟢 Easy' : set.difficulty === 'medium' ? '🟡 Medium' : '🔴 Hard'}
                    </Badge>
                    {set.unlockType !== 'free' && (
                      <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 border-amber-200">
                        {set.unlockType === 'ad_based' ? 'Ad' : 'Premium'}
                      </Badge>
                    )}
                  </div>
                </div>
                {!set.isLocked && <Play className="w-5 h-5 text-green-500 shrink-0" />}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 5: QUIZ VIEW (Universal quiz engine)
// ═══════════════════════════════════════════════════
function QuizView() {
  const {
    selectedSetId, selectedTestId, selectedTestType,
    quizQuestions, setQuizQuestions, currentQuestionIndex, setCurrentQuestionIndex,
    userAnswers, setUserAnswer, resetQuiz, setQuizResult, quizStartTime, navigate,
    quizTimeRemaining, setQuizTimeRemaining, sets, courses,
  } = useAppStore();
  const [showExplanation, setShowExplanation] = useState(false);
  const [showNavigator, setShowNavigator] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizTitle, setQuizTitle] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load questions
  useEffect(() => {
    if (quizQuestions.length > 0) { setLoading(false); return; }

    let fetchUrl = '';
    if (selectedTestType === 'daily_test' && selectedTestId) {
      fetchUrl = `/api/daily-tests/${selectedTestId}`;
    } else if (selectedTestType === 'mock_test' && selectedTestId) {
      fetchUrl = `/api/mock-tests/${selectedTestId}`;
    } else if (selectedSetId) {
      fetchUrl = `/api/questions?setId=${selectedSetId}`;
      // Get set title
      const s = sets.find((s: Set) => s.id === selectedSetId);
      if (s) setQuizTitle(s.title);
    }

    if (!fetchUrl) return;
    setLoading(true);

    fetch(fetchUrl)
      .then((r) => r.json())
      .then((data) => {
        // Handle both array responses and single object responses
        const questions = Array.isArray(data) ? data : (data.questions || []);
        setQuizQuestions(questions);

        // Set quiz title from test data
        if (data.title) setQuizTitle(data.title);
        else if (data.course) setQuizTitle(data.course.name);

        // Set timer if available
        if (data.durationMinutes && !quizStartTime) {
          setQuizTimeRemaining(data.durationMinutes * 60);
          setTimerActive(true);
        }

        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [selectedSetId, selectedTestId]);

  // Start quiz timer
  useEffect(() => {
    if (timerActive && quizTimeRemaining !== null && quizTimeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setQuizTimeRemaining(quizTimeRemaining - 1);
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    } else if (quizTimeRemaining === 0 || quizTimeRemaining === null) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (quizTimeRemaining === 0 && quizQuestions.length > 0 && Object.keys(userAnswers).length > 0) {
        finishQuiz();
      }
    }
  }, [timerActive, quizTimeRemaining]);

  const currentQ = quizQuestions[currentQuestionIndex];
  const isAnswered = userAnswers[currentQuestionIndex] !== undefined;
  const correctAnswer = currentQ?.correctAnswer;
  const userAnswer = userAnswers[currentQuestionIndex];

  const handleOptionSelect = (option: string) => {
    if (isAnswered) return;
    setUserAnswer(currentQuestionIndex, option);
    setShowExplanation(true);
  };

  const finishQuiz = useCallback(() => {
    if (quizQuestions.length === 0) return;
    const endTime = Date.now();
    const timeTaken = quizStartTime ? Math.floor((endTime - quizStartTime) / 1000) : 0;
    const totalTime = quizStartTime ? Math.floor((endTime - quizStartTime) / 1000) : 0;

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    let score = 0;

    quizQuestions.forEach((q: Question, idx: number) => {
      const ans = userAnswers[idx];
      if (!ans) {
        skipped++;
      } else if (ans === q.correctAnswer) {
        correct++;
        score += q.marks || 1;
      } else {
        wrong++;
        score -= q.negativeMarks || 0;
      }
    });

    const total = quizQuestions.length;
    const percentage = Math.max(0, Math.round((score / total) * 100));

    const result = {
      totalQuestions: total,
      correctAnswers: correct,
      wrongAnswers: wrong,
      skippedAnswers: skipped,
      totalScore: score,
      percentage,
      timeTakenSeconds: timeTaken,
      rank: null,
    };

    setQuizResult(result);
    setTimerActive(false);
    if (timerRef.current) clearInterval(timerRef.current);

    // Save result to API
    try {
      fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'guest_user',
          testId: selectedSetId || selectedTestId,
          testType: selectedTestType || 'practice_set',
          courseId: 'unknown',
          totalQuestions: total,
          correctAnswers: correct,
          wrongAnswers: wrong,
          skippedAnswers: skipped,
          totalScore: score,
          percentage,
          timeTakenSeconds: timeTaken,
          status: 'completed',
          testDate: new Date().toISOString(),
        }),
      });
    } catch (e) { /* silent */ }

    navigate('result');
  }, [quizQuestions, userAnswers, quizStartTime, selectedSetId, selectedTestId, selectedTestType]);

  const goNext = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowExplanation(false);
    } else {
      finishQuiz();
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-500 text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-500">No questions available</p>
      </div>
    );
  }

  const progress = ((currentQuestionIndex + 1) / quizQuestions.length) * 100;
  const options = [
    { key: 'A', text: currentQ.optionA },
    { key: 'B', text: currentQ.optionB },
    { key: 'C', text: currentQ.optionC },
    { key: 'D', text: currentQ.optionD },
  ].filter((o) => o.text);

  return (
    <div className="flex flex-col min-h-full">
      {/* Quiz Header */}
      <div className="bg-white border-b px-3 py-2">
        <h3 className="font-semibold text-gray-800 text-sm truncate">{quizTitle || 'Practice Quiz'}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-xs text-gray-500">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </span>
          {quizTimeRemaining !== null && (
            <span className={`text-xs font-mono font-bold ${quizTimeRemaining < 60 ? 'text-red-500' : 'text-gray-700'}`}>
              ⏱ {formatTime(quizTimeRemaining)}
            </span>
          )}
        </div>
        <div className="mt-1.5 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="flex-1 p-3 space-y-3">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <p className="text-gray-800 font-medium text-[15px] leading-relaxed">
            {currentQ.questionText}
          </p>
          {currentQ.marks > 0 && (
            <p className="text-[11px] text-gray-400 mt-2">+{currentQ.marks} marks {currentQ.negativeMarks > 0 && `| -${currentQ.negativeMarks} for wrong`}</p>
          )}
        </div>

        {/* Options */}
        <div className="space-y-2">
          {options.map((opt) => {
            const isCorrect = opt.key === correctAnswer;
            const isSelected = userAnswer === opt.key;
            const isWrong = isSelected && !isCorrect;

            let borderColor = 'border-gray-200 hover:border-green-300';
            let bgColor = 'bg-white';

            if (isAnswered) {
              if (isCorrect) {
                borderColor = 'border-green-500';
                bgColor = 'bg-green-50';
              } else if (isWrong) {
                borderColor = 'border-red-500';
                bgColor = 'bg-red-50';
              } else {
                borderColor = 'border-gray-200';
                bgColor = 'bg-gray-50';
              }
            } else if (isSelected) {
              borderColor = 'border-green-500';
              bgColor = 'bg-green-50';
            }

            return (
              <motion.button
                key={opt.key}
                whileTap={!isAnswered ? { scale: 0.98 } : undefined}
                onClick={() => handleOptionSelect(opt.key)}
                disabled={isAnswered}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${borderColor} ${bgColor} ${
                  !isAnswered ? 'cursor-pointer active:scale-[0.98]' : ''
                }`}
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                  isAnswered && isCorrect ? 'bg-green-500 text-white' :
                  isAnswered && isWrong ? 'bg-red-500 text-white' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {opt.key}
                </span>
                <span className="text-sm text-gray-700 flex-1">{opt.text}</span>
                {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />}
                {isAnswered && isWrong && <XCircle className="w-5 h-5 text-red-500 shrink-0" />}
              </motion.button>
            );
          })}
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {showExplanation && currentQ.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-green-50 border-l-4 border-green-500 rounded-r-xl p-3.5"
            >
              <p className="text-xs font-semibold text-green-700 mb-1">💡 Explanation</p>
              <p className="text-sm text-green-800 leading-relaxed">{currentQ.explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Question Navigator Toggle */}
      <div className="px-3 pb-2">
        <button
          onClick={() => setShowNavigator(!showNavigator)}
          className="w-full text-center text-xs text-gray-500 py-1"
        >
          {showNavigator ? 'Hide' : 'Show'} Question Navigator
        </button>
      </div>

      {/* Question Navigator */}
      <AnimatePresence>
        {showNavigator && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="px-3 pb-3"
          >
            <div className="bg-white rounded-2xl p-3 shadow-sm">
              <div className="grid grid-cols-5 sm:grid-cols-8 gap-2">
                {quizQuestions.map((q: Question, idx: number) => {
                  const ans = userAnswers[idx];
                  const isCurrent = idx === currentQuestionIndex;
                  const isCorrect = ans === q.correctAnswer;
                  const isWrong = ans && ans !== q.correctAnswer;

                  let cls = 'bg-gray-100 text-gray-600 border-gray-200';
                  if (isCurrent) cls = 'bg-green-500 text-white border-green-500';
                  else if (isCorrect) cls = 'bg-green-100 text-green-700 border-green-300';
                  else if (isWrong) cls = 'bg-red-100 text-red-700 border-red-300';

                  return (
                    <button
                      key={idx}
                      onClick={() => { setCurrentQuestionIndex(idx); setShowExplanation(!!userAnswers[idx]); }}
                      className={`w-9 h-9 rounded-lg border-2 text-xs font-bold flex items-center justify-center transition-all ${cls}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next Button */}
      <div className="p-3 pb-6">
        <Button
          onClick={goNext}
          className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 text-base font-semibold shadow-lg"
        >
          {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          <ChevronRight className="w-5 h-5 ml-1" />
        </Button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 6: RESULT VIEW
// ═══════════════════════════════════════════════════
function ResultView() {
  const { quizResult, resetQuiz, navigate } = useAppStore();
  const [animateScore, setAnimateScore] = useState(0);

  useEffect(() => {
    if (quizResult) {
      const timer = setTimeout(() => setAnimateScore(quizResult.percentage), 100);
      return () => clearTimeout(timer);
    }
  }, [quizResult]);

  if (!quizResult) {
    return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gray-500">No results</p></div>;
  }

  const { percentage, correctAnswers, wrongAnswers, skippedAnswers, timeTakenSeconds, rank } = quizResult;
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (animateScore / 100) * circumference;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const isPassed = percentage >= 60;

  return (
    <PageTransition keyStr="result">
      <div className="p-3 space-y-4">
        {/* Score Circle */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            className="relative w-32 h-32 mx-auto"
          >
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none"
                stroke={isPassed ? '#22c55e' : percentage >= 40 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${isPassed ? 'text-green-600' : 'text-red-500'}`}>
                {animateScore}%
              </span>
              <span className="text-xs text-gray-500">Score</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-bold mt-4">
              {isPassed ? '🎉 Congratulations!' : 'Keep Practicing!'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {isPassed ? 'Great job! You passed the quiz.' : 'Don\'t worry, try again to improve your score.'}
            </p>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="bg-green-50 rounded-2xl p-4 text-center border border-green-100"
          >
            <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
            <p className="text-xs text-green-700">Correct</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-red-50 rounded-2xl p-4 text-center border border-red-100"
          >
            <XCircle className="w-6 h-6 text-red-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-600">{wrongAnswers}</p>
            <p className="text-xs text-red-700">Wrong</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-gray-50 rounded-2xl p-4 text-center border border-gray-200"
          >
            <SkipForward className="w-6 h-6 text-gray-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-600">{skippedAnswers}</p>
            <p className="text-xs text-gray-500">Skipped</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100"
          >
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-blue-600">{formatTime(timeTakenSeconds)}</p>
            <p className="text-xs text-blue-700">Time Taken</p>
          </motion.div>
        </div>

        {rank && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-amber-50 rounded-2xl p-4 text-center border border-amber-100"
          >
            <Trophy className="w-6 h-6 text-amber-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-amber-600">Rank #{rank}</p>
            <p className="text-xs text-amber-700">Your Ranking</p>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2 pb-4">
          <Button
            onClick={() => navigate('quiz')}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-12 font-semibold"
          >
            <Eye className="w-4 h-4 mr-2" /> Review Answers
          </Button>
          <Button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'My Quiz Score', text: `I scored ${percentage}% in the quiz!` });
              }
            }}
            variant="outline"
            className="w-full rounded-xl h-12 font-semibold"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share Score
          </Button>
          <div className="flex gap-2">
            <Button
              onClick={() => { resetQuiz(); navigate('home'); }}
              variant="outline"
              className="flex-1 rounded-xl h-12"
            >
              <Home className="w-4 h-4 mr-2" /> Home
            </Button>
            <Button
              onClick={() => {
                resetQuiz();
                navigate('sets');
              }}
              variant="outline"
              className="flex-1 rounded-xl h-12"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 7: DAILY TEST VIEW
// ═══════════════════════════════════════════════════
function DailyTestView() {
  const { selectedCategoryId, navigate, setQuizQuestions, resetQuiz, quizStartTime } = useAppStore();
  const { data: fetchedTests, loading } = useFetch<DailyTest[] | null>(
    `/api/daily-tests${selectedCourse ? `?courseId=${selectedCourse}` : ''}`,
    !!selectedCourse
  );
  const { data: dtCourses } = useFetch<Course[] | null>(`/api/courses?categoryId=${selectedCategoryId || 'cat_daily_test'}`);
  const [tests, setTests] = useState<DailyTest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (dtCourses) {
      setCourses(dtCourses);
      if (dtCourses.length > 0 && !selectedCourse) setSelectedCourse(dtCourses[0].id);
    }
  }, [dtCourses]);

  useEffect(() => {
    if (fetchedTests) setTests(fetchedTests);
  }, [fetchedTests]);

  const handleStartTest = async (test: DailyTest) => {
    try {
      const res = await fetch(`/api/daily-tests/${test.id}`);
      const data = await res.json();
      const questions = data.questions || [];
      resetQuiz();
      setQuizQuestions(questions);
      navigate('daily-quiz', { selectedTestId: test.id, selectedTestType: 'daily_test' });
    } catch (e) { /* handle error */ }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <PageTransition keyStr="daily-test">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">📅 Daily Test</h2>
          <p className="text-white/80 text-sm mt-1">Practice daily and track your progress</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCourse === c.id
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton />
        ) : tests.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No daily tests available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    {formatDate(test.testDate)}
                  </Badge>
                  <span className="text-xs text-gray-400">{test.language}</span>
                </div>
                <p className="text-sm text-gray-700 mb-1">
                  {test.totalQuestions} Questions • {test.durationMinutes} Minutes
                </p>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">⏱ {test.durationMinutes}min</Badge>
                    <Badge variant="secondary" className="text-[10px]">📝 {test.totalQuestions}Q</Badge>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartTest(test)}
                    className="bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs"
                  >
                    {test.isLocked ? <><Lock className="w-3 h-3 mr-1" /> Locked</> : <><Play className="w-3 h-3 mr-1" /> Start</>}
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// Helper component for daily test view
function Calendar(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 8: LEADERBOARD VIEW
// ═══════════════════════════════════════════════════
function LeaderboardView() {
  const { selectedCategoryId } = useAppStore();
  const { data: fetchedLB, loading } = useFetch<any[] | null>(
    `/api/leaderboard?courseId=${selectedCourse}`,
    !!selectedCourse
  );
  const { data: lbCourses } = useFetch<Course[] | null>(`/api/courses?categoryId=${selectedCategoryId || 'cat_daily_test'}`);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (lbCourses) {
      setCourses(lbCourses);
      if (lbCourses.length > 0 && !selectedCourse) setSelectedCourse(lbCourses[0].id);
    }
  }, [lbCourses]);

  useEffect(() => {
    if (fetchedLB) setLeaderboard(fetchedLB);
  }, [fetchedLB]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <PageTransition keyStr="leaderboard">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">🏆 Leaderboard</h2>
          <p className="text-white/80 text-sm mt-1">Top performers</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCourse === c.id ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton />
        ) : leaderboard.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No results yet. Be the first!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {/* Top 3 podium */}
            {leaderboard.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[leaderboard[1], leaderboard[0], leaderboard[2]].map((item, idx) => {
                  if (!item) return null;
                  const isTop = idx === 1;
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className={`bg-white rounded-2xl p-3 shadow-sm text-center ${isTop ? 'ring-2 ring-amber-400' : ''}`}
                      style={{ marginTop: isTop ? '0' : '24px' }}
                    >
                      <span className="text-2xl">{idx === 0 ? '🥈' : idx === 1 ? '🥇' : '🥉'}</span>
                      <p className="text-xs font-semibold mt-1 truncate">{item.userProfile?.fullName || 'Anonymous'}</p>
                      <p className="text-lg font-bold text-amber-600">{item.totalScore}</p>
                      <p className="text-[10px] text-gray-400">{item.percentage?.toFixed(0)}%</p>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Full list */}
            {leaderboard.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3"
              >
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                  item.rank <= 3 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {getRankIcon(item.rank)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.userProfile?.fullName || 'Anonymous'}</p>
                  {item.userProfile?.state && (
                    <p className="text-[11px] text-gray-400">{item.userProfile.state}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-green-600">{item.totalScore}</p>
                  <p className="text-[10px] text-gray-400">⏱ {formatTime(item.timeTakenSeconds)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 9: UPDATES VIEW
// ═══════════════════════════════════════════════════
function UpdatesView() {
  const { data: sections, loading } = useFetch<UpdateSection[]>('/api/updates');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open': return <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>;
      case 'released': return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Released</Badge>;
      case 'coming_soon': return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Coming Soon</Badge>;
      case 'expired': return <Badge className="bg-gray-100 text-gray-500 border-gray-200">Expired</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <PageTransition keyStr="updates">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">📰 Updates</h2>
          <p className="text-white/80 text-sm mt-1">Latest notifications & exam updates</p>
        </div>

        {loading || !sections ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-4">
            {sections.map((section, sIdx) => (
              <div key={section.id}>
                <h3 className="text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  {section.iconUrl && <span>{section.iconUrl}</span>}
                  {section.title}
                </h3>
                <div className="space-y-2">
                  {section.items.map((item, iIdx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (sIdx * 3 + iIdx) * 0.05 }}
                      className="bg-white rounded-2xl p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-gray-800">{item.title}</h4>
                          {item.subtitle && <p className="text-xs text-gray-500 mt-0.5">{item.subtitle}</p>}
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                      <p className="text-[11px] text-gray-400 mt-1.5">
                        {new Date(item.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {item.buttons && item.buttons.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {item.buttons.map((btn) => (
                            <Button
                              key={btn.id}
                              size="sm"
                              variant="outline"
                              className="text-xs rounded-lg"
                              onClick={() => { if (btn.url) window.open(btn.url, '_blank'); }}
                            >
                              {btn.label}
                              <ExternalLink className="w-3 h-3 ml-1" />
                            </Button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 10: MOCK TEST VIEW
// ═══════════════════════════════════════════════════
function MockTestView() {
  const { selectedCategoryId, navigate, resetQuiz, setQuizQuestions, setQuizTimeRemaining } = useAppStore();
  const { data: fetchedMT, loading } = useFetch<MockTest[] | null>(
    `/api/mock-tests${selectedCourse ? `?courseId=${selectedCourse}` : ''}`,
    !!selectedCourse
  );
  const { data: mtCourses } = useFetch<Course[] | null>(`/api/courses?categoryId=${selectedCategoryId || 'cat_mock_test'}`);
  const [tests, setTests] = useState<MockTest[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (mtCourses) {
      setCourses(mtCourses);
      if (mtCourses.length > 0 && !selectedCourse) setSelectedCourse(mtCourses[0].id);
    }
  }, [mtCourses]);

  useEffect(() => {
    if (fetchedMT) setTests(fetchedMT);
  }, [fetchedMT]);

  const handleStartMockTest = async (test: MockTest) => {
    try {
      const res = await fetch(`/api/mock-tests/${test.id}`);
      const data = await res.json();
      const questions = data.questions || [];
      resetQuiz();
      setQuizQuestions(questions);
      if (test.durationMinutes) setQuizTimeRemaining(test.durationMinutes * 60);
      navigate('mock-quiz', { selectedTestId: test.id, selectedTestType: 'mock_test' });
    } catch (e) { /* handle error */ }
  };

  return (
    <PageTransition keyStr="mock-test">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">🎯 Mock Tests</h2>
          <p className="text-white/80 text-sm mt-1">Full-length mock exams for thorough practice</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCourse === c.id ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton />
        ) : tests.length === 0 ? (
          <div className="text-center py-12">
            <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No mock tests available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tests.map((test, idx) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-sm">{test.title}</h3>
                    {test.description && <p className="text-xs text-gray-500 mt-0.5">{test.description}</p>}
                  </div>
                  {test.fullMock && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 shrink-0">Full Mock</Badge>
                  )}
                </div>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex gap-1.5">
                    <Badge variant="secondary" className="text-[10px]">📝 {test.totalQuestions}Q</Badge>
                    <Badge variant="secondary" className="text-[10px]">⏱ {test.durationMinutes}min</Badge>
                    {test.shuffleQuestions && <Badge variant="secondary" className="text-[10px]">🔀 Shuffle</Badge>}
                  </div>
                  <Button
                    size="sm"
                    onClick={() => handleStartMockTest(test)}
                    className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs"
                  >
                    <Play className="w-3 h-3 mr-1" /> Start
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 11: PREVIOUS PAPERS VIEW
// ═══════════════════════════════════════════════════
function PreviousPapersView() {
  const { selectedCategoryId } = useAppStore();
  const { data: fetchedPapers, loading } = useFetch<PreviousPaper[] | null>(
    `/api/previous-papers?courseId=${selectedCourse}`,
    !!selectedCourse
  );
  const { data: ppCourses } = useFetch<Course[] | null>(`/api/courses?categoryId=${selectedCategoryId || 'cat_previous_papers'}`);
  const [papers, setPapers] = useState<PreviousPaper[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (ppCourses) {
      setCourses(ppCourses);
      if (ppCourses.length > 0 && !selectedCourse) setSelectedCourse(ppCourses[0].id);
    }
  }, [ppCourses]);

  useEffect(() => {
    if (fetchedPapers) setPapers(fetchedPapers);
  }, [fetchedPapers]);

  return (
    <PageTransition keyStr="previous-papers">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">📄 Previous Papers</h2>
          <p className="text-white/80 text-sm mt-1">Solve previous year exam papers</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCourse === c.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton />
        ) : papers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No previous papers available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {papers.map((paper, idx) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm">{paper.title}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {paper.examYear} {paper.examMonth && `- ${paper.examMonth}`}
                      {paper.subject && ` • ${paper.subject.name}`}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  {paper.fileUrl && paper.isDownloadable && (
                    <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs">
                      <Download className="w-3 h-3 mr-1" /> Download
                    </Button>
                  )}
                  {paper.externalLink && (
                    <Button size="sm" variant="outline" className="rounded-lg text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" /> View
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 12: SYLLABUS VIEW
// ═══════════════════════════════════════════════════
function SyllabusView() {
  const { selectedCategoryId } = useAppStore();
  const { data: fetchedSyllabus, loading } = useFetch<SyllabusItem[] | null>(
    `/api/syllabus?courseId=${selectedCourse}`,
    !!selectedCourse
  );
  const { data: sylCourses } = useFetch<Course[] | null>(`/api/courses?categoryId=${selectedCategoryId || 'cat_syllabus'}`);
  const [items, setItems] = useState<SyllabusItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');

  useEffect(() => {
    if (sylCourses) {
      setCourses(sylCourses);
      if (sylCourses.length > 0 && !selectedCourse) setSelectedCourse(sylCourses[0].id);
    }
  }, [sylCourses]);

  useEffect(() => {
    if (fetchedSyllabus) setItems(fetchedSyllabus);
  }, [fetchedSyllabus]);

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'link': return <LinkIcon className="w-5 h-5 text-blue-500" />;
      case 'video': return <Video className="w-5 h-5 text-purple-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <PageTransition keyStr="syllabus">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">📚 Syllabus</h2>
          <p className="text-white/80 text-sm mt-1">View and download study materials</p>
        </div>

        {/* Course selector */}
        {courses.length > 1 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCourse(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCourse === c.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <CardSkeleton />
        ) : items.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No syllabus items available</p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => { if (item.externalLink) window.open(item.externalLink, '_blank'); else if (item.fileUrl) window.open(item.fileUrl, '_blank'); }}
                className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 cursor-pointer hover:shadow-md active:scale-[0.98] transition-all"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                  {getFileTypeIcon(item.fileType)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">{item.title}</h3>
                  <div className="flex gap-1.5 mt-1">
                    <Badge variant="secondary" className="text-[10px] uppercase">{item.fileType}</Badge>
                    {item.badgeText && (
                      <Badge className="text-[10px]" style={{ backgroundColor: item.badgeColor + '20', color: item.badgeColor, borderColor: item.badgeColor + '40' }}>
                        {item.badgeText}
                      </Badge>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 13: NOTIFICATIONS VIEW
// ═══════════════════════════════════════════════════
function NotificationsView() {
  const { data: notifications, loading } = useFetch<Notification[]>('/api/notifications');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'announcement': return <Volume2 className="w-5 h-5 text-amber-500" />;
      case 'reminder': return <Bell className="w-5 h-5 text-blue-500" />;
      case 'update': return <Zap className="w-5 h-5 text-green-500" />;
      default: return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <PageTransition keyStr="notifications">
      <div className="p-3 space-y-4">
        <h2 className="text-lg font-bold text-gray-800">🔔 Notifications</h2>

        {loading || !notifications ? (
          <CardSkeleton />
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notif, idx) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                    {getTypeIcon(notif.notificationType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-800">{notif.title}</h3>
                    {notif.message && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notif.message}</p>}
                    <p className="text-[10px] text-gray-400 mt-1.5">
                      {new Date(notif.publishedDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  {notif.priority === 'high' && (
                    <Badge className="bg-red-100 text-red-700 border-red-200 text-[9px]">Urgent</Badge>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 14-18: STATIC PAGES
// ═══════════════════════════════════════════════════
function StaticPageView() {
  const { currentView, siteSettings } = useAppStore();

  const pages: Record<string, { title: string; icon: any; content: React.ReactNode }> = {
    about: {
      title: 'About Us',
      icon: Info,
      content: (
        <div className="prose prose-sm max-w-none">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center mb-4">
            <GraduationCap className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">{siteSettings?.siteName || 'EduQuiz Pro'}</h2>
            <p className="text-white/80 text-sm mt-1">Premium Learning & Practice Platform</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <p className="text-gray-700 text-sm leading-relaxed">
              Welcome to <strong>{siteSettings?.siteName || 'EduQuiz Pro'}</strong>, your one-stop platform for exam preparation and learning.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our mission is to provide quality educational content and practice tools to help students achieve their academic goals. We offer a wide range of MCQ practice sets, daily tests, mock exams, and previous year papers.
            </p>
            <h3 className="text-base font-bold text-gray-800 mt-4">Features</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Thousands of MCQ questions</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Daily practice tests</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Full-length mock exams</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Previous year papers</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Performance analytics</li>
              <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Bilingual support (Hindi/English)</li>
            </ul>
          </div>
        </div>
      ),
    },
    contact: {
      title: 'Contact Us',
      icon: Mail,
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-2" />
            <h2 className="text-xl font-bold">Get in Touch</h2>
            <p className="text-white/80 text-sm mt-1">We&apos;d love to hear from you</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-800">{siteSettings?.contactEmail || 'support@eduquizpro.com'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-800">{siteSettings?.contactPhone || '+91-9876543210'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">WhatsApp</p>
                <p className="text-sm font-medium text-gray-800">Chat with us on WhatsApp</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold text-gray-800 mb-3">Send us a message</h3>
            <div className="space-y-3">
              <Input placeholder="Your Name" className="rounded-xl" />
              <Input placeholder="Your Email" type="email" className="rounded-xl" />
              <textarea placeholder="Your Message" rows={4} className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 resize-none" />
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-11">Send Message</Button>
            </div>
          </div>
        </div>
      ),
    },
    privacy: {
      title: 'Privacy Policy',
      icon: Shield,
      content: (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Privacy Policy</h2>
          <p className="text-xs text-gray-400">Last updated: January 2025</p>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800">1. Information We Collect</h3>
              <p className="mt-1">We collect information you provide directly, such as your name, email address, and quiz performance data when you use our services.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2. How We Use Your Information</h3>
              <p className="mt-1">Your information is used to provide and improve our services, personalize your learning experience, and communicate important updates.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">3. Data Security</h3>
              <p className="mt-1">We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">4. Cookies</h3>
              <p className="mt-1">We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">5. Contact</h3>
              <p className="mt-1">For privacy-related inquiries, contact us at {siteSettings?.contactEmail || 'support@eduquizpro.com'}.</p>
            </div>
          </div>
        </div>
      ),
    },
    terms: {
      title: 'Terms & Conditions',
      icon: FileText,
      content: (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Terms & Conditions</h2>
          <p className="text-xs text-gray-400">Last updated: January 2025</p>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <div>
              <h3 className="font-semibold text-gray-800">1. Acceptance of Terms</h3>
              <p className="mt-1">By using {siteSettings?.siteName || 'EduQuiz Pro'}, you agree to these terms and conditions. If you do not agree, please do not use the service.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">2. Use of Service</h3>
              <p className="mt-1">Our service is provided for educational purposes. You agree to use it responsibly and not for any unlawful purpose.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">3. Intellectual Property</h3>
              <p className="mt-1">All content, including questions, explanations, and materials, is the property of {siteSettings?.siteName || 'EduQuiz Pro'} and protected by copyright laws.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">4. Limitation of Liability</h3>
              <p className="mt-1">The platform is provided &quot;as is&quot; without warranties. We are not liable for any damages from using the service.</p>
            </div>
          </div>
        </div>
      ),
    },
    disclaimer: {
      title: 'Disclaimer',
      icon: AlertTriangle,
      content: (
        <div className="bg-white rounded-2xl p-5 shadow-sm space-y-4">
          <h2 className="text-lg font-bold text-gray-800">Disclaimer</h2>
          <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
            <p>The information provided on {siteSettings?.siteName || 'EduQuiz Pro'} is for general educational and practice purposes only.</p>
            <p>While we strive to ensure the accuracy of all questions and answers, we make no warranties about the completeness or accuracy of the content. Users should verify important information independently.</p>
            <p>The mock tests and practice questions are designed to help with exam preparation but do not guarantee any specific results in actual examinations.</p>
            <p className="font-medium text-gray-800">By using this platform, you acknowledge and agree to this disclaimer.</p>
          </div>
        </div>
      ),
    },
  };

  const page = pages[currentView];
  if (!page) return <div className="p-4"><p>Page not found</p></div>;

  return (
    <PageTransition keyStr={currentView}>
      <div className="p-3">{page.content}</div>
    </PageTransition>
  );
}

// Need AlertTriangle import for disclaimer
function AlertTriangle(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><line x1="12" x2="12" y1="9" y2="13" /><line x1="12" x2="12.01" y1="17" y2="17" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 15: JOBS VIEW
// ═══════════════════════════════════════════════════
function JobsView() {
  return (
    <PageTransition keyStr="jobs">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold">💼 Jobs</h2>
          <p className="text-white/80 text-sm mt-1">Find latest job openings and career opportunities</p>
        </div>

        <div className="text-center py-16">
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 animate-float">
            <Briefcase className="w-10 h-10 text-pink-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-800">Coming Soon!</h3>
          <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">
            We&apos;re working on bringing you the latest government and private sector job notifications. Stay tuned!
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>

        {/* Sample job cards */}
        <div className="space-y-2">
          {[
            { title: 'SSC CGL 2025', org: 'Staff Selection Commission', date: 'Apply by Feb 2025', type: 'Government' },
            { title: 'IBPS PO 2025', org: 'Institute of Banking Personnel', date: 'Apply by Mar 2025', type: 'Banking' },
            { title: 'Railway RRB NTPC', org: 'Railway Recruitment Board', date: 'Apply by Apr 2025', type: 'Government' },
          ].map((job, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.6, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/60 rounded-2xl p-4 border border-dashed border-gray-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-600">{job.title}</h3>
                  <p className="text-[11px] text-gray-400">{job.org} • {job.date}</p>
                </div>
                <Badge variant="secondary" className="text-[10px] text-gray-400">{job.type}</Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}

// ═══════════════════════════════════════════════════
// VIEW 16: ADMIN VIEW
// ═══════════════════════════════════════════════════
function AdminView() {
  const [activeTab, setActiveTab] = useState('categories');
  const { data: categories, loading } = useFetch<any[]>('/api/categories');

  const tabs = [
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <PageTransition keyStr="admin">
      <div className="p-3 space-y-4">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-4 text-white">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Shield className="w-5 h-5" /> Admin Panel
          </h2>
          <p className="text-white/60 text-sm mt-1">Manage your platform</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Categories Tab */}
        {activeTab === 'categories' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-800">Categories ({categories.length})</h3>
              <Button size="sm" className="bg-green-500 text-white rounded-lg text-xs">
                + Add
              </Button>
            </div>
            {loading || !categories ? (
              <CardSkeleton />
            ) : (
              <div className="space-y-2">
                {categories.map((cat, idx) => (
                  <div key={cat.id} className="bg-white rounded-xl p-3 shadow-sm flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                      {cat.iconUrl || '📝'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{cat.title}</p>
                      <p className="text-[11px] text-gray-400">{cat.categoryType} • Order: {cat.displayOrder}</p>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                        <Edit3 className="w-3.5 h-3.5 text-blue-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl p-5 shadow-sm text-center py-8">
            <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">User management coming soon</p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-gray-800">Site Settings</h3>
              <div>
                <Label className="text-xs text-gray-500">Site Name</Label>
                <Input defaultValue="EduQuiz Pro" className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">Contact Email</Label>
                <Input defaultValue="support@eduquizpro.com" className="mt-1 rounded-xl" />
              </div>
              <div>
                <Label className="text-xs text-gray-500">WhatsApp Link</Label>
                <Input defaultValue="https://wa.me/919876543210" className="mt-1 rounded-xl" />
              </div>
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white rounded-xl h-10">
                Save Settings
              </Button>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Total Users', value: '1,234', icon: Users, color: 'blue' },
              { label: 'Tests Taken', value: '5,678', icon: Target, color: 'green' },
              { label: 'Questions', value: '892', icon: FileText, color: 'purple' },
              { label: 'Avg Score', value: '72%', icon: BarChart3, color: 'amber' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm text-center">
                <stat.icon className={`w-6 h-6 mx-auto mb-1 text-${stat.color}-500`} />
                <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

// Helper icons
function Grid(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" />
    </svg>
  );
}

function Edit3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// MAIN APP COMPONENT
// ═══════════════════════════════════════════════════
export default function EduQuizApp() {
  const { currentView, setSiteSettings } = useAppStore();

  // Fetch site settings on mount
  useEffect(() => {
    fetch('/api/site-settings')
      .then((r) => r.json())
      .then((data) => setSiteSettings(data))
      .catch(() => {});
  }, []);

  const isQuiz = ['quiz', 'mock-quiz', 'daily-quiz'].includes(currentView);

  const renderView = () => {
    switch (currentView) {
      case 'home': return <HomeView />;
      case 'courses': return <CoursesView />;
      case 'subjects': return <SubjectsView />;
      case 'sets': return <SetsView />;
      case 'quiz': return <QuizView />;
      case 'mock-quiz': return <QuizView />;
      case 'daily-quiz': return <QuizView />;
      case 'result': return <ResultView />;
      case 'daily-test': return <DailyTestView />;
      case 'daily-result': return <LeaderboardView />;
      case 'leaderboard': return <LeaderboardView />;
      case 'updates': return <UpdatesView />;
      case 'mock-test': return <MockTestView />;
      case 'previous-papers': return <PreviousPapersView />;
      case 'syllabus': return <SyllabusView />;
      case 'notifications': return <NotificationsView />;
      case 'about':
      case 'contact':
      case 'privacy':
      case 'terms':
      case 'disclaimer':
        return <StaticPageView />;
      case 'jobs': return <JobsView />;
      case 'admin': return <AdminView />;
      default: return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-[var(--font-inter)]">
      <AppHeader />
      <Sidebar />

      {/* Main Content */}
      <main
        className={`pt-14 ${!isQuiz ? 'pb-20' : 'pb-4'} transition-all duration-200`}
      >
        <div className="max-w-lg mx-auto">
          {renderView()}
        </div>
      </main>

      {/* Fixed bottom elements */}
      <FloatingActions />
      <BottomNav />
    </div>
  );
}
