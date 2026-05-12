// ──────────────────────────────────────────────────────────────
//  API Client
//
//  Uses native fetch with credentials: "include" to send
//  HTTP-only cookies automatically. All methods return parsed
//  JSON (backend's ApiResponse format: { statusCode, data, message }).
// ──────────────────────────────────────────────────────────────

const BASE_URL = "https://flower-pot-sigma.vercel.app/api/v1";

const accessToken = document.cookie
  .split("; ")
  .find((row) => row.startsWith("accessToken="))
  ?.split("=")[1];

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log("url", url);
  const config = {
    credentials: "include",
    ...options,

    headers: {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),

      ...(accessToken && {
        Authorization: `Bearer ${accessToken}`,
      }),

      ...options.headers,
    },
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    const error = new Error(data.message || "Something went wrong");
    error.statusCode = data.statusCode || response.status;
    throw error;
  }

  return data;
}

// ── Auth ──
export const authApi = {
  signup: (formData) =>
    request("/auth/signup", { method: "POST", body: formData }),

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  logout: () => request("/auth/logout", { method: "POST" }),
};

// ── User ──
export const userApi = {
  getProfile: () => request("/users/profile"),

  updateProfile: (formData) =>
    request("/users/profile", { method: "PATCH", body: formData }),
};

// ── Products ──
export const productApi = {
  getAll: (page = 1, limit = 12, search = "", category = "") => {
    const params = new URLSearchParams({ page, limit });
    if (search) params.append("search", search);
    if (category) params.append("category", category);
    return request(`/products?${params}`);
  },

  getById: (id) => request(`/products/${id}`),

  create: (formData) =>
    request("/products", { method: "POST", body: formData }),

  update: (id, formData) =>
    request(`/products/${id}`, { method: "PATCH", body: formData }),

  delete: (id) => request(`/products/${id}`, { method: "DELETE" }),
};

// ── Wishlist ──
export const wishlistApi = {
  get: () => request("/wishlist"),

  add: (productId) => request(`/wishlist/${productId}`, { method: "POST" }),

  remove: (productId) =>
    request(`/wishlist/${productId}`, { method: "DELETE" }),
};

// ── Orders ──
export const orderApi = {
  place: (items, shippingAddress) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify({ items, shippingAddress }),
    }),

  getMine: (page = 1, limit = 10) =>
    request(`/orders?page=${page}&limit=${limit}`),

  getAll: (page = 1, limit = 10, status = "") => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return request(`/orders/all?${params}`);
  },

  updateStatus: (id, status) =>
    request(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ── Feedback ──
export const feedbackApi = {
  submit: (message, flowerName) =>
    request("/feedback", {
      method: "POST",
      body: JSON.stringify({ message, flowerName }),
    }),

  getMine: () => request("/feedback/mine"),

  getAll: (page = 1, limit = 10, status = "") => {
    const params = new URLSearchParams({ page, limit });
    if (status) params.append("status", status);
    return request(`/feedback?${params}`);
  },

  updateStatus: (id, status) =>
    request(`/feedback/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
