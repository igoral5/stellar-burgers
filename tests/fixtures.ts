import { test as base } from '@playwright/test';

type TMockFixtures = {
  mockApi: void;
  mockGetUser: void;
  mockAccesToken: void;
  mockExpiredAccessToken: void;
  mockRefreshToken: void;
};

export const test = base.extend<TMockFixtures>({
  mockApi: async ({ page }, use) => {
    await page.routeFromHAR('./tests/hars/api.har', {
      url: '**/api/**',
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
