// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PredictionMarket.sol";

/**
 * @title MarketFactory
 * @notice Factory contract for creating prediction markets on Arc
 */
contract MarketFactory {
    address public immutable usdc;
    address public immutable eurc;
    
    struct Market {
        string question;
        uint256 endDate;
        address oracle;
        address currency; // USDC or EURC
        address marketContract;
        bool settled;
    }
    
    Market[] public markets;
    
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        address indexed marketContract,
        address currency
    );
    
    constructor(address _usdc, address _eurc) {
        require(_usdc != address(0), "Invalid USDC address");
        require(_eurc != address(0), "Invalid EURC address");
        usdc = _usdc;
        eurc = _eurc;
    }
    
    function createMarket(
        string memory question,
        uint256 endDate,
        address oracle,
        address currency
    ) external returns (uint256) {
        require(currency == usdc || currency == eurc, "Invalid currency");
        require(endDate > block.timestamp, "Invalid end date");
        require(oracle != address(0), "Invalid oracle");
        
        uint256 marketId = markets.length;
        
        // Deploy new PredictionMarket contract
        // In production, use CREATE2 for deterministic addresses
        address marketContract = address(new PredictionMarket(
            question,
            endDate,
            oracle,
            currency
        ));
        
        markets.push(Market({
            question: question,
            endDate: endDate,
            oracle: oracle,
            currency: currency,
            marketContract: marketContract,
            settled: false
        }));
        
        emit MarketCreated(marketId, question, marketContract, currency);
        
        return marketId;
    }
    
    function getMarket(uint256 marketId) external view returns (Market memory) {
        require(marketId < markets.length, "Market does not exist");
        return markets[marketId];
    }
    
    function getMarketCount() external view returns (uint256) {
        return markets.length;
    }
}

