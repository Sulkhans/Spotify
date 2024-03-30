import Cookies from "js-cookie";

const TOKEN_KEY = "authToken";

export const setToken = (token) => {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
};
