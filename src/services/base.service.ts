import { authorizedAxiosInstance } from "@/core/axios-custom.helpers";
import { AxiosRequestConfig, AxiosResponse } from "axios";
// interface  {
//   message: string;
//   statusCode: number;
//   data: T;
// }
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
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<T> = await authorizedAxiosInstance.get<T>(
      url,
      config
    );
    return response.data;
  }

  protected async post<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<T> = await authorizedAxiosInstance.post<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  protected async patch<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<T> = await authorizedAxiosInstance.patch<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  protected async put<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<T> = await authorizedAxiosInstance.put<T>(
      url,
      data,
      config
    );
    return response.data;
  }

  protected async delete<T = any>(
    endpoint: string,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response: AxiosResponse<T> = await authorizedAxiosInstance.delete<T>(
      url,
      config
    );
    return response.data;
  }

  protected async postResponse<T = any, D = any>(
    endpoint: string,
    data?: D,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response = await authorizedAxiosInstance.post<T>(url, data, config);
    const dataResponse: any = response;

    return dataResponse;
  }

  protected async getResponse<T = any>(
    endpoint: string,
    config?: CustomAxiosRequestConfig
  ): Promise<T> {
    const url = config?.ignoreBaseURL ? endpoint : `${this.baseURL}${endpoint}`;
    const response = await authorizedAxiosInstance.get<T>(url, config);
    const dataResponse: any = response;

    return dataResponse;
  }
}
