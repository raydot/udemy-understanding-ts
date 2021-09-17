// Boy is this a lot of typing!
// If only there were another way!
// RequestHandler to the rescue!

// import {Request, Response, NextFunction} from 'express'

// export const createTodo = (req, res, next) => {}

import { EINPROGRESS } from 'constants';
import { RequestHandler } from 'express';

import { Todo } from '../models/todo';

// Or database, etc...
const TODOS: Todo[] = [];

export const createTodo: RequestHandler = (req, res, next) => {
  const text = (req.body as { text: string }).text;
  //   console.log('req.body', req.body);
  //   console.log('TEXT:', text);
  const newTodo = new Todo(Math.random().toString(), text);

  TODOS.push(newTodo);

  res.status(201).json({ message: 'Created the todo.', createdTodo: newTodo });
};

export const getTodos: RequestHandler = (req, res, next) => {
  res.json({ todos: TODOS });
};

export const updateTodo: RequestHandler<{ id: string }> = (req, res, next) => {
  const todoId = req.params.id;

  const updatedText = (req.body as { text: string }).text;

  const todoIndex = TODOS.findIndex((todo) => todo.id === todoId);

  if (todoIndex < 0) {
    throw new Error('Could not find todo!');
  }

  TODOS[todoIndex] = new Todo(TODOS[todoIndex].id, updatedText);

  res.json({ message: 'Updated', updatedTodo: TODOS[todoIndex] });
};

export const deleteTodo: RequestHandler = (req, res, next) => {
  const todoId = req.params.id;

  const todoIndex = TODOS.findIndex((todo) => todo.id === todoId);

  if (todoIndex < 0) {
    throw new Error('Count not find that todo!');
  }

  TODOS.splice(todoIndex, 1);

  res.json({ message: `Todo ${todoId} deleted!` });
};
