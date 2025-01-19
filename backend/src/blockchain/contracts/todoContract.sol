// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract TodoContract {
    address public owner; // Address of the contract owner

    enum Status {
        Pending,
        InProgress,
        Completed
    }

    mapping(string => Status) private todos; // Mapping to store todo statuses
    mapping(string => bool) private todoExists; // Mapping to check existence of a todo

    event TodoCreated(string id, Status status); // Event for todo creation
    event TodoUpdated(string id, Status newStatus); // Event for status updates

    constructor() {
        owner = msg.sender; // Set the owner as the deployer of the contract
    }

    modifier onlyOwner() {
      require(msg.sender == owner, 'Only the owner can call this function');
        _;
    }

    /**
     * @dev Creates a new todo item.
     * @param _id The unique identifier for the todo.
     */
    function createTodo(string memory _id) external onlyOwner {
        require(!todoExists[_id], 'Todo already exists');
        todos[_id] = Status.Pending;
        todoExists[_id] = true;
        emit TodoCreated(_id, Status.Pending);
    }

    /**
     * @dev Updates the status of an existing todo item.
     * @param _id The unique identifier for the todo.
     * @param _newStatus The new status to set for the todo.
     */
    function updateTodoStatus(
        string memory _id,
        uint8 _newStatus
    ) external onlyOwner {
        require(todoExists[_id], 'Todo does not exist');
        require(_newStatus <= 2, 'Invalid status');
    
        todos[_id] = Status(_newStatus);
        emit TodoUpdated(_id, Status(_newStatus));
    }

    /**
     * @dev Gets the status of a todo item.
     * @param _id The unique identifier for the todo.
     * @return The current status of the todo.
     */
    function getStatus(string memory _id) external view returns (Status) {
        require(todoExists[_id], 'Todo does not exist');
        return todos[_id];
    }
}
