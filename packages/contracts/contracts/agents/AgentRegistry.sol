// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgentRegistry
 * @notice Registry for AI market maker agents
 */
contract AgentRegistry {
    struct Agent {
        address agentAddress;
        string name;
        uint256 capital;
        uint256 reputation;
        uint256 tradesExecuted;
        uint256 volumeProvided;
        bool verified;
        bool active;
        uint256 registeredAt;
    }
    
    mapping(uint256 => Agent) public agents;
    mapping(address => uint256) public agentIds;
    uint256 public agentCount;
    
    address public admin;
    uint256 private constant MIN_REPUTATION = 0;
    uint256 private constant MAX_REPUTATION = 1000;
    uint256 private constant INITIAL_REPUTATION = 100;
    
    event AgentRegistered(
        uint256 indexed agentId,
        address indexed agentAddress,
        string name
    );
    event AgentVerified(uint256 indexed agentId);
    event AgentDeactivated(uint256 indexed agentId);
    event ReputationUpdated(uint256 indexed agentId, uint256 newReputation);
    event CapitalUpdated(uint256 indexed agentId, uint256 newCapital);
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }
    
    constructor() {
        admin = msg.sender;
    }
    
    /**
     * @notice Register a new agent
     */
    function registerAgent(string memory name) external returns (uint256) {
        require(agentIds[msg.sender] == 0, "Already registered");
        require(bytes(name).length > 0, "Name required");
        
        uint256 agentId = ++agentCount;
        
        agents[agentId] = Agent({
            agentAddress: msg.sender,
            name: name,
            capital: 0,
            reputation: INITIAL_REPUTATION,
            tradesExecuted: 0,
            volumeProvided: 0,
            verified: false,
            active: true,
            registeredAt: block.timestamp
        });
        
        agentIds[msg.sender] = agentId;
        
        emit AgentRegistered(agentId, msg.sender, name);
        
        return agentId;
    }
    
    /**
     * @notice Verify an agent (admin only)
     */
    function verifyAgent(uint256 agentId) external onlyAdmin {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        require(!agents[agentId].verified, "Already verified");
        
        agents[agentId].verified = true;
        
        emit AgentVerified(agentId);
    }
    
    /**
     * @notice Deactivate an agent
     */
    function deactivateAgent(uint256 agentId) external {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        Agent storage agent = agents[agentId];
        require(
            msg.sender == agent.agentAddress || msg.sender == admin,
            "Not authorized"
        );
        require(agent.active, "Already inactive");
        
        agent.active = false;
        
        emit AgentDeactivated(agentId);
    }
    
    /**
     * @notice Update agent capital
     */
    function updateCapital(uint256 agentId, uint256 newCapital) external {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        Agent storage agent = agents[agentId];
        require(msg.sender == agent.agentAddress, "Not agent");
        
        agent.capital = newCapital;
        
        emit CapitalUpdated(agentId, newCapital);
    }
    
    /**
     * @notice Update agent reputation (called by markets)
     */
    function updateReputation(uint256 agentId, int256 change) external {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        Agent storage agent = agents[agentId];
        
        if (change > 0) {
            agent.reputation = agent.reputation + uint256(change);
            if (agent.reputation > MAX_REPUTATION) {
                agent.reputation = MAX_REPUTATION;
            }
        } else if (change < 0) {
            uint256 decrease = uint256(-change);
            if (decrease >= agent.reputation) {
                agent.reputation = MIN_REPUTATION;
            } else {
                agent.reputation = agent.reputation - decrease;
            }
        }
        
        emit ReputationUpdated(agentId, agent.reputation);
    }
    
    /**
     * @notice Record trade by agent
     */
    function recordTrade(uint256 agentId, uint256 volume) external {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        Agent storage agent = agents[agentId];
        
        agent.tradesExecuted++;
        agent.volumeProvided += volume;
    }
    
    /**
     * @notice Get agent details
     */
    function getAgent(uint256 agentId) 
        external 
        view 
        returns (Agent memory) 
    {
        require(agentId > 0 && agentId <= agentCount, "Invalid agent");
        return agents[agentId];
    }
    
    /**
     * @notice Get agent ID by address
     */
    function getAgentId(address agentAddress) 
        external 
        view 
        returns (uint256) 
    {
        return agentIds[agentAddress];
    }
    
    /**
     * @notice Check if address is registered agent
     */
    function isAgent(address agentAddress) external view returns (bool) {
        return agentIds[agentAddress] > 0;
    }
    
    /**
     * @notice Get active agents count
     */
    function getActiveAgentCount() external view returns (uint256 count) {
        for (uint256 i = 1; i <= agentCount; i++) {
            if (agents[i].active) {
                count++;
            }
        }
        return count;
    }
}

