import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Product, CartItem } from '../types/product';


interface CartState {
  items: Record<number, CartItem>
}

const initialState: CartState = {
  items: {},
}


export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state, 
      action: PayloadAction<{ product: Product; quantity: number }>
    ) => {
      const { product, quantity } = action.payload;
      const existingQuantity = state.items[product.id]?.quantity || 0

      state.items[product.id] = {
        product,
        quantity: existingQuantity + quantity,
      };
    },
    removeFromCart: (
      state,
      action: PayloadAction<number>
    ) => {
      delete state.items[action.payload]
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;
export default cartSlice.reducer;
