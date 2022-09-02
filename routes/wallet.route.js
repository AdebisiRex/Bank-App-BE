const express = require("express");
const w_router = express.Router();
const {
  createWallet, fundWallet
  
  
} = require("../controllers/wallet.controller");

w_router.post("/create", createWallet);
w_router.post("/fundWallet", fundWallet);

module.exports = w_router;
