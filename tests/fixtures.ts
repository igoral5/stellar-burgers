import { test as base } from '@playwright/test';
import { mockOrderResponse } from '@utils-data';

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
