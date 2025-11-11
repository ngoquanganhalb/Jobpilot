import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService } from "@services/auth/authService";

export interface AuthState {
  user: any | null;
  loading: boolean;
  initialized: boolean; // để biết đã gọi ensureSession lần đầu chưa
  error: string | null;
  permissions: any[];
}
type UserProfilePayload = {
  user: any;
  permissions: any[];
};
const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
  permissions: [],
};

// Thunk: ensureSession
// - Gọi khi app mount: nếu cookie refresh_token còn hợp lệ -> tự refresh -> tự get /me
export const ensureSession = createAsyncThunk<
  any | null,
  void,
  { rejectValue: string }
>("auth/ensureSession", async (_, thunkAPI) => {
  try {
    // 1. xin accessToken mới từ refresh_token cookie (nếu còn)
    const newToken = await authService.refreshSession();
    if (!newToken) {
      return null; // không có phiên
    }

    // 2. lấy profile với accessToken vừa refresh
    const me = await authService.apiGetProfile();
    return me ?? null;
  } catch {
    return thunkAPI.rejectWithValue("Failed to restore session");
  }
});
// Thunk: logout là hàm bđb
export const doLogout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/doLogout",
  async (_, thunkAPI) => {
    try {
      await authService.apiLogout();
      thunkAPI.dispatch(clearAuth());
    } catch {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // trong vài trường hợp bạn muốn set user thủ công
    setUser(state, action: PayloadAction<UserProfilePayload>) {
      state.user = action.payload.user;
      state.permissions = action.payload.permissions ?? [];
      state.error = null;
    },
    clearAuth() {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // loginWithEmail
    // builder
    //   .addCase(loginWithEmail.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginWithEmail.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload;
    //   })
    //   .addCase(loginWithEmail.rejected, (state, action) => {
    //     state.loading = false;
    //     state.user = null;
    //     state.error = action.payload ?? "Login failed";
    //   });

    // loginWithGoogle
    // builder
    //   .addCase(loginWithGoogle.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(loginWithGoogle.fulfilled, (state, action) => {
    //     state.loading = false;
    //     state.user = action.payload;
    //   })
    //   .addCase(loginWithGoogle.rejected, (state, action) => {
    //     state.loading = false;
    //     state.user = null;
    //     state.error = action.payload ?? "Login failed";
    //   });

    // ensureSession
    builder
      .addCase(ensureSession.pending, (state) => {
        state.error = null;
      })
      .addCase(
        ensureSession.fulfilled,
        (state, action: PayloadAction<UserProfilePayload>) => {
          if (action.payload) {
            state.user = action.payload.user;
            state.permissions = action.payload.permissions ?? [];
          } else {
            state.user = null;
            state.permissions = [];
          }
        }
      )
      .addCase(ensureSession.rejected, (state, action) => {
        state.initialized = true;
        state.user = null;
        state.permissions = [];
        state.error = action.payload ?? "Session restore failed";
      });

    // doLogout
    builder
      .addCase(doLogout.fulfilled, (state) => {
        state.user = null;
        state.permissions = [];
      })
      .addCase(doLogout.rejected, (state) => {
        state.user = null;
        state.permissions = [];
      });
  },
});

export const { setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
