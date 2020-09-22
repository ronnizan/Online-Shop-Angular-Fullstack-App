const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
  },
  street: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  identityNumber: {
    type: String ,//i will save it hashed
  },
  role: {
    type: String,
    default: "User",
  },
}, { versionKey: false });
module.exports = mongoose.model("User", UserSchema);
