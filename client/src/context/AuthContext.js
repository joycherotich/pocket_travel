import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  /* ── Restore user from sessionStorage on page refresh ── */
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        sessionStorage.removeItem("user");
      }
    }
  }, []);

  /* ── Login ── */
  const login = async (email, password) => {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed");
    }
  
    const data = await response.json();
  
    // ← ADD THESE
    console.log("FULL API RESPONSE:", data);
    console.log("mustChangePassword from API:", data.user.mustChangePassword);
  
    const trimmedUser = {
      id:                 data.user.id,
      name:               data.user.name,
      email:              data.user.email,
      role:               data.user.role,
      mustChangePassword: data.user.mustChangePassword,
    };
  
    console.log("trimmedUser being returned:", trimmedUser); // ← ADD
  
    setUser(trimmedUser);
    sessionStorage.setItem("user",      JSON.stringify(trimmedUser));
    sessionStorage.setItem("userRole",  data.user.role);
    sessionStorage.setItem("userName",  data.user.name);
    sessionStorage.setItem("userEmail", data.user.email);
    sessionStorage.setItem("token",     data.token);
  
    return trimmedUser;
  };

  /* ── Logout ── */
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);