// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "../core/PredictionMarket.sol";

/**
 * @title SettlementContract
 * @notice Handles market outcome determination and fund distribution
 */
contract SettlementContract {
    struct Oracle {
        address oracleAddress;
        uint256 reputation;
        bool active;
    }
    
    mapping(address => Oracle) public oracles;
    mapping(address => mapping(uint256 => bool)) public hasVoted;
    mapping(uint256 => mapping(bool => uint256)) public votes;
    
    address public admin;
    uint256 public oracleCount;
    uint256 public constant QUORUM = 2; // Minimum votes needed
    
    event OracleRegistered(address indexed oracle);
    event VoteSubmitted(
        address indexed oracle,
        address indexed market,
        uint256 indexed marketId,
        bool outcome
    );
    event MarketSettled(
        address indexed market,
        uint256 indexed marketId,
        bool outcome
    );
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    modifier onlyOracle() {
        require(oracles[msg.sender].active, "Not oracle");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @notice Register oracle (admin only)
     */
    function registerOracle(address oracleAddress) external onlyAdmin {
        require(!oracles[oracleAddress].active, "Already registered");
        
        oracles[oracleAddress] = Oracle({
            oracleAddress: oracleAddress,
            reputation: 100,
            active: true
        });
        
        oracleCount++;
        
        emit OracleRegistered(oracleAddress);
    }
    
    /**
     * @notice Submit vote for market outcome
     */
    function submitVote(
        address marketAddress,
        uint256 marketId,
        bool outcome
    ) external onlyOracle {
        require(!hasVoted[marketAddress][marketId], "Already voted");
        
        hasVoted[marketAddress][marketId] = true;
        votes[marketId][outcome]++;
        
        emit VoteSubmitted(msg.sender, marketAddress, marketId, outcome);
        
        // Check if quorum reached
        if (votes[marketId][outcome] >= QUORUM) {
            settleMarket(marketAddress, outcome);
        }
    }
    
    /**
     * @notice Settle market with outcome
     */
    function settleMarket(address marketAddress, bool outcome) private {
        PredictionMarket market = PredictionMarket(marketAddress);
        market.settle(outcome);
        
        // Get market ID from factory if needed
        uint256 marketId = 0; // TODO: Get from factory
        
        emit MarketSettled(marketAddress, marketId, outcome);
    }
    
    /**
     * @notice Force settle market (admin only, emergency)
     */
    function forceSettle(
        address marketAddress,
        bool outcome
    ) external onlyAdmin {
        PredictionMarket market = PredictionMarket(marketAddress);
        market.settle(outcome);
    }
    
    /**
     * @notice Get vote count for outcome
     */
    function getVoteCount(uint256 marketId, bool outcome) 
        external 
        view 
        returns (uint256) 
    {
        return votes[marketId][outcome];
    }
    
    /**
     * @notice Check if oracle has voted
     */
    function hasOracleVoted(address marketAddress, uint256 marketId) 
        external 
        view 
        returns (bool) 
    {
        return hasVoted[marketAddress][marketId];
    }
}

