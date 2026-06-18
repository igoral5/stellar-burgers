import { orderBurgerApi } from '@api';
import store from '@services';
import {
  addProduct,
  closeModal,
  initialOrderState,
  itemsSelector,
  moveDown,
  moveUp,
  orderSend,
  orderSlice,
  removeProduct,
  requestDataSelector,
  requestSelector
} from '@slices';
import { TIngredient } from '@utils-types';
import { v4 as uuidv4 } from 'uuid';

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

const mockOrderResponse = {
  success: true,
  name: 'Био-марсианский краторный бургер',
  order: {
    ingredients: [
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
        image_mobile:
          'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
      },
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
      }
    ],
    _id: '6a32d9996a172d001b98cecb',
    owner: {
      name: 'John Dow',
      email: 'user@example.com',
      createdAt: '2026-06-04T06:30:47.300Z',
      updatedAt: '2026-06-05T07:21:51.331Z'
    },
    status: 'done',
    name: 'Био-марсианский краторный бургер',
    createdAt: '2026-06-17T17:30:01.650Z',
    updatedAt: '2026-06-17T17:30:01.721Z',
    number: 106626,
    price: 2934
  }
};

jest.mock('@api', () => ({
  ...jest.requireActual('@api'),
  orderBurgerApi: jest.fn()
}));

const orderBurgerApiSpy = orderBurgerApi as jest.MockedFunction<
  typeof orderBurgerApi
>;

describe('Reducer order', () => {
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('Add bun', () => {
    const initialState = {
      ...initialOrderState,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const newState = orderSlice.reducer(
      initialState,
      addProduct(mockIngredients[0])
    );

    expect(newState.constructorItems).toEqual({
      bun: { ...mockIngredients[0], id: expect.any(String) },
      ingredients: []
    });
  });

  it('Add product', () => {
    const initialState = {
      ...initialOrderState,
      constructorItems: {
        bun: null,
        ingredients: []
      }
    };

    const newState = orderSlice.reducer(
      initialState,
      addProduct(mockIngredients[1])
    );

    expect(newState.constructorItems).toEqual({
      bun: null,
      ingredients: [
        {
          ...mockIngredients[1],
          id: expect.any(String)
        }
      ]
    });
  });

  it('Remove product', () => {
    const ingredients = [
      { ...mockIngredients[1], id: uuidv4() },
      { ...mockIngredients[2], id: uuidv4() },
      { ...mockIngredients[3], id: uuidv4() }
    ];
    const bun = { ...mockIngredients[0], id: uuidv4() };
    const initialState = {
      ...initialOrderState,
      constructorItems: {
        bun,
        ingredients
      }
    };

    const newState = orderSlice.reducer(
      initialState,
      removeProduct(ingredients[0].id)
    );
    expect(newState.constructorItems).toEqual({
      bun,
      ingredients: [ingredients[1], ingredients[2]]
    });
  });

  it('Move Up', () => {
    const bun = { ...mockIngredients[0], id: uuidv4() };
    const ingredients = [
      { ...mockIngredients[1], id: uuidv4() },
      { ...mockIngredients[2], id: uuidv4() },
      { ...mockIngredients[3], id: uuidv4() }
    ];
    const initalState = {
      ...initialOrderState,
      constructorItems: {
        bun,
        ingredients
      }
    };

    const newState = orderSlice.reducer(initalState, moveUp(1));

    expect(newState.constructorItems).toEqual({
      bun,
      ingredients: [ingredients[1], ingredients[0], ingredients[2]]
    });
  });

  it('Move Down', () => {
    const bun = { ...mockIngredients[0], id: uuidv4() };
    const ingredients = [
      { ...mockIngredients[1], id: uuidv4() },
      { ...mockIngredients[2], id: uuidv4() },
      { ...mockIngredients[3], id: uuidv4() }
    ];
    const initalState = {
      ...initialOrderState,
      constructorItems: {
        bun,
        ingredients
      }
    };

    const newState = orderSlice.reducer(initalState, moveDown(1));

    expect(newState.constructorItems).toEqual({
      bun,
      ingredients: [ingredients[0], ingredients[2], ingredients[1]]
    });
  });

  it('Close modal', () => {
    const ids = mockOrderResponse.order.ingredients.map((val) => val._id);
    const { owner, price, ...order } = mockOrderResponse.order;
    const initialState = {
      ...initialOrderState,
      orderModalData: { ...order, ingredients: ids }
    };

    const newState = orderSlice.reducer(initialState, closeModal());

    expect(newState.orderModalData).toBe(null);
  });

  it('Action order/send/pending', () => {
    const ids = mockOrderResponse.order.ingredients.map((val) => val._id);
    const { owner, price, ...order } = mockOrderResponse.order;
    const initialState = {
      ...initialOrderState,
      orderModalData: { ...order, ingredients: ids },
      orderRequest: false,
      orderError: 'Error'
    };

    const newState = orderSlice.reducer(initialState, {
      type: 'order/send/pending'
    });

    expect(newState.orderModalData).toBe(null);
    expect(newState.orderRequest).toBe(true);
    expect(newState.orderError).toBe(null);
  });

  it('Action order/send/rejected', () => {
    const initalState = {
      ...initialOrderState,
      orderRequest: true,
      orderError: null
    };

    const newState = orderSlice.reducer(initalState, {
      type: 'order/send/rejected',
      error: { message: 'Error message' }
    });

    expect(newState.orderRequest).toBe(false);
    expect(newState.orderError).toBe('Error message');
  });

  it('Action order/send/fulfilled', () => {
    const bun = { ...mockIngredients[0], id: uuidv4() };
    const ingredients = [
      { ...mockIngredients[1], id: uuidv4() },
      { ...mockIngredients[2], id: uuidv4() },
      { ...mockIngredients[3], id: uuidv4() }
    ];
    const initialState = {
      ...initialOrderState,
      constructorItems: {
        bun,
        ingredients
      },
      orderRequest: true,
      orderModalData: null
    };
    const ids = mockOrderResponse.order.ingredients.map((val) => val._id);
    const { owner, price, ...order } = mockOrderResponse.order;

    const newState = orderSlice.reducer(initialState, {
      type: 'order/send/fulfilled',
      payload: { ...order, ingredients: ids }
    });

    expect(newState).toEqual({
      ...initialOrderState,
      constructorItems: {
        bun: null,
        ingredients: []
      },
      orderRequest: false,
      orderModalData: { ...order, ingredients: ids }
    });
  });

  it('Async action orderSend', async () => {
    orderBurgerApiSpy.mockResolvedValue(mockOrderResponse);

    const ids = mockOrderResponse.order.ingredients.map((val) => val._id);

    await store.dispatch(orderSend(ids));

    const orderExcept = requestDataSelector(store.getState());
    const { owner, price, ...order } = mockOrderResponse.order;
    expect(orderExcept).toEqual({ ...order, ingredients: ids });

    const items = itemsSelector(store.getState());
    expect(items).toEqual({ bun: null, ingredients: [] });

    const isLoading = requestSelector(store.getState());
    expect(isLoading).toBe(false);
  });

  it('Unknown action', () => {
    const newState = orderSlice.reducer(initialOrderState, { type: 'UNKNOWN' });

    expect(newState).toEqual(initialOrderState);
  });

  it('Undefined state', () => {
    const newState = orderSlice.reducer(undefined, {type: 'order/send/pending'})

    expect(newState.orderRequest).toBe(true);
    expect(newState.orderModalData).toBe(null);
    expect(newState.orderError).toBe(null);
  })
});
