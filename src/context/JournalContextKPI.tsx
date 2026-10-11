"use client"
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  JournalDay, 
  Phase,
  DayStatus, 
  JournalStats, 
  TargetProject, 
  LearningResource 
} from '@/types/journal';
import { INITIAL_DAYS, INITIAL_USER_PROFILE } from '@/lib/InitialDaysKPI';
import { INITIAL_TARGET_PROJECTS, INITIAL_LEARNING_RESOURCES } from '@/lib/InitialProjsKPI';

export interface UserProfile {
  authorName: string;
  githubUrl: string;
  twitterHandle: string;
  goal: string;
  startDate: string;
}

export type MainNavPage = 'logbook' | 'roadmap' | 'simulations';

interface JournalContextType {
  days: JournalDay[];
  userProfile: UserProfile;
  projects: TargetProject[];
  resources: LearningResource[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPhase: Phase | 'All';
  setSelectedPhase: (phase: Phase | 'All') => void;
  selectedStatus: DayStatus | 'all';
  setSelectedStatus: (status: DayStatus | 'all') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  viewMode: 'feed' | 'matrix';
  setViewMode: (mode: 'feed' | 'matrix') => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Paged navigation
  activeNavPage: MainNavPage;
  setActiveNavPage: (page: MainNavPage) => void;

  // Modals & Active Selections
  activeReaderDay: JournalDay | null;
  setActiveReaderDay: (day: JournalDay | null) => void;
  editingDay: JournalDay | null;
  setEditingDay: (day: JournalDay | null) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  activeLab: string | null;
  setActiveLab: (lab: string | null) => void;

  // Actions for Days
  updateDay: (updated: JournalDay) => void;
  addNewDay: () => void;
  deleteDay: (id: string) => void;
  toggleStar: (id: string) => void;
  updateProfile: (profile: UserProfile) => void;
  resetToDefaults: () => void;

  // Actions for Projects
  addProject: (project: Omit<TargetProject, 'id' | 'order'>) => void;
  updateProject: (project: TargetProject) => void;
  deleteProject: (id: string) => void;
  toggleProjectStatus: (id: string) => void;

  // Actions for Resources
  addResource: (resource: Omit<LearningResource, 'id' | 'dateAdded'>) => void;
  updateResource: (resource: LearningResource) => void;
  deleteResource: (id: string) => void;
  toggleResourceFavorite: (id: string) => void;
  
  // Computed
  stats: JournalStats;
  filteredDays: JournalDay[];
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

const STORAGE_KEY_DAYS = '250_days_of_kpi_days_v2';
const STORAGE_KEY_PROFILE = '250_days_of_kpi_profile_v2';
const STORAGE_KEY_THEME = '250_days_of_kpi_theme_v2';
const STORAGE_KEY_PROJECTS = '250_days_of_kpi_projects_v2';
const STORAGE_KEY_RESOURCES = '250_days_of_kpi_resources_v2';
const STORAGE_KEY_PAGE = '250_days_of_kpi_page_v2';

export const JournalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [days, setDays] = useState<JournalDay[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_DAYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_DAYS;
  });

  const [projects, setProjects] = useState<TargetProject[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROJECTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_TARGET_PROJECTS;
  });

  const [resources, setResources] = useState<LearningResource[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RESOURCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_LEARNING_RESOURCES;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_USER_PROFILE;
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME);
      if (saved === 'light' || saved === 'dark') return saved;
    } catch {
      // fallback
    }
    return 'dark';
  });

  const [activeNavPage, setActiveNavPage] = useState<MainNavPage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PAGE);
      if (saved === 'logbook' || saved === 'roadmap' || saved === 'simulations') {
        return saved;
      }
    } catch {
      // fallback
    }
    return 'logbook';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPhase, setSelectedPhase] = useState<Phase | 'All'>('All');
  const [selectedStatus, setSelectedStatus] = useState<DayStatus | 'all'>('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [viewMode, setViewMode] = useState<'feed' | 'matrix'>('feed');

  const [activeReaderDay, setActiveReaderDay] = useState<JournalDay | null>(null);
  const [editingDay, setEditingDay] = useState<JournalDay | null>(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [activeLab, setActiveLab] = useState<string | null>(null);

  // Sync nav page
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PAGE, activeNavPage);
    } catch (e) {
      console.warn('Failed to save page', e);
    }
  }, [activeNavPage]);

  // Sync days
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DAYS, JSON.stringify(days));
    } catch (e) {
      console.warn('Failed to save days', e);
    }
  }, [days]);

  // Sync projects
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
    } catch (e) {
      console.warn('Failed to save projects', e);
    }
  }, [projects]);

  // Sync resources
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RESOURCES, JSON.stringify(resources));
    } catch (e) {
      console.warn('Failed to save resources', e);
    }
  }, [resources]);

  // Sync profile
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.warn('Failed to save theme', e);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateDay = (updated: JournalDay) => {
    setDays(prev => prev.map(d => (d.id === updated.id ? updated : d)));
    if (activeReaderDay && activeReaderDay.id === updated.id) {
      setActiveReaderDay(updated);
    }
    setEditingDay(null);
  };

  const addNewDay = () => {
    const maxDayNum = days.reduce((max, d) => Math.max(max, d.dayNumber), 0);
    const nextDayNum = maxDayNum < 250 ? maxDayNum + 1 : maxDayNum + 1;
    const now = new Date().toISOString().split('T')[0];
    
    let defaultPhase: Phase = 'C++ & CUDA Foundations';
    if (nextDayNum > 210) defaultPhase = 'Portfolio & Job Search';
    else if (nextDayNum > 160) defaultPhase = 'Inference & Serving';
    else if (nextDayNum > 120) defaultPhase = 'Distributed Training';
    else if (nextDayNum > 70) defaultPhase = 'Frontier Kernel Engineering';
    else if (nextDayNum > 35) defaultPhase = 'Performance Engineering';

    const newDay: JournalDay = {
      id: `day-${String(nextDayNum).padStart(2, '0')}`,
      dayNumber: nextDayNum,
      date: now,
      title: `Day ${nextDayNum}: Kernel Engineering Progress & Profiling`,
      phase: defaultPhase,
      status: 'in-progress',
      isStarred: false,
      summary: 'Today I developed and benchmarked...',
      explanation: 'Detailed breakdown of GPU execution model, memory hierarchy, SASS instructions, and profiling benchmarks.',
      keyInsights: ['Insight #1: Arithmetic intensity & memory coalescing behavior.', 'Insight #2: Register pressure and SM occupancy.'],
      resources: [],
      gotchas: []
    };

    setDays(prev => [...prev, newDay].sort((a, b) => a.dayNumber - b.dayNumber));
    setEditingDay(newDay);
    // Switch to logbook view so user sees the new day
    setActiveNavPage('logbook');
  };

  const deleteDay = (id: string) => {
    setDays(prev => prev.filter(d => d.id !== id));
    if (activeReaderDay?.id === id) setActiveReaderDay(null);
    if (editingDay?.id === id) setEditingDay(null);
  };

  const toggleStar = (id: string) => {
    setDays(prev =>
      prev.map(d => (d.id === id ? { ...d, isStarred: !d.isStarred } : d))
    );
    if (activeReaderDay?.id === id) {
      setActiveReaderDay(prev => prev ? { ...prev, isStarred: !prev.isStarred } : null);
    }
  };

  const updateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    setIsProfileModalOpen(false);
  };

  // Project handlers
  const addProject = (projectData: Omit<TargetProject, 'id' | 'order'>) => {
    const newProj: TargetProject = {
      ...projectData,
      id: `proj-${Date.now()}`,
      order: projects.length + 1
    };
    setProjects(prev => [...prev, newProj]);
  };

  const updateProject = (updated: TargetProject) => {
    setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));
  };

  const deleteProject = (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  };

  const toggleProjectStatus = (id: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const nextStatus = 
        p.status === 'wishlist' ? 'in-progress' :
        p.status === 'in-progress' ? 'completed' : 'wishlist';
      return { ...p, status: nextStatus };
    }));
  };

  // Resource handlers
  const addResource = (resData: Omit<LearningResource, 'id' | 'dateAdded'>) => {
    const newRes: LearningResource = {
      ...resData,
      id: `res-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setResources(prev => [newRes, ...prev]);
  };

  const updateResource = (updated: LearningResource) => {
    setResources(prev => prev.map(r => (r.id === updated.id ? updated : r)));
  };

  const deleteResource = (id: string) => {
    setResources(prev => prev.filter(r => r.id !== id));
  };

  const toggleResourceFavorite = (id: string) => {
    setResources(prev => prev.map(r => {
      if (r.id !== id) return r;
      return { ...r, isFavorite: !r.isFavorite };
    }));
  };

  const resetToDefaults = () => {
    setDays(INITIAL_DAYS);
    setUserProfile(INITIAL_USER_PROFILE);
    setProjects(INITIAL_TARGET_PROJECTS);
    setResources(INITIAL_LEARNING_RESOURCES);
    setActiveNavPage('logbook');
    localStorage.removeItem(STORAGE_KEY_DAYS);
    localStorage.removeItem(STORAGE_KEY_PROFILE);
    localStorage.removeItem(STORAGE_KEY_PROJECTS);
    localStorage.removeItem(STORAGE_KEY_RESOURCES);
    localStorage.removeItem(STORAGE_KEY_PAGE);
  };

  // Stats calculation
  const completedCount = days.filter(d => d.status === 'completed').length;
  const inProgressCount = days.filter(d => d.status === 'in-progress').length;
  const stats: JournalStats = {
    totalDays: 250,
    completedDays: completedCount,
    inProgressDays: inProgressCount,
    plannedDays: Math.max(0, 250 - completedCount - inProgressCount),
    currentStreak: 10,
    algorithmsCount: days.filter(d => !!d.codeSnippet).length,
    papersCount: days.reduce((acc, d) => acc + (d.resources?.length || 0), 0)
  };

  // Filtered & Sorted Days
  const filteredDays = days.filter(day => {
    if (selectedPhase !== 'All' && day.phase !== selectedPhase) return false;
    if (selectedStatus !== 'all' && day.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = day.title.toLowerCase().includes(q);
      const matchSummary = day.summary.toLowerCase().includes(q);
      const matchExpl = day.explanation.toLowerCase().includes(q);
      const matchFormula = day.formula?.name.toLowerCase().includes(q) || day.formula?.latex.toLowerCase().includes(q);
      const matchCode = day.codeSnippet?.code.toLowerCase().includes(q) || day.codeSnippet?.title.toLowerCase().includes(q);
      const matchDay = `day ${day.dayNumber}`.includes(q) || String(day.dayNumber) === q;
      return matchTitle || matchSummary || matchExpl || matchFormula || matchCode || matchDay;
    }
    return true;
  }).sort((a, b) => {
    return sortOrder === 'asc' ? a.dayNumber - b.dayNumber : b.dayNumber - a.dayNumber;
  });

  return (
    <JournalContext.Provider
      value={{
        days,
        userProfile,
        projects,
        resources,
        searchQuery,
        setSearchQuery,
        selectedPhase,
        setSelectedPhase,
        selectedStatus,
        setSelectedStatus,
        sortOrder,
        setSortOrder,
        viewMode,
        setViewMode,
        theme,
        toggleTheme,
        activeNavPage,
        setActiveNavPage,
        activeReaderDay,
        setActiveReaderDay,
        editingDay,
        setEditingDay,
        isExportModalOpen,
        setIsExportModalOpen,
        isProfileModalOpen,
        setIsProfileModalOpen,
        activeLab,
        setActiveLab,
        updateDay,
        addNewDay,
        deleteDay,
        toggleStar,
        updateProfile,
        resetToDefaults,
        addProject,
        updateProject,
        deleteProject,
        toggleProjectStatus,
        addResource,
        updateResource,
        deleteResource,
        toggleResourceFavorite,
        stats,
        filteredDays
      }}
    >
      {children}
    </JournalContext.Provider>
  );
};

export const useJournal = () => {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
};
