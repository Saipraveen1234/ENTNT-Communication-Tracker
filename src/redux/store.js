// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import companyReducer from './slices/companySlice';
import communicationTrackingReducer from './slices/communicationTrackingSlice';

export const store = configureStore({
  reducer: {
    companies: companyReducer,
    communicationTracking: communicationTrackingReducer,
  },
});

export default store;