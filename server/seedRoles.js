import Role from "./models/Role.js";

async function seedRoles() {
  const count = await Role.countDocuments();
  if (count === 0) {
    await Role.create([{ name: "staff" }, { name: "admin" }]);
    console.log("Seeded roles");
  }
}
connectDB().then(() => seedRoles());
