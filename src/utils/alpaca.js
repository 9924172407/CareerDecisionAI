const axios = require("axios");
const getAlpacaHeaders = () => {
  return {
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(
          `${process.env.ALPACA_API}:${process.env.API_KEY}`
        ).toString("base64"),
    },
  };
};

const makeAlpacaRequest = async (method, url, data = null) => {
  try {
    if (data) {
      return await axios[method](url, data, getAlpacaHeaders());
    } else {
      return await axios[method](url, getAlpacaHeaders());
    }
  } catch (error) {
    console.error(
      `Error making Alpaca ${method} request:`,
      error.response ? error.response.data : error.message
    );
    throw new Error(`Failed to make Alpaca ${method} request`);
  }
};

module.exports = {
  getAlpacaHeaders,
  makeAlpacaRequest,
};
