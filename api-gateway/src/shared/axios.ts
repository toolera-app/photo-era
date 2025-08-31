import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import configs from "../config";

const HttpService = (baseUrl: string): AxiosInstance => {
  const instance = axios.create({
    baseURL: baseUrl,
    timeout: 10000,
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // Ensure headers are defined to avoid type issues
      config.headers = config.headers || {};

      // Detect if data is FormData; avoid setting Content-Type manually
      if (config.data && typeof config.data.append === "function" && config.data.constructor.name === "FormData") {
        // Do not set Content-Type explicitly; let Axios handle it
        delete config.headers["Content-Type"];
      } else {
        config.headers["Content-Type"] = "application/json";
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => {
      return error;
    },
  );

  instance.interceptors.response.use(
    (response) => {
      if (response.config.responseType === "arraybuffer" || response.config.responseType === "blob") {
        return response; // ✅ return full response for binary files
      }
      return response.data; // default behavior for JSON
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  return instance;
};
//API Point
const CoreService = HttpService(configs.coreServiceUrl);
const MerchandiseService = HttpService(configs.merchServiceUrl);
const OrderService = HttpService(configs.orderServiceUrl);

export { CoreService, MerchandiseService, OrderService };
