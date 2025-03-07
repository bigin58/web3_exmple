// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TodoList {
    struct Todo {
        string name;
        bool isCompleted;
    }

    Todo[] public list;

    // 创建任务
    function create(string memory _name) external {
        list.push(
            Todo({
                name: _name,
                isCompleted: false
            })
        );
    }

    // 修改任务名称
    function modiName(uint256 _index, string memory _name) external {
         // 方法1: 直接修改，修改一个属性时候比较省 gas
        list[_index].name = _name;
    }

    function modiName2(uint256 _index, string memory _name) external {
        // 方法2: 先获取储存到 storage，在修改，在修改多个属性的时候比较省 gas
        Todo storage temp = list[_index];
        temp.name = _name;
    }

    // 修改完成状态
    function modiStatus(uint256 _index, bool _status) external {
        // 方法1：手动修改
        list[_index].isCompleted = _status;
    }

    function modiStatus2(uint256 _index) external {
        // 方法2：自动切换
        list[_index].isCompleted = !list[_index].isCompleted;
    }

    // 获取任务
    // get2 的 gas 费用比较低
    // get1 需要先把值复制到内存中，需要消耗 gas 费用比较大，
    // get2 是直接引用链上 storage 的指针，需要消耗的 gas 费用比较小
    function get(uint256 _index) external view returns (string memory _name, bool _status) {
        Todo memory temp = list[_index];
        return (temp.name, temp.isCompleted);
    }

    function get2(uint256 _index) external view returns (string memory _name, bool _status) {
        Todo storage temp = list[_index];
        return (temp.name, temp.isCompleted);
    }
}