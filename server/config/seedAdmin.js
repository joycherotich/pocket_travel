import Role from "../models/Role.js";
import { PRIVILEGES } from "../constants/privileges.js";

export const seedAdminRole = async () => {
  const admin = await Role.findOne({ name: "admin" });

  if (!admin) {
    await Role.create({
      name: "admin",
      privileges: PRIVILEGES,
      reserved: true,
    });

    console.log("Admin role seeded");
  } else {
    console.log("Admin role already exists");
  }
};