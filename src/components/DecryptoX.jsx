import React, { useState, useEffect } from 'react';
import { DecryptoXSol } from '../service/decryptoXSol.js';

const DecryptoX = () => {
    const [account, setAccount] = useState('');
    const [tokenPrice, setTokenPrice] = useState('');
    const [allocations, setAllocations] = useState({});
    const [lastPriceUpdateTime, setLastPriceUpdateTime] = useState(0);
    const [buyQuantity, setBuyQuantity] = useState(0); // Quantity to buy
    const [totalCost, setTotalCost] = useState(0); // Total cost in ETH
    const [tokenOwned, setTokenOwned] = useState(0);

    useEffect(() => {    
        getUserTokens();
        loadAccountAndData();
    }, []);

    const loadAccountAndData = async () => {
        const accounts = await DecryptoXSol.getAccount();
        setAccount(accounts);

        // Fetch initial token price and allocations
        const price = await DecryptoXSol.getTokenPrice();
        setTokenPrice(price);

        const allocationsData = await DecryptoXSol.fetchAllocations();
        setAllocations(allocationsData);
    };
    
    
    
    const getUserTokens = async() =>{
        const tokens = await DecryptoXSol.getTokens();        
        setTokenOwned(tokens);
    }

    const updateTokenPrice = async () => {
        try {
            const currentTime = Math.floor(Date.now() / 1000);
            console.log(currentTime + " " + (lastPriceUpdateTime + 10));
            
            if (currentTime >= lastPriceUpdateTime + 10) {
                await DecryptoXSol.increasePrice();
                setLastPriceUpdateTime(currentTime);
                const price = await DecryptoXSol.getTokenPrice();
                setTokenPrice(price);
                console.log("Price updated");
            } else {
                window.alert("10 seconds not completed");
            }
        } catch (error) {
            console.error("Error updating token price:", error);
        }
    };

    const handleBuyQuantityChange = (e) => {
        const quantity = e.target.value;
        setBuyQuantity(quantity);
        setTotalCost(quantity * tokenPrice); // Calculate total cost in ETH
    };

    const handleBuyTokens = async () => {
        try {
            const result = await DecryptoXSol.buyToken(buyQuantity);
            console.log("Purchase successful:", result);
            loadAccountAndData();
            getUserTokens();
            alert(`Successfully bought ${buyQuantity} tokens!`);
        } catch (error) {
            console.error("Error purchasing tokens:", error);
            alert("Failed to complete the purchase.");
        }
    };

    return (
        <div>
            <h1>DecryptoX ICO</h1>
            <p>Connected Account: {account}</p>
            <p>Token Price: {tokenPrice} ETH</p>
            
            <h2>Token Allocations</h2>
            <ul>
                <li><strong>Total Supply:</strong> {allocations.initialSupply} DCX</li>
                <li><strong>Public Presale:</strong> {allocations.publicPresale} DCX (25%)</li>
                <li><strong>Development & Innovation:</strong> {allocations.development} DCX (11%)</li>
                <li><strong>Marketing & Growth:</strong> {allocations.marketing} DCX (20%)</li>
                <li><strong>Staking:</strong> {allocations.staking} DCX (10%)</li>
                <li><strong>Community & Partnership:</strong> {allocations.community} DCX (11%)</li>
                <li><strong>Reserves:</strong> {allocations.reserves} DCX (13%)</li>
                <li><strong>Listing:</strong> {allocations.listing} DCX (10%)</li>
            </ul>
            
            <button id="updateBtn" onClick={updateTokenPrice}>Update</button>

            <h2>Buy Tokens</h2>
            <label>
                Number of Tokens to Buy:
                <input
                    type="number"
                    value={buyQuantity}
                    onChange={handleBuyQuantityChange}
                    min="0"
                    step="1"
                />
            </label>
            <p>Total Cost: {totalCost} ETH</p>
            <button onClick={handleBuyTokens}>Buy</button>
            <p>Token Owned: {tokenOwned}</p>
        </div>
    );
};

export default DecryptoX;
