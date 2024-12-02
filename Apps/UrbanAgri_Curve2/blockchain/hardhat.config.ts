  import { HardhatUserConfig } from 'hardhat/config';
  import '@nomicfoundation/hardhat-toolbox';
  import 'hardhat-multibaas-plugin';
  import path from 'path';

  let deployerPrivateKey = '0x96f37ff80736d91fe5ac616539f918d568ba506ac7c1a4d5d2b02b472e3f89c8';
  let deploymentEndpoint, ethChainID, web3Key, adminApiKey, rpcUrl = '';

  if (process.env.HARDHAT_NETWORK) {
    const CONFIG_FILE = path.join(__dirname, `./deployment-config.${process.env.HARDHAT_NETWORK}`);
    ({
      deploymentConfig: { deploymentEndpoint, ethChainID, deployerPrivateKey, web3Key, adminApiKey, rpcUrl },
    } = require(CONFIG_FILE));
  }

  const web3Url = web3Key ?`${deploymentEndpoint}/web3/${web3Key}` : rpcUrl;

  const config: HardhatUserConfig = {
    networks: {
      development: {
        url: web3Url,
        chainId: ethChainID,
        accounts: [deployerPrivateKey],
      },
      testing: {
        url: web3Url,
        chainId: ethChainID,
        accounts: [deployerPrivateKey],
      },
    },
    mbConfig: {
      apiKey: adminApiKey,
      host: deploymentEndpoint,
      allowUpdateAddress: ['development', 'testing'],
      allowUpdateContract: ['development'],
    },
    solidity: {
      compilers: [
        {
          version: '0.8.24',
          settings: {
            optimizer: {
              enabled: true,
              runs: 99999,
            },
            evmVersion: 'paris', // until PUSH0 opcode is widely supported
          },
        },
      ],
    },
    artifacts: {
      database: './blockchain/artifacts',
    },
  };

  export default config;