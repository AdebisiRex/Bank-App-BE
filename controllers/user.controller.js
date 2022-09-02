const userModel = require("../models/user.model");
const walletModel = require("../models/wallet.model");
const transactionModel = require("../models/transactions.model");

const signup = (req, res) => {
  let form = new userModel(req.body);
  form.save((err) => {
    if (err) {
      res.send({ reponse: false, message: err.message });
    } else {
      res.send({ message: "Signup Succesful", response: true });
    }
  });
};

const signin = (req, res) => {
  let { em_username, password } = req.body;

  userModel.findOne(
    {
      $or: [
        { username: em_username, password: password },
        { email: em_username, password: password },
      ],
    },
    (err, result) => {
      if (err) {
        res.send({ reponse: false, message: err.message });
      } else {
        res.send({ result: result, response: true, message: "" });
      }
    }
  );
};

const getWallets = (req, res) => {
  walletModel.find(req.body, (err, result) => {
    res.send(result);
  });
};

const deleteWallet = (req, res) => {
  let { uid, wid } = req.body;

  userModel.findOne({ _id: uid }, (err, result) => {
    let userBalance = result.balance;
    walletModel.findOne({ _id: wid }, (err, w_result) => {
      let walletBalance = w_result.w_balance;
      let newUserBalance = Number(userBalance) + Number(walletBalance);
      userModel.findOneAndUpdate(
        { _id: uid },
        { balance: newUserBalance },
        { new: true },
        (err, wr_result) => {
          walletModel.findOneAndDelete({ _id: wid }, (err, result) => {
            if (result) {
              let date = new Date().toLocaleDateString();
              let newAlert = {
                description: "Deleted wallet Refund",
                amount: walletBalance,
                type: true,
                date,
                uid: uid,
              };
              let thisAlert = new transactionModel(newAlert);
              thisAlert.save();
            }
          });
        }
      );
    });
  });
};

const updateBalance = (req, res) => {
  userModel.findOneAndUpdate(
    { _id: req.body.id },
    { balance: req.body.balance },
    { new: true },
    (err, result) => {
      console.log(result);
      res.send(result);
      console.log("updated");
    }
  );

  let newTransaction = {
    type: req.body.type,
    amount: req.body.amount,
    date: req.body.date,
    description: req.body.description,
    uid: req.body.id,
  };

  let form = new transactionModel(newTransaction);
  form.save((error) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Success");
    }
  });
};

const getDashboard = (req, res) => {
  // console.log(req.body);
  userModel.find(req.body, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result)
      res.send(result);
    }
  });
};
const getTransactions = (req, res) => {
  // console.log(req.body);
  transactionModel.find({ uid: req.body._id }, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      // console.log(result)
      res.send(result);
    }
  });
};

const transfer = (req, res) => {
  let received = req.body;

  let creditedUser;

  let debitObject = {
    description: received.descr,
    date: received.date,
    accountNo: received.accountNo,
    amount: received.amount,
    type: false,
    uid: received.id,
  };

  //find Acc User
  userModel.findOne({ acc_no: received.accountNo }, (err, result) => {
    if (err) {
      res.send({ message: "Account Number doesn't exist ", err });
    } else {
      creditedUser = result;
      //
      //debit sender
      userModel.findOneAndUpdate(
        { _id: received.id },
        { balance: received.balance },
        { new: true },
        (err, result) => {
          if (err) {
            console.log(err, "debit sender error");
          } else {
            //credit receiver
            console.log(creditedUser, "insider credit User");
            let creditedUserBalance =
              Number(creditedUser.balance) + Number(received.amount);

            userModel.findOneAndUpdate(
              { _id: creditedUser._id },
              { balance: creditedUserBalance },
              (err, result) => {
                if (err) {
                  console.log(err, "failed credit user");
                  // res.send({message: "failed to Update credited user"})
                } else {
                  //credit alert for receiver
                  let creditObject = {
                    description: received.descr,
                    date: received.date,
                    accountNo: received.accountNo,
                    amount: received.amount,
                    type: true,
                    uid: creditedUser._id,
                  };
                  let creditAlert = new transactionModel(creditObject);
                  creditAlert.save((err) => {
                    if (err) {
                      res.send(err);
                    } else {
                      res.send("done deal");
                    }
                  });

                  //alert for sender
                  let form = new transactionModel(debitObject);
                  form.save((error) => {
                    if (error) {
                      console.log(error);
                    } else {
                      console.log("success");
                    }
                  });
                }
              }
            );
          }
        }
      );
    }
  });
};

module.exports = {
  signup,
  signin,
  getWallets,
  deleteWallet,
  updateBalance,
  getDashboard,
  getTransactions,
  transfer,
};
