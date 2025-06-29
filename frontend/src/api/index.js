const BASE_URL = 'http://localhost:3001/api'

// Todo Lists
export const getTodoLists = () => fetch(`${BASE_URL}/todo-lists`).then((res) => res.json())

export const createTodoList = (title) =>
  fetch(`${BASE_URL}/todo-lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then((res) => res.json())

export const updateTodoList = (id, title) =>
  fetch(`${BASE_URL}/todo-lists/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  }).then((res) => res.json())

export const deleteTodoList = (id) => fetch(`${BASE_URL}/todo-lists/${id}`, { method: 'DELETE' })

// Todos
export const getTodos = (listId) =>
  fetch(`${BASE_URL}/todo-lists/${listId}/todos`).then((res) => res.json())

export const getTodo = (id) => fetch(`${BASE_URL}/todos/${id}`).then((res) => res.json())

export const createTodo = (listId, todoData) =>
  fetch(`${BASE_URL}/todo-lists/${listId}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData),
  }).then((res) => res.json())

export const updateTodo = (id, todoData) =>
  fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todoData),
  }).then((res) => res.json())

export const deleteTodo = (id) => fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' })
