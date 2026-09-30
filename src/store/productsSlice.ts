import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Product } from '../types/product';
import { fetchProducts as fetchProductsApi } from '../api/products';

interface ProductsState {
    items: Product[];
    loading: boolean;
    error: string | null;
    quantities: Record<number, number>;
}

const initialState: ProductsState = {
    items: [],
    loading: false,
    error: null,
    quantities: {},
} 

export const fetchProducts = createAsyncThunk<Product[], void, { rejectValue: string }>(
  'products/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const data = await fetchProductsApi();
      return data;
    } catch (error) {
      return rejectWithValue('Failed to fetch products');
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setQuantity: (
      state,
      action: PayloadAction<{ id: number; delta: number }>
    ) => {
      const { id, delta } = action.payload;
      const currentQty = state.quantities[id] ?? 1;
      state.quantities[id] = Math.max(1, currentQty + delta);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        action.payload.forEach((product) => {
          if (state.quantities[product.id] === undefined) {
            state.quantities[product.id] = 1;
          }
        });
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Unknown error';
      });
  },
});

export const { setQuantity } = productsSlice.actions;
export default productsSlice.reducer;