import api from "./api";


export const login = async (data) => {
  try {
    
    const res = await api.post("/auth/login", data, { withCredentials: true });
    return res;
  } catch (error) {
    console.log(error)
    console.error("Login failed:", error);
    throw error;
  }
};


export const logout = async () => {
  try {
    const res = await api.post("/auth/logout", {}, { withCredentials: true });
    localStorage.removeItem("user");
    return res;
  } catch (error) {
    console.error("Logout failed:", error);
    throw error.response?.data || error;
  }
};


export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data, { withCredentials: true });
    return res;
  } catch (error) {
    console.error("Register failed:", error);
    throw error.response?.data || error;
  }
};


export const checkAuth = async () => {
  try {
    const res = await api.get("/auth/check", { withCredentials: true });
    return res;
  } catch (error) {
    throw error.response?.data || error;
  }
};

