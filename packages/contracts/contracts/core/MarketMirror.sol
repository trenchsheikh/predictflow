// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./MarketFactory.sol";

/**
 * @title MarketMirror
 * @notice Mirrors markets from Polymarket to Arc
 */
contract MarketMirror {
    MarketFactory public immutable marketFactory;
    IERC20 public immutable usdc;
    
    mapping(string => uint256) public polymarketToPredictFlow;
    mapping(uint256 => string) public predictFlowToPolymarket;
    
    struct MirrorInfo {
        string polymarketId;
        string polymarketSlug;
        uint256 mirroredAt;
        bool active;
        address treasuryWallet;
    }
    
    mapping(uint256 => MirrorInfo) public mirrorInfo;
    
    event MarketMirrored(
        string indexed polymarketId,
        uint256 indexed predictFlowMarketId,
        string question
    );
    
    constructor(address _marketFactory, address _usdc) {
        require(_marketFactory != address(0), "Invalid MarketFactory");
        require(_usdc != address(0), "Invalid USDC");
        marketFactory = MarketFactory(_marketFactory);
        usdc = IERC20(_usdc);
    }
    
    function mirrorMarket(
        string memory polymarketId,
        string memory question,
        uint256 endDate,
        address oracle,
        address treasuryWallet
    ) external returns (uint256) {
        require(polymarketToPredictFlow[polymarketId] == 0, "Already mirrored");
        require(endDate > block.timestamp, "Invalid end date");
        require(oracle != address(0), "Invalid oracle");
        require(treasuryWallet != address(0), "Invalid treasury");
        
        uint256 marketId = marketFactory.createMarket(
            question,
            endDate,
            oracle,
            address(usdc)
        );
        
        polymarketToPredictFlow[polymarketId] = marketId;
        predictFlowToPolymarket[marketId] = polymarketId;
        
        mirrorInfo[marketId] = MirrorInfo({
            polymarketId: polymarketId,
            polymarketSlug: "",
            mirroredAt: block.timestamp,
            active: true,
            treasuryWallet: treasuryWallet
        });
        
        emit MarketMirrored(polymarketId, marketId, question);
        
        return marketId;
    }
    
    function getPredictFlowMarket(string memory polymarketId) 
        external 
        view 
        returns (uint256) 
    {
        return polymarketToPredictFlow[polymarketId];
    }
    
    function isMirrored(string memory polymarketId) 
        external 
        view 
        returns (bool) 
    {
        return polymarketToPredictFlow[polymarketId] != 0;
    }
}

