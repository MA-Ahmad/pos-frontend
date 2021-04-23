import axios, { baseUrl } from "axios";

const updatePassword = payload =>
  axios.put(`${baseUrl}api/v1/password/update`, payload);

const registrationsApi = {
  updatePassword
};

export default registrationsApi;
