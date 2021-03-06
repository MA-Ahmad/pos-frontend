import axios from "axios";
import { baseUrl } from "./baseUrl";

const fetch = companyId =>
  axios.get(`${baseUrl}api/v1/vendors?company_id=${companyId}`);

const create = payload => axios.post(`${baseUrl}api/v1/vendors`, payload);

const update = (id, payload) =>
  axios.put(`${baseUrl}api/v1/vendors/${id}`, payload);

const destroy = payload =>
  axios.post(`${baseUrl}api/v1/vendors/bulk_delete`, payload);

const vendorsApi = {
  fetch,
  create,
  update,
  destroy
};

export default vendorsApi;
