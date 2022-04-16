import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import todoService from "./todoService";

export const fetchTodos = createAsyncThunk(
  "todos/fetchTodos", // <-- action name
  async function (_, { rejectWithValue }) {
    try {
      // API call from todoService file
      return await todoService.fetchTodos();
    } catch (error) {
      // pass error message to fetchTodos.reject (action.payload)
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo", // <-- action name
  async function (id, { rejectWithValue, dispatch }) {
    try {
      // remove todo from redux state first
      dispatch(removeTodo({ id }));

      // API call from todoService file, remove todo from server
      return await todoService.deleteTodo(id);
    } catch (error) {
      // pass error message to fetchTodos.reject (action.payload)
      return rejectWithValue(error.message);
    }
  }
);

export const toggleStatus = createAsyncThunk(
  "todos/toggleStatus",
  async function (id, { rejectWithValue, dispatch, getState }) {
    // get clicked todo with getState (getState gives global state)
    const todo = getState().todos.todos.find((todo) => todo.id === id);

    try {
      // toggle todo status in redux state first
      dispatch(toggleComplete({ id }));
      // API call from todoService file, toggle todo from server
      return await todoService.toggleStatus(id, todo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addNewTodo = createAsyncThunk(
  "todos/addNewTodo",
  // get text from input, when async function is executed
  async function (text, { rejectWithValue }) {
    // create todo
    const todo = {
      title: text,
      userId: 1,
      completed: false,
    };
    try {
      // API call from todoService file, add new todo to server
      return await todoService.addNewTodo(todo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Error Setter
const setError = (state, action) => {
  state.status = "rejected";
  // set value to error from rejectWithValue parameter
  state.error = action.payload;
};

const todoSlice = createSlice({
  name: "todos",
  initialState: {
    todos: [],
    status: null,
    error: null,
  },
  reducers: {
    addTodo(state, action) {
      state.todos.push(action.payload);
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
    [deleteTodo.rejected]: setError,
    [toggleStatus.rejected]: setError,
    [addNewTodo.fulfilled]: (state, action) => {
      state.status = "fulfilled";
      // add new todo redux state
      state.todos.push(action.payload);
      state.error = null;
    },
    [addNewTodo.rejected]: (state, action) => {
      state.status = "rejected";
      // set value to error from rejectWithValue parameter
      state.error = action.payload;
    },
  },
});

export const { addTodo, toggleComplete, removeTodo } = todoSlice.actions;

export default todoSlice.reducer;
