import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'staff', 'admin', 'finance', 'customer'], default: 'user' },
  mustChangePassword: { type: Boolean, default: false },
  commissionRate: { type: Number, default: 0.10 }, // used by commissions route
}, { timestamps: true });

// ✅ No "next" parameter — just async/await with return
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);