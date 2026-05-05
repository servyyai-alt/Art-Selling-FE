import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchProduct = createAsyncThunk('products/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchMeta = createAsyncThunk('products/fetchMeta', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/meta');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const addReview = createAsyncThunk('products/addReview', async ({ id, reviewData }, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/products/${id}/reviews`, reviewData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Review submission failed');
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    total: 0,
    pages: 0,
    loading: false,
    error: null,
    meta: { categories: [], artists: [], priceRange: { min: 0, max: 100000 } },
  },
  reducers: {
    clearCurrentProduct: (state) => { state.currentProduct = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.currentProduct = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchMeta.fulfilled, (state, action) => { state.meta = action.payload; })
      .addCase(addReview.rejected, (state, action) => { state.error = action.payload; });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
