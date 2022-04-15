import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const baseURL = "https://jsonplaceholder.typicode.com/";

// API call
export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos", // <-- action name
  async function (_, { rejectWithValue }) {
    try {
      const response = await fetch(`${baseURL}todos?_limit=10`);

      if (!response.ok) {
        throw new Error("Server Error!");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      // pass error message to fetchTodos.reject (action.payload)
      return rejectWithValue(error.message);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push({
        id: new Date().toISOString(),
        title: action.payload.text,
        completed: false,
      });
    },
    toggleComplete(state, action) {
      const toggledTodo = state.todos.find(
        (todo) => todo.id === action.payload.id
      );
      toggledTodo.completed = !toggledTodo.completed;
    },
    removeTodo(state, action) {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload.id);
    },
  },
  extraReducers: {
    [fetchTodos.pending]: (state) => {
      state.status = "pending";
      state.error = null;
    },
    [fetchTodos.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      state.todos = action.payload;
      state.error = null;
    },
    [fetchTodos.rejected]: (state, action) => {
      state.status = "rejected";
      // set value to error from rejectWithValue parameter
      state.error = action.payload;
    },
  },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;
