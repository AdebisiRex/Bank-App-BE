const mongoose = require('mongoose')

const transactionSchema =mongoose.Schema({
    description: {type:String},
    date: {type:Date, required: true},
    accountNo: {type:Number},
    amount:{type:Number, required:true},
    type:{type:Boolean,  required:true},
    uid: String
})

const transactionModel = mongoose.model("acc_user", transactionSchema);
module.exports = transactionModel 