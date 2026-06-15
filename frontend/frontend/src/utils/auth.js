import {jwtDecode} from "jwt-decode";

export const saveToken = (tokens) => {  // fixed: was 'token' but used 'tokens'
  localStorage.setItem("access_token", tokens.access);
  localStorage.setItem("refresh_token", tokens.refresh);

  // decode the JWT and save user info
  const decoded = jwtDecode(tokens.access);
  localStorage.setItem("user_id", decoded.user_id);
  localStorage.setItem("username", decoded.username);
};

export const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
};

export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

export const getCurrentUser = () => {
  return {
    id: parseInt(localStorage.getItem("user_id")),
    username: localStorage.getItem("username"),
  };
};

export const isLoggedIn = () => {
  return !!localStorage.getItem("access_token");
};

export const authFetch = (url, options = {}) => {
  const token = getAccessToken();
  const headers = options.headers ? { ...options.headers } : {};

  if (token) headers["Authorization"] = `Bearer ${token}`;
  // don't set Content-Type here if sending FormData (file uploads)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
};