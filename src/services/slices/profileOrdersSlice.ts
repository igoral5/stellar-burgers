import { getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error?: string;
};

const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false
};

export const ordersProfile = createAsyncThunk('orders/getAll', async () =>
  getOrdersApi()
);

export const profileOrdersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(ordersProfile.pending, (state) => {
        state.isLoading = true;
        state.orders = [];
        state.error = undefined;
      })
      .addCase(ordersProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(ordersProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  },
  selectors: {
    ordersSelector: (state) => state.orders,
    isLoadingOrdersSelector: (state) => state.isLoading,
    errorOrdersSelector: (state) => state.error
  }
});

export const { ordersSelector, isLoadingOrdersSelector, errorOrdersSelector } =
  profileOrdersSlice.selectors;
