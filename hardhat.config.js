require("@nomiclabs/hardhat-waffle");

const projectId = "Jnq1ivsHJRrCmriUgR73K6vbgl_noDYf";
const privateKey =
  "73d93254656026ea321c599c9912f7a56cf81f0a91a702b359783a2715ae9829";
module.exports = {
  solidity: "0.8.4",
  networks: {
    mumbai: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/Jnq1ivsHJRrCmriUgR73K6vbgl_noDYf",

      accounts: [privateKey],
    },
    hardhat: {
      chainId: 1337,
    },
  },
};
