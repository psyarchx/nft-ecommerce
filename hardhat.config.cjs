require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: './keys.env' });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.24",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY].filter(Boolean)
    }
  }
};