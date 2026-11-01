import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchShows = createAsyncThunk('shows/fetchShows', async (params = {}, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/shows', { params });
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

export const fetchShowById = createAsyncThunk('shows/fetchShowById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/shows/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

const showSlice = createSlice({
  name: 'shows',
  initialState: {
    shows: [],
    currentShow: null,
    loading: false,
    error: null
  },
  reducers: {
    updateSeatState: (state, action) => {
      if (state.currentShow && state.currentShow.seatLayout) {
        const { seatIds, status, lockedBy } = action.payload;
        state.currentShow.seatLayout.forEach((seat) => {
          if (seatIds.includes(seat.seatId)) {
            seat.status = status;
            seat.lockedBy = lockedBy !== undefined ? lockedBy : seat.lockedBy;
          }
        });
      }
    },
    setFullSeatLayout: (state, action) => {
      if (state.currentShow) {
        state.currentShow.seatLayout = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchShows.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShows.fulfilled, (state, action) => {
        state.loading = false;
        state.shows = action.payload;
      })
      .addCase(fetchShows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchShowById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShowById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentShow = action.payload;
      })
      .addCase(fetchShowById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { updateSeatState, setFullSeatLayout } = showSlice.actions;
export default showSlice.reducer;
