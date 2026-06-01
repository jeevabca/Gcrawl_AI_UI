enum methods {
  get = "get",
  post = "post",
  put = "put",
  delete = "delete",
}

export type endpointType = {
  url: string;
  method: methods
  baseURL?: string;
  withCredentials?: boolean;
};

export const endpoints = {
  LOGIN: {
    url: "/auth/signin",
    method: methods.post,
  },
  SIGNUP_SEND_OTP: {
    url: "/auth/signup/send-otp",
    method: methods.post,
  },
  SIGNUP_VERIFY_OTP: {
    url: "/auth/signup/verify-otp",
    method: methods.post,
  },
  FORGOT_PASSWORD: {
    url: "/auth/forgot-password",
    method: methods.post,
  },
  RESET_PASSWORD: {
    url: "/auth/reset-password",
    method: methods.post,
  },
  SCRAPE: {
    url: "/api/v1/scrape",
    method: methods.post,
  },
  CRAWL: {
    url: "/api/v1/crawl",
    method: methods.post,
  },
   MAP: {
    url: "/api/v1/links",
    method: methods.post,
  },
  SEARCH:{
    url:"/api/v1/search",
    method:methods.post
  },
  GET_PATH:{
    url:"/crawler/paths",
    method:methods.get
  },
  GET_CRAWL_CONTENT: {
    url: "/crawl/get/content",
    method: methods.get,
  },
  
  
};

export type endpointsType = keyof typeof endpoints;