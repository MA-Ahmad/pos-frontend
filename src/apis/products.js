import axios from "axios";
import { baseUrl } from "./baseUrl";

const fetch = () => axios.get(`${baseUrl}api/v1/products`);

const create = payload => axios.post(`${baseUrl}api/v1/products`, payload);

const update = (id, payload) =>
  axios.put(`${baseUrl}api/v1/products/${id}`, payload);

const destroy = payload =>
  axios.post(`${baseUrl}api/v1/products/bulk_delete`, payload);

const productsApi = {
  fetch,
  create,
  update,
  destroy
};

export default productsApi;
