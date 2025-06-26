import { getAllTodoLists, createTodoList, deleteTodoList, updateTodoListTitle, getTodoListById } from '../db/todoLists.js'
import db from '../db/db.js'


export function getAllTodoListsService() {
  const lists = getAllTodoLists(db)
  if (!lists || lists.length === 0) {
    throw new Error('No todo lists found')
  }
  return lists
}

export function getTodoListByIdService(id) {
  const todoList = getTodoListById(db, id)
  if (!todoList) {
    throw new Error('Todo list not found')
  }
  return todoList
}

export function createTodoListService(title) {
  const result = createTodoList(db, title)
  if (!result) {
    throw new Error('Failed to create todo list')
  }
  return result
}

export function deleteTodoListService(id) {
  const changes = deleteTodoList(db, id)
  if (changes === 0) {
    throw new Error('Todo list not found')
  }
  return changes
}

export function updateTodoListTitleService(id, title) {
  const changes = updateTodoListTitle(db, id, title)
  if (changes === 0) {
    throw new Error('Todo list not found')
  }
  return getTodoListByIdService(id)
}


