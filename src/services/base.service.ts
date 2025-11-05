import { authorizedAxiosInstance } from "@/core/axios-custom.helpers";
import { AxiosRequestConfig, AxiosResponse } from "axios";
interface ApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}
type CustomAxiosRequestConfig = Partial<AxiosRequestConfig> & {
  ignoreBaseURL?: boolean;
};
export abstract class BaseService {
  protected baseURL: string;

  protected constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  protected async get<T = any>(
    endpoint: string,
    config?: CustomAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<ApiResponse<T>> =
      await authorizedAxiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  protected async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<ApiResponse<T>> =
      await authorizedAxiosInstance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  protected async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<ApiResponse<T>> =
      await authorizedAxiosInstance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  protected async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<ApiResponse<T>> =
      await authorizedAxiosInstance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  protected async delete<T = any>(
    endpoint: string,
    config?: CustomAxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<ApiResponse<T>> =
      await authorizedAxiosInstance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }
}
