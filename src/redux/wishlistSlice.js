import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

const normalizeWishlist = (wishlist = []) => wishlist.map((item) => (typeof item === 'string' ? item : item._id));

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/wishlist');
    return data.wishlist;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (productId, { rejectWithValue, getState }) => {
  try {
    const { data } = await api.post(`/wishlist/toggle/${productId}`);
    const state = getState();
    const product =
      state.products.currentProduct?._id === productId
        ? state.products.currentProduct
        : state.products.items.find((item) => item._id === productId)
          || state.wishlist.products.find((item) => item._id === productId)
          || null;

    return { ...data, product };
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: [], products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload || [];
        state.items = normalizeWishlist(action.payload);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleWishlist.pending, (state) => {
        state.error = null;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = normalizeWishlist(action.payload.wishlist);

        if (action.payload.action === 'removed') {
          state.products = state.products.filter((item) => item._id !== action.meta.arg);
          return;
        }

        if (action.payload.action === 'added' && action.payload.product) {
          const exists = state.products.some((item) => item._id === action.payload.product._id);
          if (!exists) state.products.unshift(action.payload.product);
        }
      });
  },
});

export default wishlistSlice.reducer;
