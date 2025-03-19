import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export type RequestConfig = AxiosRequestConfig;
export type Response<T> = AxiosResponse<T>;

const api = axios.create({
  // baseURL: config.REST_API_URL,
  // withCredentials: true,
});

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.log("error: ", error.response);

//     if (error.response.data.message === "Not authenticated") {
//     }

//     return Promise.reject(error.response.data.err);
//   }
// );

/**
 * Service to encapsulate axios in case we want to remove axios later on.
 */
class RestRequestService {
  /**
   * Performs a GET request.
   * @param url - Request url
   * @param config  - Request configs
   */
  public static get<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<Response<T>> {
    return api.get<T, Response<T>>(url, config);
  }

  /**
   * Performs a POST request.
   * @param url - Request url
   * @param config  - Request configs
   */
  public static post<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<Response<T>> {
    return api.post<T, Response<T>>(url, data, config);
  }

  /**
   * Performs a PATCH request.
   * @param url - Request url
   * @param config  - Request configs
   */
  public static patch<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<Response<T>> {
    return api.patch<T, Response<T>>(url, data, config);
  }

  /**
   * Performs a PATCH request.
   * @param url - Request url
   * @param config  - Request configs
   */
  public static put<T>(
    url: string,
    data?: unknown,
    config?: RequestConfig
  ): Promise<Response<T>> {
    return api.put<T, Response<T>>(url, data, config);
  }

  /**
   * Performs a GET request.
   * @param url - Request url
   * @param config  - Request configs
   */
  public static delete<T>(
    url: string,
    config?: RequestConfig
  ): Promise<Response<T>> {
    return api.delete<T, Response<T>>(url, config);
  }
}

export default RestRequestService;
