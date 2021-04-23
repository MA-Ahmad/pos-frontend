import axios from "axios";
import { useToast } from "@chakra-ui/react";

axios.defaults.baseURL = "/";

export const baseUrl = "https://pos-backend-rails.herokuapp.com/";
// export const baseUrl = "http://localhost:3001/";
// export const baseUrl = 'https://auth-app-rails-back.herokuapp.com/';

export const setAuthHeaders = (setLoading = () => null) => {
  axios.defaults.headers = {
    Accept: "applicaion/json",
    "Content-Type": "application/json"
  };
  const token = JSON.parse(localStorage.getItem("authToken"));
  const email = JSON.parse(localStorage.getItem("authEmail"));
  if (token && email) {
    axios.defaults.headers["X-Auth-Email"] = email;
    axios.defaults.headers["X-Auth-Token"] = token;
  }
  setLoading(false);
};

export const resetAuthTokens = () => {
  delete axios.defaults.headers["X-Auth-Email"];
  delete axios.defaults.headers["X-Auth-Token"];
};

const handleSuccessResponse = response => {
  if (response) {
    response.success = response.status === 200;
    if (response.data.notice) {
      ShowToast();
    }
  }
  return response;
};

const handleErrorResponse = (error, authDispatch) => {
  if (error.response?.status === 401) {
    authDispatch({ type: "LOGOUT" });
    ShowToast(error.response?.data?.error, "error");
  } else {
    ShowToast(error.response?.data?.error || error.message, "error");
  }
  return Promise.reject(error);
};

const ShowToast = (response, status) => {
  const toast = useToast();
  toast({
    description: response,
    status: status,
    duration: 1500,
    isClosable: true
  });
};

export const registerIntercepts = authDispatch => {
  axios.interceptors.response.use(handleSuccessResponse, error =>
    handleErrorResponse(error, authDispatch)
  );
};
