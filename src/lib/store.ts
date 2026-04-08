import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // Navigation
  currentView: string;
  selectedCategoryId: string | null;
  selectedCourseId: string | null;
  selectedSubjectId: string | null;
  selectedSetId: string | null;
  selectedTestId: string | null;
  selectedTestType: string | null;
  selectedLanguage: 'hindi' | 'english';
  // Sidebar
  sidebarOpen: boolean;
  // Quiz state
  quizQuestions: any[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>;
  quizStartTime: number | null;
  quizResult: any;
  quizTimeRemaining: number | null;
  // User
  userProfile: any;
  // Site settings
  siteSettings: any;
  // Data caches
  categories: any[];
  courses: any[];
  subjects: any[];
  sets: any[];
  notifications: any[];
  // Navigation history for back button
  viewHistory: string[];
  // Actions
  navigate: (view: string, params?: any) => void;
  goBack: () => void;
  setSidebarOpen: (open: boolean) => void;
  setSelectedLanguage: (lang: 'hindi' | 'english') => void;
  setQuizQuestions: (questions: any[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  setUserAnswer: (questionIndex: number, answer: string) => void;
  resetQuiz: () => void;
  setQuizResult: (result: any) => void;
  setUserProfile: (profile: any) => void;
  setSiteSettings: (settings: any) => void;
  setCategories: (categories: any[]) => void;
  setCourses: (courses: any[]) => void;
  setSubjects: (subjects: any[]) => void;
  setSets: (sets: any[]) => void;
  setNotifications: (notifications: any[]) => void;
  setQuizTimeRemaining: (time: number | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentView: 'home',
      selectedCategoryId: null,
      selectedCourseId: null,
      selectedSubjectId: null,
      selectedSetId: null,
      selectedTestId: null,
      selectedTestType: null,
      selectedLanguage: 'hindi',
      sidebarOpen: false,
      quizQuestions: [],
      currentQuestionIndex: 0,
      userAnswers: {},
      quizStartTime: null,
      quizResult: null,
      quizTimeRemaining: null,
      userProfile: null,
      siteSettings: null,
      categories: [],
      courses: [],
      subjects: [],
      sets: [],
      notifications: [],
      viewHistory: [],

      // Actions
      navigate: (view: string, params?: any) => {
        const state = get();
        const newHistory = [...state.viewHistory, state.currentView];
        set({
          currentView: view,
          viewHistory: newHistory.length > 20 ? newHistory.slice(-20) : newHistory,
          ...(params || {}),
        });
      },

      goBack: () => {
        const state = get();
        const history = [...state.viewHistory];
        const prevView = history.pop();
        if (prevView) {
          set({
            currentView: prevView,
            viewHistory: history,
          });
        } else {
          set({ currentView: 'home', viewHistory: [] });
        }
      },

      setSidebarOpen: (open: boolean) => set({ sidebarOpen: open }),
      setSelectedLanguage: (lang: 'hindi' | 'english') => set({ selectedLanguage: lang }),
      setQuizQuestions: (questions: any[]) => set({ quizQuestions: questions }),
      setCurrentQuestionIndex: (index: number) => set({ currentQuestionIndex: index }),
      setUserAnswer: (questionIndex: number, answer: string) =>
        set((state) => ({
          userAnswers: { ...state.userAnswers, [questionIndex]: answer },
        })),
      resetQuiz: () =>
        set({
          quizQuestions: [],
          currentQuestionIndex: 0,
          userAnswers: {},
          quizStartTime: null,
          quizResult: null,
          quizTimeRemaining: null,
        }),
      setQuizResult: (result: any) => set({ quizResult: result }),
      setUserProfile: (profile: any) => set({ userProfile: profile }),
      setSiteSettings: (settings: any) => set({ siteSettings: settings }),
      setCategories: (categories: any[]) => set({ categories }),
      setCourses: (courses: any[]) => set({ courses }),
      setSubjects: (subjects: any[]) => set({ subjects }),
      setSets: (sets: any[]) => set({ sets }),
      setNotifications: (notifications: any[]) => set({ notifications }),
      setQuizTimeRemaining: (time: number | null) => set({ quizTimeRemaining: time }),
    }),
    {
      name: 'eduquiz-pro-store',
      partialize: (state) => ({
        selectedLanguage: state.selectedLanguage,
        userProfile: state.userProfile,
      }),
    }
  )
);
