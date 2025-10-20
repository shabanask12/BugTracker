import React, { useState, useEffect } from 'react';

// A unique key to store our tasks in localStorage
const LOCAL_STORAGE_KEY = 'react-todo-list-tasks';

function TodoList() {
  // STATE 1: An array of task objects.
  const [tasks, setTasks] = useState([]);

  // STATE 2: A string to hold the value of the input field.
  const [inputValue, setInputValue] = useState('');

  // EFFECT: Load tasks from localStorage when the component mounts.
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (storedTasks) {
      setTasks(storedTasks);
    }
  }, []); // The empty array [] means this effect runs only once on mount.

  // EFFECT: Save tasks to localStorage whenever the tasks state changes.
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]); // This effect runs whenever the `tasks` array changes.

  // Function to handle changes in the input field
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Function to add a new task to the list
  const handleAddTask = (event) => {
    event.preventDefault(); // Prevents the form from refreshing the page
    if (inputValue.trim() === '') return; // Don't add an empty task

    // Create a new task object with a unique ID and text
    const newTask = {
      id: Date.now(), // Simple unique ID using timestamp
      text: inputValue,
      isCompleted: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue(''); // Clear the input field after adding
  };

  // Function to remove a task from the list
  const handleDeleteTask = (taskId) => {
    // Create a new array that excludes the task with the given id
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
  };

  // Function to toggle the completion status of a task
  const handleToggleComplete = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        // Return a new object with the toggled isCompleted status
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-container">
      <h2>My To-Do List ✨</h2>
      <form onSubmit={handleAddTask} className="todo-form">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task..."
          className="todo-input"
        />
        <button type="submit" className="todo-button">
          Add Task
        </button>
      </form>

      <ul className="todo-list">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={task.isCompleted ? 'todo-item completed' : 'todo-item'}
          >
            <span onClick={() => handleToggleComplete(task.id)}>
              {task.text}
            </span>
            <button
              onClick={() => handleDeleteTask(task.id)}
              className="delete-button"
            >
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;