import Web3 from 'web3';
import CONFIGURATION from './config';
export default new Web3(new Web3.providers.HttpProvider(CONFIGURATION.infuraURL));