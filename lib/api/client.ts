import axios from "axios";

// Types untuk API requests
interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface CartItem {
  productId: string;
  quantity: number;
  price?: number;
  name?: string;
  image?: string;
}

interface OrderData {
  addressId: string;
  items: {
    productId: string;
    quantity: number;
    price: number;
    name: string;
  }[];
  total: number;
  paymentMethod: string;
}

interface Address {
  id?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  zipCode?: string;
  isDefault?: boolean;
  address?: string;
  stateCode?: string;
}

interface UserProfile {
  name?: string;
  email?: string;
  phone?: string;
}

interface ProductSearchParams {
  search?: string;
  category?: string;
  limit?: number;
  skip?: number;
}

// Internal API client untuk aplikasi sendiri
export const apiClient = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000"),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies for NextAuth
});

// External API client untuk DummyJSON
export const externalApiClient = axios.create({
  baseURL: "https://dummyjson.com",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor untuk auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Add auth token if available (untuk authenticated requests)
    if (typeof window !== "undefined") {
      try {
        const { auth } = await import("@/lib/firebase");
        const { getAuth } = await import("firebase/auth");

        const currentUser = auth?.currentUser || getAuth()?.currentUser;
        if (currentUser) {
          const token = await currentUser.getIdToken();
          config.headers.Authorization = `Bearer ${token}`;
          console.log("ApiClient: Added auth token to request");
        } else {
          console.log("ApiClient: No authenticated user found");
        }
      } catch (error) {
        console.log("ApiClient: Error getting auth token:", error);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== "undefined") {
        // Get current path for callback URL
        const currentPath = window.location.pathname;
        const callbackUrl = encodeURIComponent(currentPath);
        window.location.href = `/login?callbackUrl=${callbackUrl}`;
      }
    }

    // Log errors untuk debugging
    console.error("API Error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.response?.data?.message || error.message,
      fullError: error,
    });

    return Promise.reject(error);
  }
);

// External API response interceptor
externalApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("External API Error:", {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Helper functions untuk common API calls
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    apiClient.post("/api/auth/signin", credentials),

  register: (userData: RegisterData) =>
    apiClient.post("/api/register", userData),
};

export const ordersAPI = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (id: string) => apiClient.get(`/api/orders/${id}`),
  getByIdLegacy: (id: string) => apiClient.get(`/api/order/${id}`),
  create: (orderData: OrderData) => apiClient.post("/api/orders", orderData),
};

export const cartAPI = {
  get: () => apiClient.get("/api/cart"),
  add: (item: CartItem) => apiClient.post("/api/cart", item),
  update: (id: string, item: CartItem) =>
    apiClient.put(`/api/cart/${id}`, item),
  remove: (id: string) => apiClient.delete(`/api/cart/${id}`),
};

export const wishlistAPI = {
  get: () => apiClient.get("/api/wishlist"),
  add: (productId: string) => apiClient.post("/api/wishlist", { productId }),
  remove: (id: string) => apiClient.delete(`/api/wishlist/${id}`),
};

export const productsAPI = {
  getAll: (params?: ProductSearchParams) =>
    apiClient.get("/api/products", { params }),
  getById: (id: string) => apiClient.get(`/api/products/${id}`),
  search: (query: string) =>
    apiClient.get(`/api/products/search`, { params: { q: query } }),
};

export const addressesAPI = {
  getAll: () => apiClient.get("/api/addresses"),
  getById: (id: string) => apiClient.get(`/api/addresses/${id}`),
  create: (address: Address) => apiClient.post("/api/addresses", address),
  update: (id: string, address: Address) =>
    apiClient.put(`/api/addresses/${id}`, address),
  remove: (id: string) => apiClient.delete(`/api/addresses/${id}`),
};

export const userAPI = {
  getProfile: () => apiClient.get("/api/user/profile"),
  updateProfile: (profile: UserProfile) =>
    apiClient.put("/api/user/profile", profile),
};
