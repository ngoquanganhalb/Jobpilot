// /lib/axios-custom.helpers.ts
"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { ENV } from "@/config/env";
import { tokenManager } from "@/core/tokenManager";

class Emitter {
  private map = new Map<string, Set<(payload: any) => void>>();
  on(event: string, cb: (payload: any) => void) {
    if (!this.map.has(event)) this.map.set(event, new Set());
    this.map.get(event)!.add(cb);
  }
  off(event: string, cb: (payload: any) => void) {
    this.map.get(event)?.delete(cb);
  }
  emit(event: string, payload: any) {
    this.map.get(event)?.forEach((cb) => cb(payload));
  }
}

export const loadingEventEmitter = new Emitter();
export enum EMIT_KEY {
  LOADING = "LOADING",
}

const HTTP_UNAUTHORIZED = 401;

export const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en",
  },
});

export const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

// Request interceptors
authorizedAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const at = tokenManager.getAccessToken();
    if (at && !config.headers?.Authorization) {
      config.headers.Authorization = `Bearer ${at}`;
    }
    if (!config.headers?.["X-Skip-Loading"]) {
      loadingEventEmitter.emit(EMIT_KEY.LOADING, true);
    }
    return config;
  },
  (error) => {
    loadingEventEmitter.emit(EMIT_KEY.LOADING, false);
    return Promise.reject(error);
  }
);

publicAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers?.["X-Skip-Loading"]) {
      loadingEventEmitter.emit(EMIT_KEY.LOADING, true);
    }
    return config;
  },
  (error) => {
    loadingEventEmitter.emit(EMIT_KEY.LOADING, false);
    return Promise.reject(error);
  }
);

function handleResponse(response: AxiosResponse) {
  loadingEventEmitter.emit(EMIT_KEY.LOADING, false);
  return response.data;
}

async function handleError(error: AxiosError) {
  loadingEventEmitter.emit(EMIT_KEY.LOADING, false);

  const originalRequest = error.config as
    | (InternalAxiosRequestConfig & { _retry?: boolean })
    | undefined;
  const status = error.response?.status;

  // Nếu là request refresh hoặc logout => không retry để tránh loop
  const url = originalRequest?.url ?? "";
  const isAuthEndpoint = url.includes("/auth/logout");

  if (status === HTTP_UNAUTHORIZED && !isAuthEndpoint) {
    if (originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lazy import tránh circular
        const { AuthGateway } = await import("@/core/auth-gateway");
        await AuthGateway.refresh();

        // Cập nhật token
        const newToken = tokenManager.getAccessToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        return authorizedAxiosInstance(originalRequest);
      } catch (e: any) {
        return Promise.reject(e);
      }
    }
  }

  return Promise.reject(error);
}

authorizedAxiosInstance.interceptors.response.use(handleResponse, handleError);
publicAxiosInstance.interceptors.response.use(handleResponse, handleError);
