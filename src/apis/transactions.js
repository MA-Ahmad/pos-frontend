import axios from "axios";
import { baseUrl } from "./baseUrl";

const fetch = companyId =>
  axios.get(`${baseUrl}api/v1/transactions?company_id=${companyId}`);

const create = payload => axios.post(`${baseUrl}api/v1/transactions`, payload);

const update = (id, payload) =>
  axios.put(`${baseUrl}api/v1/transactions/${id}`, payload);

const destroy = payload =>
  axios.post(`${baseUrl}api/v1/transactions/bulk_delete`, payload);

const transactionsApi = {
  fetch,
  create,
  update,
  destroy
};

export default transactionsApi;
