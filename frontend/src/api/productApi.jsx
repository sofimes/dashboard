import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const api = axios.create({ baseURL: BASE_URL, timeout: 15000 });

export async function listProducts({ page = 1, limit = 24, q = "" } = {}) {
  const resp = await api.get("/products", { params: { page, limit, q } });
  return resp.data;
}

export async function syncASIN(asin) {
  const resp = await api.post("/products/sync", { asin });
  return resp.data;
}

export async function getProduct(asin) {
  if (!asin) throw new Error("ASIN required");
  const resp = await api.get(`/products/${encodeURIComponent(asin)}`);
  return resp.data;
}

export default api;
