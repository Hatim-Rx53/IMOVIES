import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import movieReducer from './slices/movieSlice';
import showReducer from './slices/showSlice';
import bookingReducer from './slices/bookingSlice';
import notificationReducer from './slices/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    movies: movieReducer,
    shows: showReducer,
    bookings: bookingReducer,
    notifications: notificationReducer
  }
});

export default store;
