// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

// 基础合约 X
contract X {
    string public name;

    constructor(string memory _name) {
        name = _name;
    }
}

// 基础合约 Y
contract Y {
    string public text;

    constructor(string memory _text) {
        text = _text;
    }
}

// 在继承列表中传递参数。
contract B is X("Input to X"), Y("Input to Y"){}

// 在构造函数中传递参数，
// 类似于函数修饰符
contract  C is X, Y {
    constructor(string memory _name, string memory _text) X(_name) Y(_text) {
        // code
    }
}

// 父构造函数总是按照继承顺序调用的
// 无论子合同构造器中列出的父合同顺序如何。
contract D is X, Y {
    constructor() X("X was called") Y("Y was called") {}
}

contract E is X, Y {
    constructor() Y("Y was called") X("X was called") {}
}