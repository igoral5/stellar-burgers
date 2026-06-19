import { test as base } from '@playwright/test';

const mockOrderResponse = {
  success: true,
  name: 'Минеральный био-марсианский краторный бургер',
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
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
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
        image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
        __v: 0
      },
      {
        _id: '643d69a5c3f7b9001cfa0946',
        name: 'Хрустящие минеральные кольца',
        type: 'main',
        proteins: 808,
        fat: 689,
        carbohydrates: 609,
        calories: 986,
        price: 300,
        image: 'https://code.s3.yandex.net/react/code/mineral_rings.png',
        image_mobile:
          'https://code.s3.yandex.net/react/code/mineral_rings-mobile.png',
        image_large:
          'https://code.s3.yandex.net/react/code/mineral_rings-large.png',
        __v: 0
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
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
        __v: 0
      }
    ],
    _id: '6a33c10a6a172d001b98cfe4',
    owner: {
      name: 'Jonh Doe',
      email: 'user@exampl.com',
      createdAt: '2026-06-04T06:30:47.300Z',
      updatedAt: '2026-06-05T07:21:51.331Z'
    },
    status: 'done',
    name: 'Минеральный био-марсианский краторный бургер',
    createdAt: '2026-06-18T09:57:30.363Z',
    updatedAt: '2026-06-18T09:57:30.436Z',
    number: 106657,
    price: 3234
  }
};

type TMockFixtures = {
  mockIngredients: void;
  mockGetUser: void;
  mockOrder: void;
  mockToken: void;
  mockLogin: void;
  mockRegister: void;
  mockPasswordReset: void;
  mockReset: void;
  mockAccesToken: void;
  mockExpiredAccessToken: void;
  mockRefreshToken: void;
};

export const test = base.extend<TMockFixtures>({
  mockIngredients: async ({ page }, use) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
      url: '**/api/ingredients',
      update: false
    });
    await use();
  },

  mockGetUser: async ({ page }, use) => {
    await page.route('**/api/auth/user', async (route) => {
      const request = route.request();

      const headers = await request.allHeaders();

      if ('authorization' in headers) {
        const value = headers['authorization'];
        switch (value) {
          case 'Bearer accessToken':
            await route.fulfill({
              status: 200,
              json: {
                success: true,
                user: {
                  email: 'user@example.com',
                  name: 'John Doe'
                }
              }
            });
            break;
          case 'Bearer expiredAccessToken':
            await route.fulfill({
              status: 401,
              json: { success: false, message: 'jwt expired' }
            });
            break;
          default:
            await route.fulfill({
              status: 401,
              json: { success: false, message: 'You should be authorised' }
            });
            break;
        }
      } else {
        await route.fulfill({
          status: 401,
          json: { success: false, message: 'You should be authorised' }
        });
      }
    });
    await use();
  },

  mockOrder: async ({ page }, use) => {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        json: mockOrderResponse
      });
    });
    await use();
  },

  mockToken: async ({ page }, use) => {
    await page.route('**/api/auth/token', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          accessToken: 'Bearer accessToken',
          refreshToken: 'refreshToken'
        }
      });
    });
    await use();
  },

  mockLogin: async ({ page }, use) => {
    await page.route('**/api/auth/login', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          accessToken: 'Bearer accessToken',
          refreshToken: 'refreshToken',
          user: {
            email: 'user@example.com',
            name: 'John Doe'
          }
        }
      });
    });
    await use();
  },

  mockRegister: async ({ page }, use) => {
    await page.route('**/api/auth/register', async (route) => {
      await route.fulfill({
        status: 200,
        json: {
          success: true,
          accessToken: 'Bearer accessToken',
          refreshToken: 'refreshToken',
          user: {
            email: 'user@example.com',
            name: 'John Doe'
          }
        }
      });
    });
    await use();
  },

  mockPasswordReset: async ({ page }, use) => {
    await page.route('**/api/password-reset', async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, message: 'Reset email sent' }
      });
    });
    await use();
  },

  mockReset: async ({ page }, use) => {
    await page.route('**/api/password-reset/reset', async (route) => {
      await route.fulfill({
        status: 200,
        json: { success: true, message: 'Password successfully reset' }
      });
    });
    await use();
  },

  mockAccesToken: async ({ context }, use) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer accessToken',
        domain: 'localhost',
        path: '/'
      }
    ]);
    await use();
  },

  mockExpiredAccessToken: async ({ context }, use) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer expiredAccessToken',
        domain: 'localhost',
        httpOnly: false,
        path: '/'
      }
    ]);
    await use();
  },

  mockRefreshToken: async ({ page }, use) => {
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'refreshToken');
    });
    await use();
  }
});

export { expect } from '@playwright/test';
