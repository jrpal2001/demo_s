import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // LocalStorage for web
import CustomizerReducer from './customizer/CustomizerSlice';
import AuthReducer from './auth/AuthSlice';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';

// Configuration for redux-persist
const persistConfig = {
  key: 'root', // Key to store the persisted state in localStorage (can be changed)
  storage, // Use localStorage as the default storage engine
  whitelist: ['auth', 'customizer'], // Reducers you want to persist
};

const rootReducer = combineReducers({
  auth: AuthReducer,
  customizer: CustomizerReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Set up the Redux store using the persisted reducers
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore specific redux-persist actions that involve non-serializable data
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Export the persistor instance to be used for syncing state with localStorage
export const persistor = persistStore(store);

export default store;
