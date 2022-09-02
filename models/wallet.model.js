const mongoose = require("mongoose");

const walletSchema = mongoose.Schema({
  w_name: { type: String, required: true, unique: true },
  t_amount: { type: Number, required: true },
  w_balance: { type: Number },
  c_date: {type:String,required: true},
  t_date: {type:String,required: true},
  uid: {type:String, required:true},
});

const walletModel = mongoose.model("wallets", walletSchema);

module.exports = walletModel;
