const walletModel = require("../models/wallet.model");
const userModel  = require("../models/user.model")
const transactionModel = require("../models/transactions.model")



const createWallet = (req, res) => {
  let form = new walletModel(req.body);
  form.save((err) => {
    if (err) {
      res.send({message: err.message})
    }else {
        res.send({message: "Wallet Added Successfully"})

    }
  });
};

const fundWallet =(req, res)=>{
  let {walletID, id, amount}=req.body;
  
  //find user to get balance
  userModel.findOne({_id:id},(err, result)=>{
console.log(result)
    if(result.balance > amount){

      let newUserBalance= Number(result.balance)- Number(amount);
      walletModel.findOne({_id:walletID},(err, w_result)=>{
        let newW_Balance = Number(amount) + Number(w_result.w_balance);
        if(newW_Balance>w_result.t_amount){
          res.send({message: "Unable to fund wallet above target amount"})
        }else{
          //increase wallet balance
            walletModel.findOneAndUpdate({_id:walletID},{w_balance:newW_Balance},{new:true}, (err, result)=>{

              userModel.findOneAndUpdate({_id:id}, {balance:newUserBalance},(err, result)=>{
      
                res.send({message: "wallet funding Successful"})
                let date = new Date().toLocaleDateString();
                let newAlert ={description: "Funding Wallet", amount, type:false, date, uid: id }
                let debitAlert = new transactionModel(newAlert);
                debitAlert.save()
                
              })


            })
          }
        })
    }else{
      res.send({message: "Insufficient fund, kindly fund account "})
    }

  })

}




module.exports= {createWallet,fundWallet}