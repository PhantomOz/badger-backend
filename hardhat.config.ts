import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  networks: {
    testnet: {
      url: `${process.env.SEP_RPC_URL}`,
      chainId: 1115,
    },
  },
  etherscan: {
    apiKey: `${process.env.ETHERSCAN_API_KEY}`,
    customChains: [
      {
        network: "testnet",
        chainId: 1115,
        urls: {
          apiURL: "https://api.test.btcs.network/api",
          browserURL: "https://scan.test.btcs.network/",
        },
      },
    ],
  },
};

export default config;
