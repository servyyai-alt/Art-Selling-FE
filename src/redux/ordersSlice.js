import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders/myorders');
    return data.orders;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.order;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createRazorpayOrder = createAsyncThunk('orders/createRazorpayOrder', async (amount, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payment/create-order', { amount });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create payment order');
  }
});

export const verifyPayment = createAsyncThunk('orders/verifyPayment', async (paymentData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payment/verify', paymentData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Payment verification failed');
  }
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: { items: [], currentOrder: null, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchMyOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(fetchOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => { state.loading = false; state.currentOrder = action.payload; })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(createRazorpayOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createRazorpayOrder.fulfilled, (state) => { state.loading = false; })
      .addCase(createRazorpayOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(verifyPayment.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(verifyPayment.fulfilled, (state) => { state.loading = false; })
      .addCase(verifyPayment.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default ordersSlice.reducer;
