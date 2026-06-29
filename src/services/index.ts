/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse, Method } from "axios";

import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";

import { endpoints } from "./endpoints";
import type { endpointType, endpointsType } from "./endpoints";

/* -------------------------------------------------------------------------- */
/*                                AXIOS SETUP                                 */
/* -------------------------------------------------------------------------- */

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

/* -------------------------------------------------------------------------- */
/*                                   TYPES                                    */
/* -------------------------------------------------------------------------- */

export interface AxiosConfig<R> extends AxiosRequestConfig {
  path?: string;
  data?: R;
  isFormData?: boolean;
}

interface UseAxiosProps<T, R> {
  endpoint?: endpointsType;

  showSuccessMsg?: boolean;
  hideErrorMsg?: boolean;

  successMsg?: string;

  initialData?: T;
  initialLoading?: boolean;

  successStatusCode?: number;

  payload?: R;

  successCb?: () => void;
  errorCb?: () => void;
}

/* -------------------------------------------------------------------------- */
/*                                CUSTOM HOOK                                 */
/* -------------------------------------------------------------------------- */

export default function useAxios<T = any, R = any>({
  endpoint,

  showSuccessMsg = false,
  hideErrorMsg = false,

  successMsg = "",

  initialData,
  initialLoading = false,

  successStatusCode = 200,

  payload,

  successCb,
  errorCb,
}: UseAxiosProps<T, R>) {
  const navigate = useNavigate();

  const isAuthEndpoint = [
    "LOGIN",
    "SIGNUP_SEND_OTP",
    "SIGNUP_VERIFY_OTP",
    "FORGOT_PASSWORD",
    "RESET_PASSWORD",
  ].includes(endpoint || "");

  const handleSessionExpiry = () => {
    Cookies.remove("token");
    Cookies.remove("user_email");
    toast.error("Session expired. Please log in again.");
    try {
      navigate("/auth/login");
    } catch (e) {
      window.location.href = "/auth/login";
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                               ENDPOINT DATA                                */
  /* -------------------------------------------------------------------------- */

  const {
    url = "",
    method = "GET",
    baseURL = undefined,
    withCredentials = undefined,
  } = endpoint ? (endpoints[endpoint] as endpointType) : {};

  /* -------------------------------------------------------------------------- */
  /*                                   STATES                                   */
  /* -------------------------------------------------------------------------- */

  const [loading, setLoading] = useState(initialLoading);

  const [data, setData] = useState<T>(initialData as T);

  /* -------------------------------------------------------------------------- */
  /*                             ABORT CONTROLLER                               */
  /* -------------------------------------------------------------------------- */

  const controller = useRef<AbortController | null>(null);

  /* -------------------------------------------------------------------------- */
  /*                                MAIN REQUEST                                */
  /* -------------------------------------------------------------------------- */

  const request = async (
    config?: AxiosConfig<R>,
    cb?: (resData: T) => void,
  ) => {
    try {
      /* -------------------------------------------------------------------------- */
      /*                          CANCEL PREVIOUS REQUEST                            */
      /* -------------------------------------------------------------------------- */

      controller.current?.abort();

      controller.current = new AbortController();

      setLoading(true);

      const token = Cookies.get("token");

      const isPublicAction = [
        "SCRAPE",
        "CRAWL",
        "MAP",
        "SEARCH",
        "SCREENSHOT",
        "GET_CRAWL_CONTENT",
      ].includes(endpoint || "");
      if (!isAuthEndpoint && !token && !isPublicAction) {
        handleSessionExpiry();
        setLoading(false);
        return null;
      }

      let recaptchaToken = "";
      const requiresRecaptcha = [
        "SCRAPE",
        "CRAWL",
        "MAP",
        "SEARCH",
        "SCREENSHOT",
      ].includes(endpoint || "");
      if (!token && requiresRecaptcha) {
        try {
          recaptchaToken = await new Promise<string>((resolve, reject) => {
            if (typeof window !== "undefined" && (window as any).grecaptcha) {
              (window as any).grecaptcha.ready(() => {
                const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
                (window as any).grecaptcha
                  .execute(siteKey, {
                    action: endpoint?.toLowerCase() || "action",
                  })
                  .then((resToken: string) => {
                    resolve(resToken);
                  })
                  .catch((err: any) => reject(err));
              });
            } else {
              reject(new Error("reCAPTCHA script not loaded"));
            }
          });
        } catch (error) {
          console.error("ReCAPTCHA error:", error);
          toast.error("Failed security check.");
          setLoading(false);
          return null;
        }
      }

      /* -------------------------------------------------------------------------- */
      /*                                  HEADERS                                   */
      /* -------------------------------------------------------------------------- */
      console.log(config?.isFormData);
      console.log(token);
      console.log(recaptchaToken);
      const headers = config?.isFormData
        ? {
            ...(config?.headers ?? {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(recaptchaToken ? { "recaptcha-token": recaptchaToken } : {}),
          }
        : {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(recaptchaToken ? { "recaptcha-token": recaptchaToken } : {}),
            ...(config?.headers ?? {}),
          };

      /* -------------------------------------------------------------------------- */
      /*                               AXIOS REQUEST                                */
      /* -------------------------------------------------------------------------- */

      // Destructure known / custom props so they don't leak into the axios
      // config and accidentally overwrite headers, data, url, or signal.
      const {
        path: _path,
        data: _data,
        headers: _headers,
        isFormData: _isFormData,
        ...restConfig
      } = (config ?? {}) as AxiosConfig<R> & Record<string, unknown>;

      let requestData = config?.data ?? payload;
      if (recaptchaToken && !config?.isFormData) {
        if (!requestData || typeof requestData !== "object") {
          requestData = {} as R;
        }
        requestData = {
          ...(requestData as object),
        } as any;
      }

      console.log("SENDING REQUEST WITH HEADERS:", headers);
      console.log("SENDING REQUEST WITH DATA:", requestData);

      const response: AxiosResponse<any> = await axios.request({
        method: method as Method,

        baseURL,

        withCredentials,

        url: url + (config?.path ?? ""),

        signal: controller.current.signal,

        timeout: 5 * 60000,

        headers,

        data: requestData,

        ...restConfig,
      });

      /* -------------------------------------------------------------------------- */
      /*                              SUCCESS HANDLING                              */
      /* -------------------------------------------------------------------------- */

      const isSuccess =
        response.status === successStatusCode &&
        (response.data?.status ?? response.data?.result?.status) !== false &&
        (response.data?.status ?? response.data?.result?.status) !== "error" &&
        (response.data?.status ?? response.data?.result?.status) !== "failed";

      if (isSuccess) {
        successCb?.();

        const responseData = response?.data || null;

        if (cb) {
          cb(responseData);
        } else {
          setData(responseData);
        }

        if (showSuccessMsg) {
          toast.success(
            response?.data?.message ??
              response?.data?.result?.message ??
              successMsg,
          );
        }

        return responseData as T;
      }

      /* -------------------------------------------------------------------------- */
      /*                               FAILED RESPONSE                              */
      /* -------------------------------------------------------------------------- */

      if (!hideErrorMsg) {
        toast.error(response?.data?.message || "Something went wrong");
      }

      errorCb?.();

      return null;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        if (isAuthEndpoint) {
          toast.error(
            error?.response?.data?.message ||
              error?.response?.data?.title ||
              "Authentication failed",
          );
        } else {
          handleSessionExpiry();
        }
        return null;
      }

      /* -------------------------------------------------------------------------- */
      /*                              RESET DATA STATE                              */
      /* -------------------------------------------------------------------------- */

      setData(initialData as T);

      if (error.code === "ERR_CANCELED") {
        return;
      }

      /* -------------------------------------------------------------------------- */
      /*                              NORMAL ERRORS                                 */
      /* -------------------------------------------------------------------------- */

      if (
        !["ERR_CANCELED", "ECONNABORTED"].includes(error.code) &&
        !hideErrorMsg
      ) {
        toast.error(
          (typeof error?.response?.data === "string"
            ? error?.response?.data
            : error?.response?.data?.message) ||
            error?.response?.data?.title ||
            error?.message ||
            "Something went wrong",
        );
      }

      errorCb?.();

      return null;
    } finally {
      /* -------------------------------------------------------------------------- */
      /*                              STOP LOADING                                  */
      /* -------------------------------------------------------------------------- */

      setLoading(false);
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   RETURN                                   */
  /* -------------------------------------------------------------------------- */

  return [request, data, loading, setData, setLoading] as const;
}
