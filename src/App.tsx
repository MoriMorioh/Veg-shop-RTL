import { useEffect } from 'react';
import { MantineProvider, Container } from '@mantine/core';
import { Provider } from 'react-redux';
import { store, useAppDispatch, useAppSelector } from './store/store';
import { fetchProducts, setQuantity } from './store/productsSlice';
import { addToCart, removeFromCart } from './store/cartSlice';
import { Header } from './components/Header/Header';
import { ProductGrid } from './components/ProductGrid/ProductGrid';
import type { Product } from './types/product';
import classes from './App.module.css';
import '@mantine/core/styles.css';

export function VegetableShopContent() {

  const dispatch = useAppDispatch();
  const { items: products, loading, quantities } = useAppSelector((state) => state.products);
  const cartItemsMap = useAppSelector((state) => state.cart.items);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleQtyChange = (id: number, delta: number) => {
    dispatch(setQuantity({ id, delta }));
  };

  const handleAddToCart = (product: Product) => {
    const qty = quantities[product.id] || 1;
    dispatch(addToCart({ product, quantity: qty }));
  };

  const handleRemoveFromCart = (id: number) => {
    dispatch(removeFromCart(id));
  };

  const cartList = Object.values(cartItemsMap);
  const totalItems = cartList.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartList.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className={classes.wrapper}>
      <Header
        cartItems={cartList}
        totalItems={totalItems}
        totalPrice={totalPrice}
        onRemoveItem={handleRemoveFromCart}
      />

      <Container size="lg" py="xl">
        <ProductGrid
          products={products}
          loading={loading}
          quantities={quantities}
          onQtyChange={handleQtyChange}
          onAddToCart={handleAddToCart}
        />
      </Container>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MantineProvider>
        <VegetableShopContent />
      </MantineProvider>
    </Provider>
  );
}