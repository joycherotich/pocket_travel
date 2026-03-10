import mongoose from "mongoose";
import dotenv   from "dotenv";
dotenv.config();

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Connected to MongoDB\n");

const { default: User   } = await import("./models/User.js");
const { default: Client } = await import("./models/Client.js");
const { default: Booking} = await import("./models/Booking.js");

const users = await User.find().lean();
const STAFF_ROLES = ["staff","finance","admin"];
const staffList = users.filter(u => {
  const role = typeof u.role === "object" ? u.role?.name : u.role;
  return STAFF_ROLES.includes(role?.toLowerCase());
});

console.log(`�� Staff found: ${staffList.length}`);
staffList.forEach(s => console.log(`   ${s.name} (${s._id}) — role: ${s.role}`));

const allClients = await Client.find().lean();
console.log(`\n🧑 Clients found: ${allClients.length}`);
allClients.forEach(c => console.log(
  `   ${c.name} — assignedTo: ${c.assignedTo || "⚠️  NOT SET"} — status: ${c.status}`
));

const allBookings = await Booking.find().lean();
console.log(`\n📋 Bookings found: ${allBookings.length}`);
allBookings.forEach(b => console.log(
  `   client: ${b.client || b.clientName || "?"} — status: ${b.status} — totalPrice: ${b.totalPrice}`
));

console.log("\n📊 Per-staff summary:");
for (const s of staffList) {
  const myClients  = allClients.filter(c => String(c.assignedTo) === String(s._id));
  const clientIds  = myClients.map(c => String(c._id));
  const myBookings = allBookings.filter(b => clientIds.includes(String(b.client)));
  const completed  = myBookings.filter(b => b.status === "Completed");
  const revenue    = completed.reduce((sum, b) => sum + (b.totalPrice||0), 0);
  console.log(`   ${s.name}: ${myClients.length} clients, ${completed.length} completed, revenue: ${revenue}`);
}

const unassigned = allClients.filter(c => !c.assignedTo);
console.log(`\n⚠️  Clients with no assignedTo: ${unassigned.length}`);
unassigned.forEach(c => console.log(`   ${c.name} (${c._id})`));

await mongoose.disconnect();
process.exit(0);
