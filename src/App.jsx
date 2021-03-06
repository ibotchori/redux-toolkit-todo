import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { addNewTodo, fetchTodos } from "./features/todos/todoSlice";
import NewTodoForm from "./components/NewTodoForm";
import TodoList from "./components/TodoList";

import "./App.css";

function App() {
  const [text, setText] = useState("");
  const dispatch = useDispatch();

  // Global state
  const { error, status } = useSelector((state) => state.todos);

  const handleAction = () => {
    if (text.trim().length) {
      dispatch(addNewTodo(text));
      setText("");
    }
  };

  // execute API call
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="App">
      <NewTodoForm
        value={text}
        updateText={setText}
        handleAction={handleAction}
      />
      {status === "pending" && <h3>Loading...</h3>}
      {error && <h3>An error occupied: {error}</h3>}
      <TodoList />
    </div>
  );
}

export default App;
