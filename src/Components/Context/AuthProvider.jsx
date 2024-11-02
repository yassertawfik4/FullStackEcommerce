import { createContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const token = Cookies.get("authToken");
    setIsLoggedIn(!!token);
  }, []);

  const login = (userId, token, expiration) => {
    Cookies.set("authToken", token, { expires: new Date(expiration) });
    Cookies.set("userId", userId, { expires: new Date(expiration) }); // Save userId in cookies
    setUserId(userId); // Set userId in state
    setIsLoggedIn(true);
  };

  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userId"); // Remove userId from cookies
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, userId }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
