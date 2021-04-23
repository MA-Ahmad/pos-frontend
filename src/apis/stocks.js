import axios, { baseUrl } from "axios";

const fetch = () => axios.get(`${baseUrl}api/v1/stocks`);

const create = payload => axios.post(`${baseUrl}api/v1/stocks`, payload);

const update = (id, payload) =>
  axios.put(`${baseUrl}api/v1/stocks/${id}`, payload);

const destroy = payload =>
  axios.post(`${baseUrl}api/v1/stocks/bulk_delete`, payload);

const stocksApi = {
  fetch,
  create,
  update,
  destroy
};

export default stocksApi;
