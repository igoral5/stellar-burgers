import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type FeedsState = {
  feeds: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error?: string;
};

const initialState: FeedsState = {
  feeds: [],
  total: 0,
  totalToday: 0,
  isLoading: false
};

export const feedsGet = createAsyncThunk('feeds/getAll', async () =>
  getFeedsApi()
);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(feedsGet.pending, (state) => {
        state.feeds = [];
        state.total = 0;
        state.totalToday = 0;
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(feedsGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(feedsGet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feeds = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      });
  },
  selectors: {
    feedsSelector: (state) => state.feeds,
    totalFeedsSelector: (state) => ({
      total: state.total,
      totalToday: state.totalToday
    }),
    isLoadingFeedsSelector: (state) => state.isLoading,
    errorFeedsSelector: (state) => state.error
  }
});

export const {
  feedsSelector,
  totalFeedsSelector,
  isLoadingFeedsSelector,
  errorFeedsSelector
} = feedsSlice.selectors;
