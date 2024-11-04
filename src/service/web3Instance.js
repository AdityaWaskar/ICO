import Web3 from 'web3';

// Set up Web3 and connect to MetaMask or a local provider
let web3;
if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
        // Request account access if needed
        await window.ethereum.enable();
    } catch (error) {
        console.error("User denied account access");
    }
} else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    // Set up a local Ganache network (replace with your Ganache endpoint)
    web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
}   

export default web3;
