import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import App from './App';
import * as api from './api/products';

const mockProducts = [
  { id: 1, name: 'Broccoli - 1 Kg', price: 120, image: 'broccoli.jpg', category: 'vegetables' },
  {
    id: 2,
    name: 'Cauliflower - 1 Kg',
    price: 60,
    image: 'cauliflower.jpg',
    category: 'vegetables',
  },
];

describe('Магазин овощей. Тесты', () => {
  beforeEach(() => {
    vi.spyOn(api, 'fetchProducts').mockResolvedValue(mockProducts);
  });

  it('1. Показывает loader при открытии страницы', () => {
    render(<App />);
    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });

  it('2. Загружает и выводит список продуктов', async () => {
    render(<App />);

    const Broccoli = await screen.findByText(/Broccoli/i);
    const Cauliflower = await screen.findByText(/Cauliflower/i);

    expect(Broccoli).toBeInTheDocument();
    expect(Cauliflower).toBeInTheDocument();
  });

  it('3. Изменяет значение количества при нажатии на "+" и "-"', async () => {
    render(<App />);

    const broccoli = await screen.findByText(/Broccoli/i);
    const card = (broccoli.closest('.mantine-Card-root') || broccoli.parentElement) as HTMLElement;

    const plusBadge = within(card).getByLabelText('Increase quantity');
    const minusBadge = within(card).getByLabelText('Decrease quantity');

    fireEvent.click(plusBadge);
    expect(within(card).getByText('2')).toBeInTheDocument();

    fireEvent.click(minusBadge);
    expect(within(card).getByText('1')).toBeInTheDocument();
  });

  it('4. Добавляет товар в корзину и обновляет информацию в шапке', async () => {
    render(<App />);

    await screen.findByText(/Broccoli/i);

    const addButtons = screen.getAllByRole('button', { name: /Add to cart/i });
    fireEvent.click(addButtons[0]);

    const cartButton = await screen.findByText(/Cart: 1 items/i);
    expect(cartButton).toBeInTheDocument();
  });

  it('5. Удаляет товар из корзины при клике на иконку удаления', async () => {
    render(<App />);

    await screen.findByText(/Broccoli/i);

    const addButtons = screen.getAllByRole('button', { name: /Add to cart/i });
    fireEvent.click(addButtons[0]);

    const cartButton = await screen.findByText(/Cart: 1 items/i);
    fireEvent.click(cartButton);

    const removeButton = await screen.findByRole('button', { name: /remove broccoli/i });
    fireEvent.click(removeButton);

    expect(screen.getByText(/Your cart is empty!/i)).toBeInTheDocument();
    expect(screen.getByText(/Cart: 0 items/i)).toBeInTheDocument();
  });

  it('6. Корректно добавляет в корзину несколько единиц одного товара', async () => {
    render(<App />);

    const broccoli = await screen.findByText(/Broccoli/i);
    const card = (broccoli.closest('.mantine-Card-root') || broccoli.parentElement) as HTMLElement;

    const plusBadge = within(card).getByLabelText('Increase quantity');
    const addToCartBtn = within(card).getByRole('button', { name: /Add to cart/i });

    fireEvent.click(plusBadge);
    fireEvent.click(plusBadge);
    expect(within(card).getByText('3')).toBeInTheDocument();

    fireEvent.click(addToCartBtn);

    const cartButton = await screen.findByText(/Cart: 3 items \(\$360\)/i);
    expect(cartButton).toBeInTheDocument();
  });
});
