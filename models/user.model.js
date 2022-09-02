const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  acc_no: { type: Number, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  balance: { type: Number, required: true },
});

const userModel = mongoose.model("user_accounts", userSchema);
module.exports = userModel;
