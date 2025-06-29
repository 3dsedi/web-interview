import { getTodosByListId, getTodoById, createTodo, updateTodo, deleteTodo } from '../db/todos.js'
import db from '../db/db.js'
import { getTodoListById } from '../db/todoLists.js'

export function getTodosByListIdService(listId) {
  const list = getTodoListById(db, listId)
  if (!list) {
    throw new Error('Todo list not found')
  }
  const todos = getTodosByListId(db, listId)
  return todos
}

export function getTodoByIdService(id) {
  const todo = getTodoById(db, id)
  if (!todo) {
    throw new Error('Todo not found')
  }
  return todo
}

export function createTodoService(listId, title, text, due_date) {
  const todoList = getTodoListById(db, listId)
  if (!todoList) {
    throw new Error('Todo list not found')
  }
  const result = createTodo(db, listId, title, text, due_date)
  if (!result) {
    throw new Error('Failed to create todo')
  }
  return result
}

export function updateTodoService(id, data) {
  const changes = updateTodo(db, id, data)
  if (changes === 0) {
    throw new Error('Todo not found')
  }
  return getTodoByIdService(id)
}

export function deleteTodoService(id) {
  const changes = deleteTodo(db, id)
  if (changes === 0) {
    throw new Error('Todo not found')
  }
  return changes
}
