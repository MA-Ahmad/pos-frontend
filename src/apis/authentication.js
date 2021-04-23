import axios from "axios";
import { baseUrl } from "./baseUrl";

const login = payload => axios.post(`${baseUrl}api/v1/login`, payload);

const logout = () => axios.delete(`${baseUrl}api/v1/logout`);

const signup = payload => axios.post(`${baseUrl}api/v1/users`, payload);

const authenticationApi = {
  login,
  logout,
  signup
};

export default authenticationApi;
