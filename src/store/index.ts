import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import deviceSlice from './slices/deviceSlice'
import incidentSlice from './slices/incidentSlice'
import authSlice from './slices/authSlice'
import uiSlice from './slices/uiSlice'

// === Redux Store Configuration ===
// Quản lý state toàn cục cho Fire Alarm System

export const store = configureStore({
  reducer: {
    devices: deviceSlice,
    incidents: incidentSlice,
    auth: authSlice,
    ui: uiSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store
