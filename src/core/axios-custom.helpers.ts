"use client";

import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { ENV } from "@/config/env";
import { tokenManager } from "@/core/tokenManager";
import { AuthService } from "@services/auth/authService";

// Tuỳ bạn: global loading event emitter
// Nếu bạn chưa có emitter, bạn có thể thay thế bằng 1 stub đơn giản
// hoặc tích hợp sau.
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

// —— Redux bridge để logout global ——
// (chúng ta sẽ inject dispatch & thunk sau từ Providers)
let externalDispatch: ((action: any) => void) | null = null;
let doLogoutThunk: (() => any) | null = null;

export function bindStoreHelpers(opts: {
  dispatch: (action: any) => void;
  doLogoutThunk: () => any; // ví dụ () => doLogout()
}) {
  externalDispatch = opts.dispatch;
  doLogoutThunk = opts.doLogoutThunk;
}

// —— tạo 2 axios instance ——
// authorizedAxiosInstance: dùng cho API cần auth
// publicAxiosInstance: dùng cho API public, hoặc login,...
// Cả 2 vẫn bật withCredentials để cookie HttpOnly có thể đi (nếu BE cần)
const authorizedAxiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Accept-Language": "en",
  },
});

const publicAxiosInstance: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  withCredentials: true,
});

// —— request interceptor ——
// authorizedAxiosInstance sẽ tự gắn Bearer accessToken
authorizedAxiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const at = tokenManager.getAccessToken();
    if (at) {
      config.headers.Authorization = `Bearer ${at}`;
    }
    // loading event
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

// publicAxiosInstance cũng có loading event, nhưng KHÔNG gắn Bearer
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

// —— refresh queue logic ——
// giống style bạn đưa: nếu nhiều request cùng 401,
// chỉ refresh 1 lần, các request khác đợi.
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (reason: unknown) => void;
}> = [];

function processQueue(error: AxiosError | null, token: string | null = null) {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      p.resolve(token);
    }
  });
  failedQueue = [];
}

// —— common response handler ——
// clear loading on success
function handleResponse(response: AxiosResponse) {
  loadingEventEmitter.emit(EMIT_KEY.LOADING, false);
  return response;
}

// —— token refresh handler ——
// gọi khi nhận 401 lần đầu
async function handleTokenRefresh(
  error: AxiosError,
  originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
) {
  // Nếu đang refresh, xếp request này vào hàng đợi,
  // đợi refresh xong sẽ retry.
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
      .then((newToken) => {
        if (originalRequest.headers && newToken) {
          originalRequest.headers["Authorization"] =
            `Bearer ${newToken as string}`;
        }
        return authorizedAxiosInstance(originalRequest);
      })
      .catch((err) => {
        throw err;
      });
  }

  // Lần đầu tiên request này gặp 401
  originalRequest._retry = true;
  isRefreshing = true;

  try {
    // GỌI refresh-session, server sẽ đọc cookie HttpOnly
    const newAccessToken = await AuthService.refreshSession(); // string | null

    if (newAccessToken) {
      // set header cho request gốc trước khi retry
      if (originalRequest.headers) {
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
      }
      // báo cho mọi request đã đợi
      processQueue(null, newAccessToken);

      return authorizedAxiosInstance(originalRequest);
    }

    // refresh thất bại => clear queue với lỗi
    processQueue(error as AxiosError, null);
    // logout global
    await AuthService.apiLogout();
    if (externalDispatch && doLogoutThunk) {
      externalDispatch(doLogoutThunk());
    }
    return Promise.reject(error);
  } catch (refreshErr) {
    // refresh ném lỗi → toàn bộ queue fail
    processQueue(refreshErr as AxiosError, null);

    // logout global
    await AuthService.apiLogout();
    if (externalDispatch && doLogoutThunk) {
      externalDispatch(doLogoutThunk());
    }

    return Promise.reject(refreshErr);
  } finally {
    isRefreshing = false;
  }
}

// —— common error handler ——
// - tắt loading
// - nếu 401 và chưa retry -> gọi handleTokenRefresh
// - nếu đã retry hoặc lỗi khác -> reject và có thể toast
function handleError(error: AxiosError<{ message?: string }>) {
  loadingEventEmitter.emit(EMIT_KEY.LOADING, false);

  const originalRequest = error.config as InternalAxiosRequestConfig & {
    _retry?: boolean;
  };

  // nếu 401 và chưa refresh
  if (error.response?.status === HTTP_UNAUTHORIZED && !originalRequest._retry) {
    return handleTokenRefresh(error, originalRequest);
  }

  // nếu đã retry (tức đã refresh 1 lần) thì không lặp vô hạn
  if (originalRequest._retry) {
    return Promise.reject(error);
  }

  // các lỗi khác (400, 403, 500, ...)
  // Bạn có thể show toast global ở đây:
  // showErrorToast(error);
  return Promise.reject(error);
}

// gắn interceptor response cho cả 2 instance
authorizedAxiosInstance.interceptors.response.use(handleResponse, handleError);
publicAxiosInstance.interceptors.response.use(handleResponse, handleError);

// EXPORT
export { authorizedAxiosInstance, publicAxiosInstance };
