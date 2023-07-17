import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './TodoApp.scss';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      try {
        const parsedTasks = JSON.parse(storedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error('Error parsing stored tasks:', error);
      }
    }
  }, []);
  

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const handleToggleTaskStatus = (taskId) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
        };
      }
      return task;
    });
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  return (
    <div className="todo_app">
      <h1>Todo List App</h1>
      <TaskForm onAddTask={handleAddTask} />
      <TaskList
        tasks={tasks}
        onDeleteTask={handleDeleteTask}
        onToggleTaskStatus={handleToggleTaskStatus}
      />
    </div>
  );
};

const TaskForm = ({ onAddTask }) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        description: task,
        completed: false,
      };
      onAddTask(newTask);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter a new task"
      />
      <button type="submit">Add Task</button>
    </form>
  );
};

TaskForm.propTypes = {
  onAddTask: PropTypes.func.isRequired,
};

const TaskList = ({ tasks, onDeleteTask, onToggleTaskStatus }) => {
  return (
    <ul className="task-list">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onDeleteTask={onDeleteTask}
            onToggleTaskStatus={onToggleTaskStatus}
          />
        ))
      ) : (
        <p>No tasks assigned yet</p>
      )}
    </ul>
  );
};

TaskList.propTypes = {
  tasks: PropTypes.array.isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onToggleTaskStatus: PropTypes.func.isRequired,
};

const TaskItem = ({ task, onDeleteTask, onToggleTaskStatus }) => {
  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const handleToggleStatus = () => {
    onToggleTaskStatus(task.id);
  };

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      <span>{task.description}</span>
      <div className="btn_wrapper">
      <button
        className={`status-btn ${task.completed ? 'green' : 'yellow'}`}
        onClick={handleToggleStatus}
      >
        {task.completed ? 'Complete' : 'Ongoing'}
      </button>
      <button className="del-btn" onClick={handleDelete}>
        Delete
      </button>
      </div>
    </li>
  );
};

TaskItem.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onDeleteTask: PropTypes.func.isRequired,
  onToggleTaskStatus: PropTypes.func.isRequired,
};

export default TodoApp;
