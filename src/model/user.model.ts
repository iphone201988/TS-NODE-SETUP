import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { deviceType } from "../utils/enums.js";

const userSchema = new Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String },
    email: { type: String },
    password: { type: String },
    countryCode: { type: String },
    phone: { type: String },
    profileImage: { type: String },
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    deviceToken: { type: String },
    deviceType: { type: Number, enum: [deviceType.IOS, deviceType.ANDROID] },
    jti: { type: String },
    otp: { type: Number },
    otpExpiry: { type: Date },
    otpVerified: { type: Boolean },
    isDeleted: { type: Boolean, default: false },
    stripeCustomerId: { type: String },
    stripeConnectId: { type: String },
    isStripeAccountConnected: { type: Boolean, default: false },
    referralCode: String,
    referredBy: { type: Schema.Types.ObjectId, ref: "User" },
    earnedAmount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  }
});

userSchema.methods.matchPassword = async function (password: string) {
  if (!this.password) return false;
  const isCompared = await bcrypt.compare(password, this.password);
  return isCompared;
};

const User = model("User", userSchema);
export default User;
