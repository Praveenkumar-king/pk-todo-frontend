import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Todos.css";
import API from "../../utils/api"; // ✅ backend helper

const Todos = () => {
  const navigate = useNavigate();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [message, setMessage] = useState("");

  // ✅ Fetch todos from backend
  useEffect(() => {
    fetchTodos();
  }, []);

  // ✅ Dark mode persistence
  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const fetchTodos = async () => {
    try {
      const res = await API.get("/api/todos");
      setTodos(res.data);
    } catch (err) {
      console.error("Failed to fetch todos");
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await API.post("/api/todos", { title });
      setTitle("");
      fetchTodos();
    } catch (err) {
      console.error("Failed to add todo");
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await API.put(`/api/todos/${id}`, {
        completed: !completed,
      });
      fetchTodos();
    } catch (err) {
      console.error("Failed to update todo");
    }
  };

  const togglePin = async (id) => {
    try {
      await API.put(`/api/todos/pin/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Failed to pin todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await API.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Failed to delete todo");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setMessage("Logged out successfully");

    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  // 🔽 pinned first (same logic)
  const sortedTodos = [...todos].sort(
    (a, b) => b.pinned - a.pinned
  );

  return (
    <div className={dark ? "todos-container dark" : "todos-container"}>
      {/* TOP BAR */}
      <header className="todos-header">
        <h2>PK Todo</h2>
        <div className="header-actions">
          <button
            className="toggle-btn"
            onClick={() => setDark(!dark)}
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </header>

      {/* ADD TODO */}
      <div className="add-todo">
        <input
          type="text"
          placeholder="Enter your todo..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      {/* TODOS LIST */}
      <div className="todo-list">
        {sortedTodos.length === 0 && (
          <p className="empty-text">
            No todos yet. Create one!
          </p>
        )}

        {sortedTodos.map((todo) => (
          <div
            key={todo._id}
            className={
              todo.completed
                ? "todo-item completed"
                : "todo-item"
            }
          >
            <span
              onClick={() =>
                toggleComplete(todo._id, todo.completed)
              }
            >
              {todo.title}
            </span>

            <div className="todo-actions">
              <button onClick={() => togglePin(todo._id)}>
                {todo.pinned ? "📌" : "📍"}
              </button>
              <button onClick={() => deleteTodo(todo._id)}>
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {message && <p className="logout-msg">{message}</p>}
    </div>
  );
};

export default Todos;
