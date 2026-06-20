import { test, expect } from './fixtures';

test('Order a burger using access token', async ({
  page,
  mockApi,
  mockAccesToken,
  mockGetUser
}) => {
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
  await expect(page.getByTestId('order-success')).toHaveText('106768');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Order a burger using refresh token', async ({
  page,
  mockApi,
  mockExpiredAccessToken,
  mockRefreshToken,
  mockGetUser
}) => {
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
  await expect(page.getByTestId('order-success')).toHaveText('106768');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Order a burger using manual login', async ({
  page,
  mockApi,
  mockGetUser
}) => {
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
  await expect(page.getByTestId('order-success')).toHaveText('106768');
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('order-success')).not.toBeVisible();
  await expect(
    page.getByTestId('burger-constructor-element')
  ).not.toBeVisible();
});

test('Close modal by press Esc', async ({ page, mockApi, mockGetUser }) => {
  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Close modal by click button', async ({ page, mockApi, mockGetUser }) => {
  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );
  await page.getByTestId('modal-close').click();
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Close modal by click modal overlay', async ({
  page,
  mockApi,
  mockGetUser
}) => {
  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('link')
    .click();
  await expect(page.getByTestId('modal')).toBeVisible();
  await expect(page.getByTestId('modal')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );
  await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('Register new user', async ({ page, mockApi, mockGetUser }) => {
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

test('Forgot password', async ({ page, mockApi, mockGetUser }) => {
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

test('Add ingredient', async ({ page, mockApi, mockGetUser }) => {
  await page.goto('/');
  await expect(page.getByTestId('ingredients')).toBeVisible();
  await page
    .getByRole('listitem')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
    .getByRole('button')
    .click();
  await expect(page.getByTestId('burger-constructor-element')).toContainText(
    'Биокотлета из марсианской Магнолии'
  );
});
