const API_BASE = "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("token");

export const setToken = (token) => {
  localStorage.setItem("token", token);
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`
});

export const apiFetch = async (url, options = {}) => {
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...authHeaders(),
      ...(options.headers || {})
    }
  });

  if (response.status === 401) {
    logout();
    window.location.reload();
  }

  return response.json();
};
