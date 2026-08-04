import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, TOKEN_KEYS, USER_KEYS } from "../../../api/client";

function readJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function persist(portal, token, user) {
  if (portal === "admin") {
    localStorage.setItem(TOKEN_KEYS.admin, token);
    localStorage.setItem(USER_KEYS.admin, JSON.stringify(user));
    // keep legacy keys for older code paths
    localStorage.setItem(TOKEN_KEYS.legacy, token);
    localStorage.setItem(USER_KEYS.legacy, JSON.stringify(user));
  } else {
    localStorage.setItem(TOKEN_KEYS.user, token);
    localStorage.setItem(USER_KEYS.user, JSON.stringify(user));
  }
}

function clearPortal(portal) {
  if (portal === "admin") {
    localStorage.removeItem(TOKEN_KEYS.admin);
    localStorage.removeItem(USER_KEYS.admin);
    localStorage.removeItem(TOKEN_KEYS.legacy);
    localStorage.removeItem(USER_KEYS.legacy);
  } else {
    localStorage.removeItem(TOKEN_KEYS.user);
    localStorage.removeItem(USER_KEYS.user);
  }
}

const ADMIN_ROLES = ["admin", "superadmin", "manager", "sales", "editor"];

export const adminLogin = createAsyncThunk(
  "auth/adminLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await api("/auth/admin/login", {
        method: "POST",
        body: { email, password },
        portal: "admin",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const userLogin = createAsyncThunk(
  "auth/userLogin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await api("/auth/user/login", {
        method: "POST",
        body: { email, password },
        portal: "user",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const userRegister = createAsyncThunk(
  "auth/userRegister",
  async (payload, { rejectWithValue }) => {
    try {
      // Support avatar file via multipart, otherwise JSON
      if (payload instanceof FormData || payload?.avatarFile) {
        const fd = payload instanceof FormData ? payload : new FormData();
        if (!(payload instanceof FormData)) {
          Object.entries(payload).forEach(([k, v]) => {
            if (k === "avatarFile" || v === undefined || v === null) return;
            if (k === "avatar" && typeof v !== "string") return;
            fd.append(k, v);
          });
          if (payload.avatarFile) fd.append("avatar", payload.avatarFile);
        }
        return await api("/auth/user/register", {
          method: "POST",
          formData: fd,
          portal: "user",
        });
      }
      return await api("/auth/user/register", {
        method: "POST",
        body: payload,
        portal: "user",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAdminMe = createAsyncThunk("auth/adminMe", async (_, { rejectWithValue }) => {
  try {
    return await api("/auth/admin/me", { portal: "admin" });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchUserMe = createAsyncThunk("auth/userMe", async (_, { rejectWithValue }) => {
  try {
    return await api("/auth/user/me", { portal: "user" });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const updateCustomerProfile = createAsyncThunk(
  "auth/updateCustomerProfile",
  async (body, { rejectWithValue }) => {
    try {
      return await api("/auth/user/profile", {
        method: "PUT",
        body,
        portal: "user",
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

/** Legacy aliases */
export const login = adminLogin;
export const register = userRegister;
export const fetchMe = fetchAdminMe;

const initialAdminUser = readJson(USER_KEYS.admin) || readJson(USER_KEYS.legacy);
const initialAdminToken = localStorage.getItem(TOKEN_KEYS.admin) || localStorage.getItem(TOKEN_KEYS.legacy);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    // Admin portal
    user: initialAdminUser,
    token: initialAdminToken,
    // Storefront portal
    customer: readJson(USER_KEYS.user),
    customerToken: localStorage.getItem(TOKEN_KEYS.user),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      clearPortal("admin");
    },
    logoutCustomer(state) {
      state.customer = null;
      state.customerToken = null;
      state.error = null;
      clearPortal("user");
    },
    logoutAll(state) {
      state.user = null;
      state.token = null;
      state.customer = null;
      state.customerToken = null;
      state.error = null;
      clearPortal("admin");
      clearPortal("user");
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state) => {
      state.loading = true;
      state.error = null;
    };
    const rejected = (state, action) => {
      state.loading = false;
      state.error = action.payload || "Auth failed";
    };

    builder
      .addCase(adminLogin.pending, pending)
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        if (!ADMIN_ROLES.includes(action.payload.user?.role)) {
          state.error = "Not an admin account";
          return;
        }
        state.token = action.payload.token;
        state.user = action.payload.user;
        persist("admin", action.payload.token, action.payload.user);
      })
      .addCase(adminLogin.rejected, rejected)

      .addCase(userLogin.pending, pending)
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.customerToken = action.payload.token;
        state.customer = action.payload.user;
        persist("user", action.payload.token, action.payload.user);
      })
      .addCase(userLogin.rejected, rejected)

      .addCase(userRegister.pending, pending)
      .addCase(userRegister.fulfilled, (state, action) => {
        state.loading = false;
        state.customerToken = action.payload.token;
        state.customer = action.payload.user;
        persist("user", action.payload.token, action.payload.user);
      })
      .addCase(userRegister.rejected, rejected)

      .addCase(fetchAdminMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
        localStorage.setItem(USER_KEYS.admin, JSON.stringify(action.payload.user));
        localStorage.setItem(USER_KEYS.legacy, JSON.stringify(action.payload.user));
      })
      .addCase(fetchAdminMe.rejected, (state) => {
        state.user = null;
        state.token = null;
        clearPortal("admin");
      })

      .addCase(fetchUserMe.fulfilled, (state, action) => {
        state.customer = action.payload.user;
        localStorage.setItem(USER_KEYS.user, JSON.stringify(action.payload.user));
      })
      .addCase(fetchUserMe.rejected, (state) => {
        state.customer = null;
        state.customerToken = null;
        clearPortal("user");
      })

      .addCase(updateCustomerProfile.pending, pending)
      .addCase(updateCustomerProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.user;
        localStorage.setItem(USER_KEYS.user, JSON.stringify(action.payload.user));
      })
      .addCase(updateCustomerProfile.rejected, rejected);
  },
});

export const { logout, logoutCustomer, logoutAll, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
