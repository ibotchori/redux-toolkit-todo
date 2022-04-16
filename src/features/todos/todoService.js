/* Making HTTP requests */

const baseURL = "https://jsonplaceholder.typicode.com/";

const fetchTodos = async () => {
  const response = await fetch(`${baseURL}todos?_limit=10`);

  if (!response.ok) {
    throw new Error("Server Error!");
  }
  console.log(response);

  const data = await response.json();
  return data;
};

const deleteTodo = async (id) => {
  // remove todo from server
  const response = await fetch(`${baseURL}todos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Can't delete task. Server error.");
  }
  console.log(response);

  const data = await response.json();
  return data;
};

const toggleStatus = async (id, todo) => {
  // toggle todo status on server
  const response = await fetch(`${baseURL}todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // toggle clicked todo
      completed: !todo.completed,
    }),
  });
  console.log(response);

  if (!response.ok) {
    throw new Error("Can't toggle status. Server error.");
  }
};

const addNewTodo = async (todo) => {
  // add todo to server
  const response = await fetch(`${baseURL}todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error("Can't add task. Server error.");
  }
  console.log(response);

  // get server response (added todo)
  const data = await response.json();
  return data;
};

const todoService = {
  fetchTodos,
  deleteTodo,
  toggleStatus,
  addNewTodo,
};

export default todoService;
