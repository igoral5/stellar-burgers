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
import { mockIngredients, mockOrderResponse } from '@utils-data';
import { v4 as uuidv4 } from 'uuid';



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
      type: orderSend.pending.type
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
      type: orderSend.rejected.type,
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
      type: orderSend.fulfilled.type,
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
