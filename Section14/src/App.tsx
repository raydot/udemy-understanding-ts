import React, { useState } from 'react';

import TodoList from './components/TodoList';
import NewTodo from './components/NewTodo';
import { Todo } from './todo.model';

// React.FC declares this as a normal React component
// It must return JSX or it's not valid.  There seems to
// be considerable doubt over whether or not this is
// a best practice though, and the original template
// from CRA did not include it.
// https://github.com/facebook/create-react-app/pull/8177

const App: React.FC = () => {
  //const todos = [{ id: 't1', text: 'Finish the course' }];
  // Let's manage some state!

  // Bit wordy, let's use a model instead
  //const [todos, setTodos] = useState<{ id: string; text: string }[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);

  const todoAddHandler = (text: string) => {
    // We can do this
    // setTodos([...todos, { id: Math.random().toString(), text: text }]);
    // But react allows this:
    setTodos((prevTodos) => [
      ...prevTodos,
      { id: Math.random().toString(), text: text },
    ]);
    //console.log(text);
  };

  const todoDeleteHandler = (todoId: string) => {
    setTodos((prevTodos) => {
      return prevTodos.filter((todo) => todo.id !== todoId);
    });
  };

  return (
    <div className='App'>
      <h1>Hey hey hey</h1>
      {/* Pass pointer to todoAddHandler  */}
      <NewTodo onAddTodo={todoAddHandler} />
      <TodoList items={todos} onDeleteTodo={todoDeleteHandler} />
    </div>
  );
};

export default App;
