import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";

dotenv.config();

export const protect = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });
  const token = auth.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Populate role here
    req.user = await User.findById(decoded.id).select("-password").populate("role");

    if (!req.user) return res.status(401).json({ message: "User not found" });

    console.log("User role after populate:", req.user.role); // <--- Add this

    next();
  } catch (err) {
    return res.status(401).json({ message: "Token invalid" });
  }
};


export const restrictTo = (...allowedRoles) => (req, res, next) => {
  // Safely get role name string
  const roleName =
    typeof req.user?.role === "string" ? req.user.role : req.user?.role?.name;

  console.log("User role in restrictTo:", roleName);
  console.log("Allowed roles:", allowedRoles);

  if (!req.user || !roleName || !allowedRoles.includes(roleName)) {
    return res.status(403).json({ message: "Forbidden: insufficient role" });
  }
  next();
};

