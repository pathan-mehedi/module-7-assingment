/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import './TodoApp.scss';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const handleAddTask = (task) => {
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleDeleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="todo_app">
      <h1>Todo List App</h1>
      <TaskForm onAddTask={handleAddTask} />
      {tasks.length > 0 ? (
        <TaskList tasks={tasks} onDeleteTask={handleDeleteTask} />
      ) : (
        <p>No tasks assigned yet</p>
      )}
    </div>
  );
};

const TaskForm = ({ onAddTask }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      const newTask = { id: Date.now(), description: task };
      onAddTask(newTask);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        className='todo_input'
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a new task"
        style={{ color: 'black' }}
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

const TaskList = ({ tasks, onDeleteTask }) => {
  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} onDeleteTask={onDeleteTask} />
      ))}
    </ul>
  );
};

const TaskItem = ({ task, onDeleteTask }) => {
  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  return (
    <li className='todo_list'>
      <span>{task.description}</span>
      <button onClick={handleDelete} className='del_btn'>
        Delete
      </button>
    </li>
  );
};

export default TodoApp;
