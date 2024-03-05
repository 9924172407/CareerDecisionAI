const UserModel = require("../models/UserModel");
const { makeAlpacaRequest } = require("../utils/alpaca");

const accounts = {};

const createAccount = async (req, res) => {
  try {
    const alpacaResponse = await makeAlpacaRequest(
      "post",
      `${process.env.ALPACA_URL}/v1/accounts`,
      req.body
    );
    const accountId = alpacaResponse.data.id;

    accounts[accountId] = req.body;

    const userEmail = req.body.contact.email_address;

    await UserModel.findOneAndUpdate(
      { email: userEmail },
      { $set: { accountId: accountId } }
    );

    res
      .status(201)
      .json({ message: "Account created successfully!", accountId });
  } catch (error) {
    console.error(
      "Error creating Alpaca account:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: error?.response?.data?.message });
  }
};

const getAlpacaAccount = async (accountId) => {
  const alpacaResponse = await makeAlpacaRequest(
    "get",
    `${process.env.ALPACA_URL}/v1/trading/accounts/${accountId}/positions`
  );
  return alpacaResponse.data;
};

const getAccount = async (req, res) => {
  const accountId = req.params.accountId;

  try {
    const alpacaAccountInfo = await getAlpacaAccount(accountId);
    res.json({ data: alpacaAccountInfo });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAccounts = async (req, res) => {
  try {
    const alpacaResponse = await makeAlpacaRequest(
      "get",
      `${process.env.ALPACA_URL}/v1/accounts`
    );
    const allAlpacaAccounts = alpacaResponse.data;
    res.json({ accounts: allAlpacaAccounts });
  } catch (error) {
    console.error(
      "Error fetching Alpaca accounts:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAccount = async (req, res) => {
  const accountId = req.params.accountId;

  if (accounts[accountId]) {
    try {
      const alpacaResponse = await makeAlpacaRequest(
        "put",
        `${process.env.ALPACA_URL}/v1/accounts/${accountId}`,
        req.body
      );
      accounts[accountId] = req.body;
      res.json({ message: "Account updated successfully!" });
    } catch (error) {
      console.error(
        "Error updating Alpaca account:",
        error.response ? error.response.data : error.message
      );
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(404).json({ message: "Account not found" });
  }
};

const getUserPositions = async (req, res) => {
  const accountId = req.body.accountId;
  try {
    const alpacaAccountInfo = await getAlpacaAccount(accountId);
    res.json({ positions: alpacaAccountInfo });
  } catch (error) {
    console.error(
      "Error fetching Alpaca user positions:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Internal server error" });
  }
};
const getAlpacaBalance = async (accountId) => {
  try {
    const alpacaResponse = await makeAlpacaRequest(
      "get",
      `${process.env.ALPACA_URL}/v1/account/${accountId}/balances`
    );
    const alpacaBalanceInfo = alpacaResponse.data;
    return alpacaBalanceInfo;
  } catch (error) {
    console.error(
      "Error fetching Alpaca balance information:",
      error.response ? error.response.data : error.message
    );
    throw new Error("Failed to fetch balance information from Alpaca");
  }
};
module.exports = {
  createAccount,
  getAccount,
  getAllAccounts,
  updateAccount,
  getUserPositions,
  getAlpacaBalance,
};
