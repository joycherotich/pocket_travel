import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // On mount, check if user info is saved in sessionStorage and restore it
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedUserRole = sessionStorage.getItem("userRole");

    if (storedUser) {
      try {
        const userObj = JSON.parse(storedUser);

        // If role is missing in stored user but stored separately, inject it
        if (!userObj.role && storedUserRole) {
          userObj.role = storedUserRole;
        }

        // Pick only name, role, email (ignore other fields)
        const trimmedUser = {
          name: userObj.name,
          email: userObj.email,
          role: userObj.role || null,
        };

        setUser(trimmedUser);
      } catch (err) {
        console.error("Failed to parse user from sessionStorage", err);
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("userRole");
      }
    }
  }, []);

  // Login function calls your backend /api/auth/login
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
  
    // Extract role from name string if role is missing/null
    const rawName = data.user.name || ""; // e.g. "Joy Admin"
    const parts = rawName.trim().split(" ");
    let role = data.user.role; // existing role, may be null
  
    let name = rawName;
    if ((!role || role === null) && parts.length > 1) {
      role = parts.pop().toLowerCase(); // last word is role
      name = parts.join(" ");
    }
  
    const trimmedUser = {
      name,
      email: data.user.email,
      role,
    };
  
    setUser(trimmedUser);
    sessionStorage.setItem("user", JSON.stringify(trimmedUser));
    if (role) {
      sessionStorage.setItem("userRole", role);
    }
    sessionStorage.setItem("token", data.token);
  
    return trimmedUser;
  };
  

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("userRole");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
