import React, { useState, useEffect } from 'react';
import { AiFillEdit, AiOutlineCloseCircle } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { deleteToDo, editTodo, fetchTodos } from '../redux/features/toDoSlice';

const ListTodo = () => {
  
  const  todoList = useSelector((state) => state.toDo.todoList);
  const todoError = useSelector((state) => state.toDo.error);
  console.log("todoList::::",todoList)
  console.log("todoError::::",todoError)
  const todoStatus  = useSelector((state) => state.toDo.status);

  const dispatch = useDispatch();
  const [ isEditing, setEditing ] = useState(false); 
  const [ state, setState ] = useState({
    id: '',
    content: '',
    contentError: null
  });

   useEffect(() => {
    if(todoStatus =="idle"){
    dispatch(fetchTodos());
    }
    
  }, [todoStatus])

  const onEditToggle = ( id, content) => {
      setEditing(true);
      setState({
          ...state, id, content
      })
  }

  const handleChange = (e) =>{
    setState({...state, [e.target.name]: e.target.value, [`${e.target.name}Error`]: null });
  }

  const { content, contentError, id } = state;

  const edit = () =>{
    if(content === ''){
        setState({...state, contentError: 'You must write something!'});
        return;
    }
    dispatch((editTodo({content, id})));
    setEditing(false);
 }

  let renderedData;
  if( todoStatus == "loading"){
    renderedData = <p style={{color: "black"}}>Loading...</p>;
  }else if (todoStatus == "failed") {
    renderedData = <p style={{color: "black"}}>Erorr Message : {todoError}</p>
  }else if (todoStatus == "succeeded") {
    renderedData = todoList.map(({id, content})=> {
      return <li className='grid' key={id}>
          <span className='content'>{content}</span>
          <span className='todo-action'>
            <AiOutlineCloseCircle className="close" onClick={() => dispatch(deleteToDo({id}))}/>
            <AiFillEdit className="edit" onClick={() =>onEditToggle(id, content)} />
          </span>
      </li>
  }) ;
  }
  return <div>
      {
          isEditing ?
            <div className='form'>
                <h2>Update your plan for today</h2>
                <input type='text' value={content} name='content' onChange={handleChange}></input>
                <button type='button' className='button' onClick={edit}>Edit</button>
                {contentError ? <div className='error'>{contentError}</div>: null}
            </div>
      :
      <ul className='todos'>
          {
            renderedData
          }
      </ul>}
  </div>;
};

export default ListTodo;
