/* Making HTTP requests */

const baseURL = "https://jsonplaceholder.typicode.com/";

const fetchTodos = async () => {
  const response = await fetch(`${baseURL}todos?_limit=10`);

  if (!response.ok) {
    throw new Error("Server Error!");
  }

  const data = await response.json();
  return data;
};

const todoService = {
  fetchTodos,
};

export default todoService;
