import { orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

interface OrderState {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  orderError: string | null;
}

const initialState: OrderState = {
  constructorItems: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  orderError: null
};

export const orderSend = createAsyncThunk(
  'order/send',
  async (ids: string[]): Promise<TOrder> => {
    const response = await orderBurgerApi(ids);
    const { owner, price, ...order } = response.order;
    return { ...order, ingredients: ids };
  }
);

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addProduct: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload;
        } else {
          state.constructorItems.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() }
      })
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (val) => val.id !== action.payload
        );
    },
    moveUp: (state, action: PayloadAction<number>) => {
      const [ingredient] = state.constructorItems.ingredients.splice(
        action.payload,
        1
      );
      state.constructorItems.ingredients.splice(
        action.payload - 1,
        0,
        ingredient
      );
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const [ingredient] = state.constructorItems.ingredients.splice(
        action.payload,
        1
      );
      state.constructorItems.ingredients.splice(
        action.payload + 1,
        0,
        ingredient
      );
    },
    closeModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderSend.pending, (state) => {
        state.orderRequest = true;
        state.orderModalData = null;
        state.orderError = null;
      })
      .addCase(orderSend.rejected, (state, action) => {
        state.orderRequest = false;
        state.orderError = action.error.message ?? null;
      })
      .addCase(orderSend.fulfilled, (state, acction) => {
        state.orderRequest = false;
        state.orderModalData = acction.payload;
        state.constructorItems.bun = null;
        state.constructorItems.ingredients = [];
      });
  },
  selectors: {
    itemsSelector: (state) => state.constructorItems,
    requestSelector: (state) => state.orderRequest,
    requestDataSelector: (state) => state.orderModalData
  }
});

export const { addProduct, removeProduct, moveDown, moveUp, closeModal } =
  orderSlice.actions;

export const { itemsSelector, requestSelector, requestDataSelector } =
  orderSlice.selectors;
