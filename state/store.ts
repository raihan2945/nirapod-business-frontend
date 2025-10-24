// store.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/auth/authSlice";
import userReducer from "./features/user/userSlice";
import api from "./features/api/api"; // Import your RTK Query API service

// Configure persist
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // Only persist the 'auth' slice
};

// Combine reducers
const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer, // API slice
  auth: authReducer,
  user: userReducer,
  // Add other reducers if needed
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Needed due to non-serializable data in API middleware
    }).concat(api.middleware), // Add API middleware
});

// Create persistor
export const persistor = persistStore(store);

// Optional: Setup listeners for refetching on focus or reconnect
setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
