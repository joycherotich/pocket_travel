import bcrypt from "bcryptjs";

const plainPassword = "cherotich";
const hashedPassword = "$2b$10$woR3EnI51pk0ZhTE7VCn3uhN6XyqpOseLXjyhMx4O4GJo6HF3ivuK";

bcrypt.compare(plainPassword, hashedPassword, (err, res) => {
  if (err) {
    console.error("Error during bcrypt compare:", err);
  } else {
    console.log("Password match result:", res);
  }
});
