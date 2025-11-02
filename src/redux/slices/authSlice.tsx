import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthService } from "@services/auth/authService";

export interface AuthState {
  user: any | null;
  loading: boolean;
  initialized: boolean; // để biết đã gọi ensureSession lần đầu chưa
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
};

// export const loginWithEmail = createAsyncThunk<
//   User,
//   { email: string; password: string },
//   { rejectValue: string }
// >("auth/loginWithEmail", async (payload, thunkAPI) => {
//   try {
//     const user = await apiLoginWithEmail(payload.email, payload.password);
//     return user;
//   } catch (err) {
//     return thunkAPI.rejectWithValue("Invalid email or password");
//   }
// });

// export const loginWithGoogle = createAsyncThunk<
//   User,
//   { idToken: string },
//   { rejectValue: string }
// >("auth/loginWithGoogle", async ({ idToken }, thunkAPI) => {
//   try {
//     const user = await apiLoginWithGoogle(idToken);
//     return user;
//   } catch (err) {
//     return thunkAPI.rejectWithValue("Google login failed");
//   }
// });

// Thunk: ensureSession
// - Gọi khi app mount: nếu cookie refresh_token còn hợp lệ -> tự refresh -> tự get /me
export const ensureSession = createAsyncThunk<
  any | null,
  void,
  { rejectValue: string }
>("auth/ensureSession", async (_, thunkAPI) => {
  try {
    // 1. xin accessToken mới từ refresh_token cookie (nếu còn)
    const newToken = await AuthService.refreshSession();
    if (!newToken) {
      return null; // không có phiên
    }

    // 2. lấy profile với accessToken vừa refresh
    const me = await AuthService.apiGetProfile();
    return me ?? null;
  } catch (err) {
    return thunkAPI.rejectWithValue("Failed to restore session");
  }
});

// Thunk: logout
export const doLogout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/doLogout",
  async (_, thunkAPI) => {
    try {
      await AuthService.apiLogout();
    } catch (err) {
      return thunkAPI.rejectWithValue("Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // trong vài trường hợp bạn muốn set user thủ công
    setUser(state, action: PayloadAction<any | null>) {
      state.user = action.payload;
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
        // không đặt loading=true ở đây vì mình hay gọi lúc app mount
        // bạn có thể tùy chỉnh
        state.error = null;
      })
      .addCase(ensureSession.fulfilled, (state, action) => {
        state.initialized = true;
        state.user = action.payload; // có thể là null
      })
      .addCase(ensureSession.rejected, (state, action) => {
        state.initialized = true;
        state.user = null;
        state.error = action.payload ?? "Session restore failed";
      });

    // doLogout
    builder
      .addCase(doLogout.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(doLogout.rejected, (state) => {
        state.user = null; // dù lỗi thì local vẫn clear
      });
  },
});

export const { setUser } = authSlice.actions;
export default authSlice.reducer;
