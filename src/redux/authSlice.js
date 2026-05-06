import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials);
    localStorage.setItem('artt_token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    localStorage.setItem('artt_token', data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const changePassword = createAsyncThunk('auth/changePassword', async (passwordData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/password', passwordData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Password update failed');
  }
});

export const addUserAddress = createAsyncThunk('auth/addUserAddress', async (addressData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/users/addresses', addressData);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to save address');
  }
});

export const deleteUserAddress = createAsyncThunk('auth/deleteUserAddress', async (addressId, { rejectWithValue }) => {
  try {
    const { data } = await api.delete(`/users/addresses/${addressId}`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete address');
  }
});

export const setDefaultAddress = createAsyncThunk('auth/setDefaultAddress', async (addressId, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/users/addresses/${addressId}/default`);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to set default address');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('artt_token') || null,
    loading: false,
    error: null,
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('artt_token');
    },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        localStorage.removeItem('artt_token');
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(addUserAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(deleteUserAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(setDefaultAddress.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
