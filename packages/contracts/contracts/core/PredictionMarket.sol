// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @notice AMM for binary prediction markets
 */
contract PredictionMarket is ReentrancyGuard {
    IERC20 public immutable currency; // USDC or EURC
    address public immutable oracle;
    string public question;
    uint256 public endDate;
    
    uint256 public yesShares;
    uint256 public noShares;
    bool public settled;
    bool public outcome;
    
    uint256 private constant INITIAL_LIQUIDITY = 1000e6; // 1000 USDC
    uint256 private constant K_MULTIPLIER = 1e18;
    
    mapping(address => uint256) public yesBalances;
    mapping(address => uint256) public noBalances;
    
    event Trade(
        address indexed trader,
        bool indexed outcome,
        uint256 amount,
        uint256 shares,
        uint256 price
    );
    event LiquidityAdded(address indexed provider, uint256 amount);
    event Settled(bool outcome);
    event Redeemed(address indexed user, uint256 amount);
    
    constructor(
        string memory _question,
        uint256 _endDate,
        address _oracle,
        address _currency
    ) {
        require(_endDate > block.timestamp, "Invalid end date");
        require(_oracle != address(0), "Invalid oracle");
        require(_currency != address(0), "Invalid currency");
        
        question = _question;
        endDate = _endDate;
        oracle = _oracle;
        currency = IERC20(_currency);
        
        // Initialize with equal liquidity
        yesShares = INITIAL_LIQUIDITY;
        noShares = INITIAL_LIQUIDITY;
    }
    
    /**
     * @notice Buy shares (Yes or No)
     */
    function buyShares(bool _outcome, uint256 amount) 
        external 
        nonReentrant 
        returns (uint256 shares) 
    {
        require(!settled, "Market settled");
        require(block.timestamp < endDate, "Market ended");
        require(amount > 0, "Amount must be > 0");
        
        require(
            currency.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Calculate shares using AMM formula: x * y = k
        uint256 k = yesShares * noShares;
        
        if (_outcome) {
            // Buying YES shares
            uint256 newYes = yesShares + amount;
            uint256 newNo = k / newYes;
            shares = noShares - newNo;
            
            yesShares = newYes;
            noShares = newNo;
            yesBalances[msg.sender] += shares;
        } else {
            // Buying NO shares
            uint256 newNo = noShares + amount;
            uint256 newYes = k / newNo;
            shares = yesShares - newYes;
            
            noShares = newNo;
            yesShares = newYes;
            noBalances[msg.sender] += shares;
        }
        
        uint256 price = getPrice(_outcome);
        emit Trade(msg.sender, _outcome, amount, shares, price);
        
        return shares;
    }
    
    /**
     * @notice Sell shares back to market
     */
    function sellShares(bool _outcome, uint256 shares) 
        external 
        nonReentrant 
        returns (uint256 amount) 
    {
        require(!settled, "Market settled");
        require(block.timestamp < endDate, "Market ended");
        require(shares > 0, "Shares must be > 0");
        
        if (_outcome) {
            require(yesBalances[msg.sender] >= shares, "Insufficient balance");
            yesBalances[msg.sender] -= shares;
            
            uint256 k = yesShares * noShares;
            uint256 newYes = yesShares - shares;
            uint256 newNo = k / newYes;
            amount = newNo - noShares;
            
            yesShares = newYes;
            noShares = newNo;
        } else {
            require(noBalances[msg.sender] >= shares, "Insufficient balance");
            noBalances[msg.sender] -= shares;
            
            uint256 k = yesShares * noShares;
            uint256 newNo = noShares - shares;
            uint256 newYes = k / newNo;
            amount = newYes - yesShares;
            
            noShares = newNo;
            yesShares = newYes;
        }
        
        require(currency.transfer(msg.sender, amount), "Transfer failed");
        
        uint256 price = getPrice(_outcome);
        emit Trade(msg.sender, _outcome, amount, shares, price);
        
        return amount;
    }
    
    /**
     * @notice Get current price for outcome (in basis points, 0-10000)
     */
    function getPrice(bool _outcome) public view returns (uint256) {
        uint256 total = yesShares + noShares;
        if (total == 0) return 5000; // 50% default
        
        if (_outcome) {
            return (yesShares * 10000) / total;
        } else {
            return (noShares * 10000) / total;
        }
    }
    
    /**
     * @notice Add liquidity to market
     */
    function addLiquidity(uint256 amount) external nonReentrant {
        require(!settled, "Market settled");
        require(amount > 0, "Amount must be > 0");
        
        require(
            currency.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        
        // Split liquidity equally
        uint256 half = amount / 2;
        yesShares += half;
        noShares += half;
        
        emit LiquidityAdded(msg.sender, amount);
    }
    
    /**
     * @notice Settle market (only oracle)
     */
    function settle(bool _outcome) external {
        require(msg.sender == oracle, "Only oracle");
        require(!settled, "Already settled");
        require(block.timestamp >= endDate, "Market not ended");
        
        settled = true;
        outcome = _outcome;
        
        emit Settled(_outcome);
    }
    
    /**
     * @notice Redeem winning shares
     */
    function redeem() external nonReentrant returns (uint256 amount) {
        require(settled, "Market not settled");
        
        uint256 shares;
        if (outcome) {
            shares = yesBalances[msg.sender];
            require(shares > 0, "No winning shares");
            yesBalances[msg.sender] = 0;
        } else {
            shares = noBalances[msg.sender];
            require(shares > 0, "No winning shares");
            noBalances[msg.sender] = 0;
        }
        
        // 1 winning share = 1 currency unit
        amount = shares;
        require(currency.transfer(msg.sender, amount), "Transfer failed");
        
        emit Redeemed(msg.sender, amount);
        return amount;
    }
    
    /**
     * @notice Get user's position
     */
    function getPosition(address user) 
        external 
        view 
        returns (uint256 yes, uint256 no) 
    {
        return (yesBalances[user], noBalances[user]);
    }
    
    /**
     * @notice Get market state
     */
    function getMarketState() 
        external 
        view 
        returns (
            uint256 yesPrice,
            uint256 noPrice,
            uint256 yesLiquidity,
            uint256 noLiquidity,
            bool isSettled,
            bool marketOutcome
        ) 
    {
        return (
            getPrice(true),
            getPrice(false),
            yesShares,
            noShares,
            settled,
            outcome
        );
    }
}

