import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from "axios";

const API_URL = "http://localhost:10031/api/todos";
const initialState = {
  todoList: [],
  status: "idle",//"idle" | "loading" | "succeeded" | "failed"
  error:""
};
export const fetchTodos = createAsyncThunk("todos/fetchTodos",
async (data,{ rejectWithValue }) =>  {
try {
    const res = await axios.get(API_URL);
      
        return res.data.todos.map(todo => {
          return {
            id: todo.todoId,
            content: todo.todo,
            completed: todo.completed
          }
        })

      }catch (err){

        return rejectWithValue(err.name || err.message);

      }
      
  });
export const addToDo = createAsyncThunk("todos/addToDo",
 (newTodo,{ rejectWithValue }) =>  {
   const {newContent} = newTodo;
  return axios.post(API_URL,{todo:newContent, userId:"USR16694759RAAPQ608423"})
   .then((res) => {
     res =  res.data.new;
     return {
      id: res.todoId,
      content: res.todo,
      completed: res.completed
     }
   })
   .catch ((err)=>{

        return rejectWithValue(err.name || err.message);

      })
      
});
export const deleteToDo = createAsyncThunk("todos/deleteToDo",
 (delTodo,{ rejectWithValue }) =>  {
   const {id} = delTodo;
  return axios.delete(`${API_URL}/${id}`)
   .then((res) => {
     return id})
   .catch ((err)=>{

        return rejectWithValue(err.name || err.message);

      });
      
    });

export const toDoSlider = createSlice({
  name: 'toDo',
  initialState,
  reducers: {
    
    
    editTodo: (state, action) => {
      let { todoList } = state;
      state.todoList = todoList.map((item) => item.id === action.payload.id ? action.payload : item);
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTodos.pending, (state) => {
      state.status = "loading";
      state.todoList = [];
      state.error = '';

    })
    builder.addCase(fetchTodos.fulfilled, (state, action) => {
      state.status = "succeeded";
      state.todoList = action.payload;
      state.error = '';
    })
    builder.addCase(fetchTodos.rejected, (state, action) => {
      state.status = "failed";
      state.todoList = [];
      state.error = action.payload;
    })
    builder.addCase(addToDo.fulfilled, (state, action) => {
      state.todoList.unshift(action.payload);
    })
    builder.addCase(deleteToDo.fulfilled, (state, action) => {
      
      let todoList = state.todoList;
      state.todoList = todoList.filter((item) => item.id !== action.payload);

    })

  }
})

// Action creators are generated for each case reducer function
export const {  editTodo } = toDoSlider.actions

export default toDoSlider.reducer;