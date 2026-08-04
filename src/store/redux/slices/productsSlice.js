import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../api/client";

export const fetchProducts = createAsyncThunk("products/fetch", async (q, { rejectWithValue }) => {
  try {
    const query = q ? `?q=${encodeURIComponent(q)}` : "";
    return await api(`/products${query}`);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const productsSlice = createSlice({
  name: "products",
  initialState: { items: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      });
  },
});

export default productsSlice.reducer;
