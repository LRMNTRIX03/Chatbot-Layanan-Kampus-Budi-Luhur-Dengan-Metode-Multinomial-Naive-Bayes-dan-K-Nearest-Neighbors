import { useState, useEffect, useCallback } from "react";
import { login, logout, register, checkAuth } from "../services/AuthServices";
import { useUserStore } from "../store/useUserStore";

export const useAuth = () => {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const {user, setUser} = useUserStore();


  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [loading, setLoading] = useState(true);

const checkUser = useCallback(async () => {
  try {
    const res = await checkAuth({ withCredentials: true });
    if (res.status === 200) {
      const userData = res.data.user; 
      console.log("Authenticated user:", userData);
      setUser(userData);
      setIsAuthenticated(true);
    }
  } catch (error) {
    setError(error);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
  } finally {
    setLoading(false);
  }
}, [setUser]);



useEffect(() => {
  if (!user) {
    checkUser();
  } else {
    setLoading(false);
  }
}, [checkUser, user]);


  const handleLogin = async (data) => {
    try {
      setLoading(true);
        const res = await login(data);
        console.log("Login response:", res);
    if (res.status === 200) {
      const userData = res.data.user;
      setUser(userData);
      setIsAuthenticated(true);
      // localStorage.setItem("user", JSON.stringify(userData));

      
      if (userData.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/dashboard";
      }
    }
    return res;
    } catch (error) {
      console.log("Login error:", error);
    
      const errMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Terjadi kesalahan";
    
      setMessage(errMsg);
    }
    
    finally {
      setLoading(false);
    }
  
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return {
    user,
    isAuthenticated,
    loading,
    login: handleLogin,
    logout: handleLogout,
    register,
    error,
    message
  };
};
