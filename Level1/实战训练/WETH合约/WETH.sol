// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// 将ETH转换为ERC20代币的合约
contract WETH {
    string public name = "Wrapped Ether"; // 代币名称
    string public symbol = "WETH"; // 代币符号
    uint8 public decimals = 18; // 精度（与ETH一致）
    mapping(address => uint256) public balanceOf; // 地址余额映射
    mapping(address => mapping(address => uint256)) public allowance; // 授权额度映射

    event Approval(
        address indexed src,
        address indexed delegateAds,
        uint256 amount
    ); // 授权事件
    event Transfer(address indexed src, address indexed toAds, uint256 amount); // 转账事件
    event Deposit(address indexed toAds, uint256 amount); // 存入ETH事件
    event Withdraw(address indexed src, uint256 amount); // 提取ETH事件    
    

    function deposit() public payable {
        balanceOf[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw(uint256 amount) public {
        require(balanceOf[msg.sender] >= amount);
        balanceOf[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }

    function totalSupply() public view returns (uint256) {
        return address(this).balance;
    }

    // 授权额度
    function approve(address delegateAds, uint256 amount)
        public
        returns (bool)
    {
        allowance[msg.sender][delegateAds] = amount;
        emit Approval(msg.sender, delegateAds, amount);
        return true;
    }

    // 转账（调用 transferFrom 实现）
    function transfer(address toAds, uint256 amount) public returns (bool) {
        return transferFrom(msg.sender, toAds, amount);
    }

    // 代币转移（支持直接转账或授权转账）
    function transferFrom(
        address src,
        address toAds,
        uint256 amount
    ) public returns (bool) {
        require(balanceOf[src] >= amount);
        if (src != msg.sender) {
            require(allowance[src][msg.sender] >= amount);
            allowance[src][msg.sender] -= amount;
        }
        balanceOf[src] -= amount;
        balanceOf[toAds] += amount;
        emit Transfer(src, toAds, amount);
        return true;
    }

    fallback() external payable {
        deposit();
    }

    receive() external payable {
        deposit();
    }
}
