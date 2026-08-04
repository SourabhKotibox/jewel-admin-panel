import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../api/client";

export const fetchOrders = createAsyncThunk("orders/fetch", async (_, { rejectWithValue }) => {
  try {
    return await api("/orders");
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const ordersSlice = createSlice({
  name: "orders",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchOrders.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default ordersSlice.reducer;
