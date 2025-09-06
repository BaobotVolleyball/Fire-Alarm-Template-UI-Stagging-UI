import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// === UI State Management ===

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  timestamp: string
  read: boolean
}

export interface Modal {
  id: string
  type: string
  props?: Record<string, any>
  isOpen: boolean
}

export interface UIState {
  // Layout
  sidebarCollapsed: boolean
  sidebarHidden: boolean
  theme: 'light' | 'dark'
  
  // Notifications
  notifications: Notification[]
  unreadNotifications: number
  
  // Modals
  modals: Modal[]
  
  // Loading states
  globalLoading: boolean
  loadingStates: Record<string, boolean>
  
  // Toast messages
  toasts: Array<{
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    message: string
    duration: number
  }>
  
  // Search
  globalSearch: {
    query: string
    isOpen: boolean
    results: any[]
    loading: boolean
  }
  
  // Real-time connection
  connectionStatus: 'connected' | 'disconnected' | 'reconnecting'
  lastConnectionCheck: string
}

const initialState: UIState = {
  sidebarCollapsed: false,
  sidebarHidden: false,
  theme: 'light',
  notifications: [],
  unreadNotifications: 0,
  modals: [],
  globalLoading: false,
  loadingStates: {},
  toasts: [],
  globalSearch: {
    query: '',
    isOpen: false,
    results: [],
    loading: false
  },
  connectionStatus: 'connected',
  lastConnectionCheck: new Date().toISOString()
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Layout actions
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload
    },
    setSidebarHidden: (state, action: PayloadAction<boolean>) => {
      state.sidebarHidden = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    
    // Notification actions
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'read'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        read: false
      }
      state.notifications.unshift(notification)
      state.unreadNotifications += 1
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadNotifications = Math.max(0, state.unreadNotifications - 1)
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach(n => n.read = true)
      state.unreadNotifications = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload)
      if (index !== -1) {
        const notification = state.notifications[index]
        if (!notification.read) {
          state.unreadNotifications = Math.max(0, state.unreadNotifications - 1)
        }
        state.notifications.splice(index, 1)
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = []
      state.unreadNotifications = 0
    },
    
    // Modal actions
    openModal: (state, action: PayloadAction<{ type: string; props?: Record<string, any> }>) => {
      const modal: Modal = {
        id: `modal-${Date.now()}`,
        type: action.payload.type,
        props: action.payload.props,
        isOpen: true
      }
      state.modals.push(modal)
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const index = state.modals.findIndex(m => m.id === action.payload)
      if (index !== -1) {
        state.modals.splice(index, 1)
      }
    },
    closeAllModals: (state) => {
      state.modals = []
    },
    
    // Loading actions
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.globalLoading = action.payload
    },
    setLoadingState: (state, action: PayloadAction<{ key: string; loading: boolean }>) => {
      state.loadingStates[action.payload.key] = action.payload.loading
    },
    clearLoadingState: (state, action: PayloadAction<string>) => {
      delete state.loadingStates[action.payload]
    },
    
    // Toast actions
    addToast: (state, action: PayloadAction<Omit<UIState['toasts'][0], 'id'>>) => {
      const toast = {
        ...action.payload,
        id: `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      const index = state.toasts.findIndex(t => t.id === action.payload)
      if (index !== -1) {
        state.toasts.splice(index, 1)
      }
    },
    clearAllToasts: (state) => {
      state.toasts = []
    },
    
    // Search actions
    setGlobalSearchQuery: (state, action: PayloadAction<string>) => {
      state.globalSearch.query = action.payload
    },
    setGlobalSearchOpen: (state, action: PayloadAction<boolean>) => {
      state.globalSearch.isOpen = action.payload
      if (!action.payload) {
        state.globalSearch.query = ''
        state.globalSearch.results = []
      }
    },
    setGlobalSearchResults: (state, action: PayloadAction<any[]>) => {
      state.globalSearch.results = action.payload
    },
    setGlobalSearchLoading: (state, action: PayloadAction<boolean>) => {
      state.globalSearch.loading = action.payload
    },
    
    // Connection status
    setConnectionStatus: (state, action: PayloadAction<UIState['connectionStatus']>) => {
      state.connectionStatus = action.payload
      state.lastConnectionCheck = new Date().toISOString()
    },
    
    // Initialize UI from localStorage
    initializeUI: (state) => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      if (savedTheme) {
        state.theme = savedTheme
      }
      
      const savedSidebarState = localStorage.getItem('sidebarCollapsed')
      if (savedSidebarState) {
        state.sidebarCollapsed = JSON.parse(savedSidebarState)
      }
    }
  }
})

export const {
  // Layout
  toggleSidebar,
  setSidebarCollapsed,
  setSidebarHidden,
  setTheme,
  
  // Notifications
  addNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  removeNotification,
  clearAllNotifications,
  
  // Modals
  openModal,
  closeModal,
  closeAllModals,
  
  // Loading
  setGlobalLoading,
  setLoadingState,
  clearLoadingState,
  
  // Toasts
  addToast,
  removeToast,
  clearAllToasts,
  
  // Search
  setGlobalSearchQuery,
  setGlobalSearchOpen,
  setGlobalSearchResults,
  setGlobalSearchLoading,
  
  // Connection
  setConnectionStatus,
  
  // Initialize
  initializeUI
} = uiSlice.actions

export default uiSlice.reducer
