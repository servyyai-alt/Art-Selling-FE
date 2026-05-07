import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/cart', { productId, quantity });
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/cart/${productId}`, { quantity });
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeItem', async (productId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/cart/${productId}`);
    return data.cart;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return { items: [], totalPrice: 0 };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], totalPrice: 0, loading: false, error: null },
  reducers: {
    resetCartState: (state) => {
      state.items = [];
      state.totalPrice = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.loading = false;
      state.items = action.payload?.items || [];
      state.totalPrice = action.payload?.totalPrice || 0;
    };
    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(addToCart.pending, (state) => { state.loading = true; })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(updateCartItem.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, setCart)
      .addMatcher((action) => action.type.endsWith('/rejected'), (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetCartState } = cartSlice.actions;
export default cartSlice.reducer;
