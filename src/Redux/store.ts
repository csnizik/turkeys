import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/dist/query';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // SessionStorage for web
import { api, fotgApi } from './services/api';
import disableSlice from './Slice/disableSlice';
import pdfGenSlice from './Slice/pdfGenSlice';
import practiceSlice from './Slice/practiceSlice';
import resourceConcernSlice from './Slice/resourceConcernSlice';
import stateSlice from './Slice/stateSlice';
import staticTextSlice from './Slice/staticTextSlice';

const rootReducer = combineReducers({
  [api.reducerPath]: api.reducer,
  [fotgApi.reducerPath]: fotgApi.reducer,
  disableSlice,
  pdfGenSlice,
  practiceSlice,
  resourceConcernSlice,
  stateSlice,
  staticTextSlice,
});

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [''], // State will not be persisted
  whitelist: ['stateSlice', 'practiceSlice', 'resourceConcernSlice', 'disableSlice', 'staticTextSlice'], // only State will be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware, fotgApi.middleware),
});

//! Used for refetch on focus or refetch on reconnect
setupListeners(store.dispatch);

//! Helps TypeScript to identify what kind of state is stored in Store object and stops any typescript compilation error
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;

export const presistedStore = persistStore(store);

export function createTestStore() {
  const testStore = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(api.middleware, fotgApi.middleware),
  });
  return testStore;
}
