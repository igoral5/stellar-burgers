import { getIngredientsApi } from '@api';
import store from '@services';
import {
  fetchIngredients,
  ingredientsSelector,
  ingredientsSlice,
  initialIngredientsState
} from '@slices';
import { mockIngredients } from '@utils-data';

jest.mock('@api', () => ({
  ...jest.requireActual('@api'),
  getIngredientsApi: jest.fn()
}));

const getIngredientsApiSpy = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

describe('Reducer ingredients', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Action ingredients/getAll/pending', () => {
    const initialState = {
      ...initialIngredientsState,
      ingredients: mockIngredients,
      isIngredientsLoading: false,
      error: 'Error'
    };

    const newState = ingredientsSlice.reducer(initialState, {
      type: fetchIngredients.pending.type
    });

    expect(newState.ingredients).toEqual([]);
    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.error).toBe(null);
  });

  it('Action ingredients/getAll/rejected', () => {
    const initialState = {
      ...initialIngredientsState,
      ingredients: [],
      error: null,
      isIngredientsLoading: true
    };

    const newState = ingredientsSlice.reducer(initialState, {
      type: fetchIngredients.rejected.type,
      error: { message: 'Error message' }
    });

    expect(newState.error).toBe('Error message');
    expect(newState.ingredients).toEqual([]);
    expect(newState.isIngredientsLoading).toBe(false);
  });

  it('Action ingredients/getAll/fulfilled', () => {
    const initalState = {
      ...initialIngredientsState,
      ingredients: [],
      isIngredientsLoading: true
    };

    const newState = ingredientsSlice.reducer(initalState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    expect(newState.error).toBe(null);
    expect(newState.isIngredientsLoading).toBe(false);
    expect(newState.ingredients).toEqual(mockIngredients);
  });

  it('Async action fetchIngredients', async () => {
    getIngredientsApiSpy.mockResolvedValue(mockIngredients);

    await store.dispatch(fetchIngredients());

    const ingredients = ingredientsSelector(store.getState());

    expect(ingredients).toEqual(mockIngredients);
    expect(getIngredientsApiSpy).toHaveBeenCalledTimes(1);
  });

  it('Unknown action', () => {
    const newState = ingredientsSlice.reducer(initialIngredientsState, {
      type: 'UNKNOWN'
    });

    expect(newState).toEqual(initialIngredientsState);
  });

  it('Undefined state', () => {
    const newState = ingredientsSlice.reducer(undefined, {
      type: fetchIngredients.pending.type
    });

    expect(newState.ingredients).toEqual([]);
    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.error).toBe(null);
  });
});
