// ============================================
// 1. auth-gateway.ts - FIXED VERSION
// ============================================
"use client";

import { clearAuth, setUser } from "@redux/slices/authSlice";
import {
  authorizedAxiosInstance,
  publicAxiosInstance,
} from "./axios-custom.helpers";
import { store } from "@redux/store";
import { tokenManager } from "./tokenManager";
import { ProfileUser } from "@/dtos/auth/profile-user.dto";
import axios from "axios";
import { ENV } from "@/config/env";

let isRefreshing = false;
let authDisabled = false; // ← THÊM flag này
let queue: Array<{
  resolve: (v?: string | PromiseLike<string | undefined>) => void;
  reject: (r?: unknown) => void;
}> = [];

function wakeQueue(err: any, token?: string) {
  queue.forEach((p) => (err ? p.reject(err) : p.resolve(token)));
  queue = [];
}

let refreshFailCount = 0;
const MAX_REFRESH_RETRY = 3;

export const AuthGateway = {
  async getSession() {
    // ✅ FIX 1: Check authDisabled trước khi request
    if (authDisabled) {
      throw new Error("Auth disabled - please sign in");
    }

    try {
      const me = await authorizedAxiosInstance.get<ProfileUser>(
        "/users/profile",
        {
          headers: { "X-Skip-Loading": "1" },
          withCredentials: true,
        }
      );
      store.dispatch(
        setUser({ user: me.data.user, permissions: me.data?.permissions ?? [] })
      );
      this.resetAuthState();

      return me.data;
    } catch (err: any) {
      throw err;
    }
  },

  async refresh(): Promise<string | undefined> {
    // ✅ FIX 2: Check counter và authDisabled NGAY ĐẦU
    if (authDisabled || refreshFailCount >= MAX_REFRESH_RETRY) {
      if (!authDisabled) {
        this.performGlobalLogout({ redirectTo: "/sign-in" });
      }
      throw new Error("Max refresh attempts exceeded");
    }

    // Queue logic
    if (isRefreshing) {
      return new Promise<string | undefined>((resolve, reject) => {
        queue.push({ resolve, reject });
      });
    }

    isRefreshing = true;

    // Plain axios để tránh interceptor loop
    const plainAxios = axios.create({
      baseURL: ENV.API_BASE_URL,
      withCredentials: true,
    });

    try {
      console.log("🔄 Refreshing token...");

      const res = await plainAxios.post(
        "/auth/refresh-session",
        {},
        {
          headers: { "X-Skip-Loading": "1" },
          withCredentials: true,
        }
      );

      const newAccessToken: string | undefined = res.data.data.accessToken;

      if (newAccessToken) {
        tokenManager.setAccessToken(newAccessToken);
        console.log("✅ Token refreshed successfully");
      }

      // Reset counter on success
      refreshFailCount = 0;
      wakeQueue(null, newAccessToken);
      return newAccessToken;
    } catch (e) {
      refreshFailCount++;
      console.warn(
        `❌ Refresh failed (${refreshFailCount}/${MAX_REFRESH_RETRY})`
      );

      wakeQueue(e);

      // ✅ FIX 3: Logout ngay khi đạt max
      if (refreshFailCount >= MAX_REFRESH_RETRY) {
        console.warn("🚫 Max retries reached - logging out");
        this.performGlobalLogout({ redirectTo: "/sign-in" });
      }

      throw e;
    } finally {
      isRefreshing = false;
    }
  },

  async performGlobalLogout(opts?: { redirectTo?: string }) {
    // ✅ FIX 4: Prevent multiple logout calls
    if (authDisabled) {
      return;
    }

    console.log("🚪 Logging out...");
    authDisabled = true; // Set flag TRƯỚC khi logout

    try {
      await publicAxiosInstance.post(
        "/auth/logout",
        {},
        {
          headers: { "X-Skip-Loading": "1" },
          withCredentials: true,
        }
      );
    } catch (err) {
      console.warn("Logout API failed (ignoring):", err);
    }

    // Reset state
    refreshFailCount = 0;
    tokenManager.clear();
    store.dispatch(clearAuth());

    // Redirect
    if (opts?.redirectTo && typeof window !== "undefined") {
      window.location.href = opts.redirectTo;
    }
  },

  // ✅ FIX 5: Reset state sau khi login thành công
  resetAuthState() {
    authDisabled = false;
    refreshFailCount = 0;
    isRefreshing = false;
    queue = [];
    console.log("🔓 Auth state reset");
  },
};
