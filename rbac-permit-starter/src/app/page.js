"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import sampleData from "@/data/sampleData";

export default function Home() {
  const [token, setToken] = useState(sampleData[0]);
  const [user, setUser] = useState(' ');
  const [todos, setTodos] = useState([]);
  const [todoContent, setTodoContent] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("low");
  const [identifier, setIdentifier] = useState(1)

  useEffect(() => {
    const response = () => {
      const data = jwtDecode(token);
      console.log("Data: ",data);
      const currentUser = data.name;
      const key = data.id
      const email = data.email;
      console.log("key: ", key);
      console.log("email: ", email);
      setUser(currentUser);
      setIdentifier(key)
    }
    response();
  }, [token]);

  useEffect(() => {
    const storedTodos = localStorage.getItem("todos");
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to local storage whenever todos array changes
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const checkPermission = async (operation) => {
    console.log("Operation: ", operation);
    
    const response = await fetch(`/api/check-permission?id=${identifier}&operation=${operation}`);
    console.log("Response from permitio: ", response);
    
    // bug: Problem lies here
    const data = await response.json(); 
    console.log("Data from permitio: ", data);
    
    return data.status === "permitted";
  };

  const handleAddTodo = async () => {
    if (!await checkPermission("create")) {
      alert("You do not have permission to create a to-do.");
      return;
    }

    const newTodo = {
      content: todoContent,
      deadline,
      priority,
      done: false,
    };
    setTodos([...todos, newTodo]);
    setTodoContent("");
    setDeadline("");
    setPriority("low");
  };

  const handleToggleDone = async (index) => {
    if (!await checkPermission("update")) {
      alert("You do not have permission to update a to-do.");
      return;
    }

    const updatedTodos = todos.map((todo, i) => i === index ? { ...todo, done: !todo.done } : todo);
    setTodos(updatedTodos);
  };

  const handleDeleteTodo = async (index) => {
    if (!await checkPermission("delete")) {
      alert("You do not have permission to delete a to-do.");
      return;
    }

    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 lg:text-xl ">
          <select
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className="mr-4 p-2 border rounded"
          >
            <option value={sampleData[0]}>Admin</option>
            <option value={sampleData[1]}>User</option>
          </select>
          <div>
            <input
              type="text"
              placeholder="To-do content"
              value={todoContent}
              onChange={(e) => setTodoContent(e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="mr-2 p-2 border rounded"
            />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mr-2 p-2 border rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <button
              onClick={handleAddTodo}
              className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>
        </div>
        
      </div>

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-full sm:before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-full sm:after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1]">
        <Image
          className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] dark:invert"
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <div className="w-full max-w-4xl mx-auto my-10">
          <ul className="space-y-4">
            {todos.map((todo, index) => (
              <li
                key={index}
                className={`p-4 border rounded flex justify-between items-center ${todo.done ? "bg-green-100" : ""}`}
              >
                <span>{todo.content}</span>
                <div>
                  <button
                    onClick={() => handleToggleDone(index)}
                    className="mr-2 p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  >
                    {todo.done ? "Undo" : "Done"}
                  </button>
                  <button
                    onClick={() => handleDeleteTodo(index)}
                    className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
