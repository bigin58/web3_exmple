// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Todos {
    struct Todo {
        string text;
        bool completed;
    }

    Todo[] public todos;

    function create(string calldata _text) public {
        // 三种方式初始化结构体
        // - 函数方式
        todos.push(Todo(_text, false));

        // - 键值映射
        todos.push(Todo({text: _text, completed: true}));

        // -初始化一个空结构，然后更新它
        Todo memory todo;
        todo.text = _text;
        todos.push(todo);
    }

    // Solidity 会自动为结构体创建 getter 函数
    // 模拟 getter 函数
    function get(uint256 _index) public view returns (string memory text, bool completed) {
        Todo storage todo = todos[_index];
        return(todo.text, todo.completed);
    }

    // 更新
    function updateText(uint256 _index, string calldata _text) public {
        Todo storage todo = todos[_index];
        todo.text = _text;
    }

    function updateCompleted(uint256 _index) public {
        Todo storage todo = todos[_index];
        todo.completed = !todo.completed;
    }
}