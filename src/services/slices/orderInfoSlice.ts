import { getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type OrderInfoState = {
  order: TOrder | null;
  isLoading: boolean;
  error?: string;
};

const initialState: OrderInfoState = {
  order: null,
  isLoading: false
};

export const orderInfoGet = createAsyncThunk(
  'orderInfo/get',
  async (num: number) => {
    const response = await getOrderByNumberApi(num);
    return response.orders;
  }
);

export const orderInfoSlice = createSlice({
  name: 'orderInfo',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(orderInfoGet.pending, (state) => {
        state.order = null;
        state.isLoading = true;
        state.error = undefined;
      })
      .addCase(orderInfoGet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(orderInfoGet.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.length > 0) {
          state.order = action.payload[0];
        }
      });
  },
  selectors: {
    orderInfoSelector: (state) => state.order,
    isLoadingOrderInfoSelector: (state) => state.isLoading,
    errorOrderInfoSelector: (state) => state.error
  }
});

export const {
  orderInfoSelector,
  isLoadingOrderInfoSelector,
  errorOrderInfoSelector
} = orderInfoSlice.selectors;
