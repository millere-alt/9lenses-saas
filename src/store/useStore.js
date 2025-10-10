import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem('token', token);
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('token');
      },

      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      }
    }),
    {
      name: '9Vectors-auth'
    }
  )
);

// Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({
        theme: state.theme === 'light' ? 'dark' : 'light'
      })),
      setTheme: (theme) => set({ theme })
    }),
    {
      name: '9Vectors-theme'
    }
  )
);

// Assessment Store
export const useAssessmentStore = create((set) => ({
  assessments: [],
  currentAssessment: null,
  loading: false,
  error: null,

  setAssessments: (assessments) => set({ assessments }),
  setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  addAssessment: (assessment) => set((state) => ({
    assessments: [assessment, ...state.assessments]
  })),

  updateAssessment: (id, updates) => set((state) => ({
    assessments: state.assessments.map((a) =>
      a.id === id ? { ...a, ...updates } : a
    )
  })),

  removeAssessment: (id) => set((state) => ({
    assessments: state.assessments.filter((a) => a.id !== id)
  }))
}));

// Notification Store
export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (notifications) => set({
    notifications,
    unreadCount: notifications.filter((n) => !n.isRead).length
  }),

  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),

  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),

  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    unreadCount: 0
  }))
}));

// UI Store
export const useUIStore = create((set) => ({
  sidebarOpen: true,
  modalOpen: false,
  modalContent: null,
  onboardingComplete: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  openModal: (content) => set({ modalOpen: true, modalContent: content }),
  closeModal: () => set({ modalOpen: false, modalContent: null }),

  setOnboardingComplete: (complete) => set({ onboardingComplete: complete })
}));

// Document Store
export const useDocumentStore = create((set) => ({
  documents: [],
  currentDocument: null,
  loading: false,

  setDocuments: (documents) => set({ documents }),
  setCurrentDocument: (document) => set({ currentDocument: document }),
  setLoading: (loading) => set({ loading }),

  addDocument: (document) => set((state) => ({
    documents: [document, ...state.documents]
  })),

  removeDocument: (id) => set((state) => ({
    documents: state.documents.filter((d) => d.id !== id)
  }))
}));
