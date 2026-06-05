import { combineSlices, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import {
  feedsSlice,
  ingredientsSlice,
  orderInfoSlice,
  orderSlice,
  profileOrdersSlice,
  userSlice
} from '@slices';

const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  userSlice,
  profileOrdersSlice,
  feedsSlice,
  orderInfoSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
