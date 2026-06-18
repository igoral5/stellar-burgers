import { test, expect } from '@playwright/test';

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

test('Order a burger using access token', async ({ context, page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer accessToken',
      domain: 'localhost',
      path: '/'
    }
  ]);

  await page.route('**/api/auth/user', async (route) => {
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
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      json: mockOrderResponse
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Краторная булка N-200i' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Хрустящие минеральные кольца' })
    .getByRole('button')
    .click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await expect(page.getByTestId('order-success')).toBeVisible({
    timeout: 20000
  });
  await expect(page.getByTestId('order-success')).toHaveText('106657');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Order a burger using refresh token', async ({ context, page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer expiredAccessToken',
      domain: 'localhost',
      httpOnly: false,
      path: '/'
    }
  ]);

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'refreshToken');
  });

  await page.route('**/api/auth/user', async (route) => {
    const request = route.request();

    const headers = await request.allHeaders();

    if ('authorization' in headers) {
      const value = headers['authorization'];
      if (value === 'Bearer expiredAccessToken') {
        await route.fulfill({
          status: 401,
          json: { success: false, message: 'jwt expired' }
        });
      } else {
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
      }
    } else {
      await route.fulfill({
        status: 401,
        json: { success: false, message: 'You should be authorised' }
      });
    }
  });

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

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      json: mockOrderResponse
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Краторная булка N-200i' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Хрустящие минеральные кольца' })
    .getByRole('button')
    .click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await expect(page.getByTestId('order-success')).toBeVisible({
    timeout: 20000
  });
  await expect(page.getByTestId('order-success')).toHaveText('106657');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Order a burger using manual login', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    const request = route.request();

    const headers = await request.allHeaders();

    if (
      'authorization' in headers &&
      headers['authorization'] === 'Bearer accessToken'
    ) {
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
    } else {
      await route.fulfill({
        status: 401,
        json: { success: false, message: 'You should be authorised' }
      });
    }
  });

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

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      json: mockOrderResponse
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Краторная булка N-200i' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('button')
    .click();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Хрустящие минеральные кольца' })
    .getByRole('button')
    .click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await page.locator('input[name="email"]').fill('user@example.com');
  await page.locator('input[name="password"]').fill('secretpassword');
  await page.getByRole('button', { name: 'Войти' }).click();
  await page.getByRole('button', { name: 'Оформить заказ' }).click();
  await expect(page.getByTestId('order-success')).toBeVisible({
    timeout: 20000
  });
  await expect(page.getByTestId('order-success')).toHaveText('106657');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Close modal by press Esc', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 401,
      json: { success: false, message: 'You should be authorised' }
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Close modal by click button', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 401,
      json: { success: false, message: 'You should be authorised' }
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await page.getByRole('button').filter({ hasText: /^$/ }).click();
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Close modal by click modal overlay', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 401,
      json: { success: false, message: 'You should be authorised' }
    });
  });

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Register new user', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    const request = route.request();

    const headers = await request.allHeaders();

    if (
      'authorization' in headers &&
      headers['authorization'] === 'Bearer accessToken'
    ) {
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
    } else {
      await route.fulfill({
        status: 401,
        json: { success: false, message: 'You should be authorised' }
      });
    }
  });

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

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page.getByRole('link', { name: 'Личный кабинет' }).click();
  await page.getByRole('link', { name: 'Зарегистрироваться' }).click();
  await page.locator('input[name="name"]').fill('John Doe');
  await page.locator('input[name="email"]').fill('user@example.com');
  await page.locator('input[name="password"]').fill('secretpassword');
  await page.getByRole('button', { name: 'Зарегистрироваться' }).click();
  await expect(page.getByRole('link', { name: 'John Doe' })).toBeVisible();
});

test('Forgot password', async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });

  await page.route('**/api/auth/user', async (route) => {
    const request = route.request();

    const headers = await request.allHeaders();

    if (
      'authorization' in headers &&
      headers['authorization'] === 'Bearer accessToken'
    ) {
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
    } else {
      await route.fulfill({
        status: 401,
        json: { success: false, message: 'You should be authorised' }
      });
    }
  });

  await page.route('**/api/password-reset', async (route) => {
    await route.fulfill({
      status: 200,
      json: { success: true, message: 'Reset email sent' }
    });
  });

  await page.route('**/api/password-reset/reset', async (route) => {
    await route.fulfill({
      status: 200,
      json: { success: true, message: 'Password successfully reset' }
    });
  });

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

  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page.getByRole('link', { name: 'Личный кабинет' }).click();
  await page.getByRole('link', { name: 'Восстановить пароль' }).click();
  await page.locator('input[name="email"]').fill('user@example.com');
  await page.getByRole('button', { name: 'Восстановить' }).click();
  await page.locator('input[name="password"]').fill('secretpassword');
  await page.locator('input[name="token"]').fill('tokenFromEmail');
  await page.getByRole('button', { name: 'Сохранить' }).click();
  await page.locator('input[name="email"]').fill('user@example.com');
  await page.locator('input[name="password"]').fill('secretpassword');
  await page.getByRole('button', { name: 'Войти' }).click();
  await expect(page.getByRole('link', { name: 'John Doe' })).toBeVisible();
});
