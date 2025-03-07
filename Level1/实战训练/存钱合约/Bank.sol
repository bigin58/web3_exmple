// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/*
    所有人都可以存钱
        ETH
    只有合约 owner 才可以取钱
    只要取钱，合约就销毁掉 selfdestruct
    扩展：支持主币以外的资产
        ERC20
        ERC721
*/
contract Bank {
    address public immutable owner;

    event Deposit(address _ad, uint256 amout); // 存钱事件
    event Withdraw(uint256 amount); // 取钱事件

    constructor() payable {
        owner = msg.sender; // 设置Owner为部署者
    }

    // 存款 自动响应普通转账（无数据）。
    receive() external payable { 
        emit Deposit(msg.sender, msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "Not owner");
        emit Withdraw(address(this).balance);
        selfdestruct(payable(msg.sender)); // 销毁合约，转账余额 selfdestruct会立即销毁合约并转移资金
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

}
