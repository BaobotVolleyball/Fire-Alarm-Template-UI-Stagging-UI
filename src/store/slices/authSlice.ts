import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

// === Authentication & Authorization State ===

export interface User {
  id: string
  username: string
  email: string
  fullName: string
  role: 'system_admin' | 'operator' | 'org_admin' | 'facility_manager' | 'technician'
  organization: string
  branch?: string
  permissions: string[]
  avatar?: string
  lastLogin: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
  sessionExpiry: string | null
}

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  sessionExpiry: null,
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock authentication
    if (credentials.username === 'admin' && credentials.password === 'admin') {
      const mockUser: User = {
        id: 'user-001',
        username: 'admin',
        email: 'admin@viotech.com',
        fullName: 'Admin Tenant',
        role: 'system_admin',
        organization: 'Viotech Corporation',
        permissions: [
          'view_all_branches',
          'manage_devices',
          'manage_incidents',
          'manage_users',
          'view_reports',
          'system_settings'
        ],
        lastLogin: new Date().toISOString(),
        isActive: true
      }
      
      const token = 'mock-jwt-token-' + Date.now()
      const refreshToken = 'mock-refresh-token-' + Date.now()
      const sessionExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString() // 8 hours
      
      return { user: mockUser, token, refreshToken, sessionExpiry }
    } else {
      throw new Error('Invalid credentials')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Simulate API call to invalidate token
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Clear local storage
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('user')
    
    return true
  }
)

export const refreshAuthToken = createAsyncThunk(
  'auth/refreshToken',
  async (refreshToken: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newToken = 'mock-jwt-token-refreshed-' + Date.now()
    const newRefreshToken = 'mock-refresh-token-refreshed-' + Date.now()
    const sessionExpiry = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString()
    
    return { token: newToken, refreshToken: newRefreshToken, sessionExpiry }
  }
)

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updates: Partial<User>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800))
    
    return updates
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action: PayloadAction<{ user: User; token: string; refreshToken: string; sessionExpiry: string }>) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.refreshToken = action.payload.refreshToken
      state.sessionExpiry = action.payload.sessionExpiry
      state.isAuthenticated = true
      
      // Store in localStorage
      localStorage.setItem('token', action.payload.token)
      localStorage.setItem('refreshToken', action.payload.refreshToken)
      localStorage.setItem('user', JSON.stringify(action.payload.user))
    },
    clearCredentials: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.sessionExpiry = null
      state.isAuthenticated = false
      
      // Clear localStorage
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
    },
    initializeAuth: (state) => {
      // Check localStorage for existing session
      const token = localStorage.getItem('token')
      const refreshToken = localStorage.getItem('refreshToken')
      const userStr = localStorage.getItem('user')
      
      if (token && refreshToken && userStr) {
        try {
          const user = JSON.parse(userStr)
          state.user = user
          state.token = token
          state.refreshToken = refreshToken
          state.isAuthenticated = true
        } catch (error) {
          // Clear invalid data
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.sessionExpiry = action.payload.sessionExpiry
        state.isAuthenticated = true
        
        // Store in localStorage
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
        localStorage.setItem('user', JSON.stringify(action.payload.user))
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Login failed'
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.refreshToken = null
        state.sessionExpiry = null
        state.isAuthenticated = false
      })
      // Refresh token
      .addCase(refreshAuthToken.fulfilled, (state, action) => {
        state.token = action.payload.token
        state.refreshToken = action.payload.refreshToken
        state.sessionExpiry = action.payload.sessionExpiry
        
        // Update localStorage
        localStorage.setItem('token', action.payload.token)
        localStorage.setItem('refreshToken', action.payload.refreshToken)
      })
      .addCase(refreshAuthToken.rejected, (state) => {
        // Token refresh failed, logout user
        state.user = null
        state.token = null
        state.refreshToken = null
        state.sessionExpiry = null
        state.isAuthenticated = false
        
        // Clear localStorage
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('user')
      })
      // Update profile
      .addCase(updateProfile.fulfilled, (state, action) => {
        if (state.user) {
          state.user = { ...state.user, ...action.payload }
          localStorage.setItem('user', JSON.stringify(state.user))
        }
      })
  },
})

export const { clearError, setCredentials, clearCredentials, initializeAuth } = authSlice.actions

export default authSlice.reducer
