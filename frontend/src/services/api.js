import axios from "axios";
import { auth } from "./firebase";

// ─── Base instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  timeout: 30000,
});

// Attach Firebase ID token to every request
api.interceptors.request.use(async (config) => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    const token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Standardise error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.message || err.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

// ─── Auth API ─────────────────────────────────────────────────────────────────
export const authAPI = {
  getProfile:    ()       => api.get("/auth/profile"),
  updateProfile: (data)   => api.put("/auth/profile", data),
  deleteAccount: ()       => api.delete("/auth/account"),
};

// ─── Tools API ────────────────────────────────────────────────────────────────
export const toolsAPI = {
  getAll:        ()         => api.get("/tools"),
  getOne:        (slug)     => api.get(`/tools/${slug}`),
  processFile:   (formData) =>
    api.post("/tools/process", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (e) => {
        // expose to caller via config if needed
      },
    }),
  getUsage:      ()         => api.get("/tools/usage"),
};

// ─── Payments API ─────────────────────────────────────────────────────────────
export const paymentsAPI = {
  createOrder:       (planId)  => api.post("/payments/create-order", { planId }),
  verifyPayment:     (payload) => api.post("/payments/verify", payload),
  getHistory:        ()        => api.get("/payments/history"),
  cancelSubscription:()        => api.post("/payments/cancel"),
};

// ─── Blog API ─────────────────────────────────────────────────────────────────
export const blogAPI = {
  getAll:    (params) => api.get("/blog", { params }),
  getOne:    (slug)   => api.get(`/blog/${slug}`),
  getByTag:  (tag)    => api.get("/blog", { params: { tag } }),
  search:    (q)      => api.get("/blog/search", { params: { q } }),
};

// ─── Analytics API ────────────────────────────────────────────────────────────
export const analyticsAPI = {
  trackEvent: (event, data) => api.post("/analytics/event", { event, ...data }),
  getDashboard:             ()    => api.get("/analytics/dashboard"),
};

export default api;
