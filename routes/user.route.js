const express=require("express");
const router = express.Router()
const {signup, signin, getWallets, deleteWallet, updateBalance, getDashboard, getTransactions, transfer}= require("../controllers/user.controller")

router.post("/", (req,res)=>{
    res.send({message:"get request happend "})
})
router.post("/signup", signup)
router.post("/getwallets", getWallets);

router.post("/deleter", deleteWallet);
router.post("/signin", signin)
router.post("/updateBalance", updateBalance)

router.post("/dashboard", getDashboard)
router.post("/getTransactions", getTransactions)
router.post("/transfer",transfer)

module.exports= router