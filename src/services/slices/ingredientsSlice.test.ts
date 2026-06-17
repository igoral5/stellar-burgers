import { TIngredient } from '@utils-types';
import store from '@services';
import {
  fetchIngredients,
  ingredientsSelector,
  ingredientsSlice,
  initialIngredientsState
} from '@slices';
import { getIngredientsApi } from '@api';

const mockIngredients: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  },
  {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png'
  }
];

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
      type: 'ingredients/getAll/pending'
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
      type: 'ingredients/getAll/rejected',
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
      type: 'ingredients/getAll/fulfilled',
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
      type: 'ingredients/getAll/pending'
    });

    expect(newState.ingredients).toEqual([]);
    expect(newState.isIngredientsLoading).toBe(true);
    expect(newState.error).toBe(null);
  });
});
