// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
/*
    任何人都可以发送金额到合约
    只有 owner 可以取款
    3 种取钱方式
*/

contract EtherWallet {
    address payable public immutable owner;

    event Log(string funName, address from, uint256 value, bytes data); // 存入事件

    constructor() {
        owner = payable(msg.sender);
    }

    // 存入 ETH 的时候触发
    receive() external payable { 
        emit Log("receive", msg.sender, msg.value,"");
    }

    function withdraw1() external {
        require(msg.sender == owner, "Not owner");
        payable(msg.sender).transfer(100);
    }

    function withdraw2() external {
        require(msg.sender == owner, "Not owner");
        bool success = payable(msg.sender).send(200);
        require(success, "Send Failed");
    }

    function withdraw3() external {
        require(msg.sender == owner, "Not owner");
        (bool success, ) = msg.sender.call{value: address(this).balance}("");
        require(success, "Call Failed");
    }

    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
}