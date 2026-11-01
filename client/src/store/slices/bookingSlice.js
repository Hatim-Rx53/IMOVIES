import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const createBooking = createAsyncThunk('bookings/createBooking', async (bookingData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/bookings', bookingData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchMyBookings = createAsyncThunk('bookings/fetchMyBookings', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/bookings/my');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const cancelBooking = createAsyncThunk('bookings/cancelBooking', async ({ id, reason }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/bookings/${id}/cancel`, { reason });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const bookingSlice = createSlice({
  name: 'bookings',
  initialState: {
    bookings: [],
    currentBooking: null,
    selectedSeats: [], // Array of seat objects { seatId, tier, price }
    lockExpiresAt: null, // Timestamp for 5-minute countdown
    loading: false,
    error: null
  },
  reducers: {
    setSelectedSeats: (state, action) => {
      state.selectedSeats = action.payload;
    },
    toggleSeatSelection: (state, action) => {
      const seat = action.payload;
      const index = state.selectedSeats.findIndex((s) => s.seatId === seat.seatId);
      if (index >= 0) {
        state.selectedSeats.splice(index, 1);
      } else {
        state.selectedSeats.push(seat);
      }
    },
    clearSelectedSeats: (state) => {
      state.selectedSeats = [];
      state.lockExpiresAt = null;
    },
    setLockTimer: (state, action) => {
      state.lockExpiresAt = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBooking.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBooking = action.payload;
        state.selectedSeats = [];
        state.lockExpiresAt = null;
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyBookings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex((b) => b._id === action.payload._id);
        if (index >= 0) {
          state.bookings[index] = action.payload;
        }
      });
  }
});

export const { setSelectedSeats, toggleSeatSelection, clearSelectedSeats, setLockTimer } = bookingSlice.actions;
export default bookingSlice.reducer;
