import { abi, contract_address, private_key } from "../assets/abi";
import Web3 from "web3"; 

const web3 = new Web3(window.ethereum);
const account1 = web3.eth.accounts.privateKeyToAccount(private_key);
web3.eth.accounts.wallet.add(account1);
const contract = new web3.eth.Contract(abi, contract_address);

const DecryptoXSol = {
    async getAccount() {
        const accounts = await web3.eth.requestAccounts();
        console.log(accounts);
        return accounts[0];
    },

    async getTokenPrice() {
        const price = await contract.methods.getTokenPrice().call();
        return web3.utils.fromWei(price, 'ether');
    },

    async fetchAllocations() {
        const initialSupply = await contract.methods.INITIAL_SUPPLY().call();
        const publicPresale = await contract.methods.presaleTokens().call();
        // const publicPresale = await contract.methods.PUBLIC_PRESALE().call();
        const development = await contract.methods.DEVELOPMENT().call();
        const marketing = await contract.methods.MARKETING().call();
        const staking = await contract.methods.STAKING().call();
        const community = await contract.methods.COMMUNITY().call();
        const reserves = await contract.methods.RESERVES().call();
        const listing = await contract.methods.LISTING().call();

        return {
            initialSupply: web3.utils.fromWei(initialSupply, 'ether'),
            publicPresale: web3.utils.fromWei(publicPresale, 'ether'),
            development: web3.utils.fromWei(development, 'ether'),
            marketing: web3.utils.fromWei(marketing, 'ether'),
            staking: web3.utils.fromWei(staking, 'ether'),
            community: web3.utils.fromWei(community, 'ether'),
            reserves: web3.utils.fromWei(reserves, 'ether'),
            listing: web3.utils.fromWei(listing, 'ether'),
        };
    },

    async increasePrice() {
        try {
            const account = await this.getAccount();
            
            // Create the transaction object
            const txObject = {
                from: account,
                gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                gasLimit: web3.utils.toHex(300000),
            };

            const result = await contract.methods.updateTokenPrice().send(txObject);
            console.log("Transaction receipt:", result);
            return result;  // Return the result if needed
        } catch (error) {
            console.error("Error updating token price:", error);
            throw error; // Rethrow to allow further handling if needed
        }
    },
    async buyToken(amt) {
        try {
            const account = await this.getAccount();
            
            // Create the transaction object
            const txObject = {
                from: account,
                gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
                gasLimit: web3.utils.toHex(300000),
            };

    
            const result = await contract.methods.buyTokens(amt).send(txObject);
            console.log("Transaction receipt:", result);
            return result;  // Return the result if needed
        } catch (error) {
            console.error("Error buying tokens:", error);
            throw error; // Rethrow to allow further handling if needed
        }
    },
    async getTokens(){
            try {
                const account = await this.getAccount();

                const res = await contract.methods.balanceOf(account).call();
                
                return parseInt(res);
            } catch (error) {
                console.error("Error for getting tokens", error)
                throw error;
            }
    }
};

export { DecryptoXSol };
