import Web3 from 'web3';
import { VAULT_HEALER_ADDRESS, POLYGON_WEB3_PROVIDER, PRIVATE_KEY } from '../config/constants';

const vaultHealerAbi = require('../abi/vaultHealer.json');

const web3 = new Web3(new Web3.providers.HttpProvider(POLYGON_WEB3_PROVIDER));
const contract = new web3.eth.Contract(vaultHealerAbi, VAULT_HEALER_ADDRESS);
const ownerAccount = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY);

const compoundVaults = async () => {
    const compound = contract.methods.earnAll();
    const encodedCompound = compound.encodeABI();
    
    const transaction = {
        from: ownerAccount.address,
        to: VAULT_HEALER_ADDRESS,
        gas: 20000000,
        data: encodedCompound,
        gasPrice: web3.utils.toWei('100', 'gwei')
    };

    const signedTx = await ownerAccount.signTransaction(transaction);
    console.log('Attempting transaction... Dreaming of Gjolund while I wait 😍');

    try {
        const txReciept = await web3.eth.sendSignedTransaction(signedTx.rawTransaction as string);
        console.log(`Transaction completed. Hash: ${txReciept.transactionHash}`);
    } catch(err: any) {
        console.log(err.message);
    }
};

// Call with npm run compound
compoundVaults();