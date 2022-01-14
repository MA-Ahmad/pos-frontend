import axios from "axios";
import { baseUrl } from "./baseUrl";

const fetch = companyId =>
  axios.get(`${baseUrl}api/v1/products?company_id=${companyId}`);

const create = payload => axios.post(`${baseUrl}api/v1/products`, payload);

const getSingle = (sku) =>
  axios.get(`${baseUrl}api/v1/products/${sku}`);

const update = (id, payload) =>
  axios.put(`${baseUrl}api/v1/products/${id}`, payload);

const destroy = payload =>
  axios.post(`${baseUrl}api/v1/products/bulk_delete`, payload);

const productsApi = {
  getSingle,
  fetch,
  create,
  update,
  destroy
};

export default productsApi;
