const BASE_URL = 'http://localhost:3001/api'

// Todo Lists
export const getTodoLists = async () => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to get todo lists: ${error}`)
    throw error
  }
}

export const createTodoList = async (title) => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    return await response.json()
  } catch (error) {
    console.error(`Failed to create todo list: ${error}`)
    throw error
  }
}

export const updateTodoList = async (id, title) => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    })
    return await response.json()
  } catch (error) {
    console.error(`Failed to update todo list: ${error}`)
    throw error
  }
}

export const deleteTodoList = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists/${id}`, { method: 'DELETE' })
    return response
  } catch (error) {
    console.error(`Failed to delete todo list: ${error}`)
    throw error
  }
}

// Todos
export const getTodos = async (listId) => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists/${listId}/todos`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to get todos: ${error}`)
    throw error
  }
}

export const getTodo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/todos/${id}`)
    return await response.json()
  } catch (error) {
    console.error(`Failed to get todo: ${error}`)
    throw error
  }
}

export const createTodo = async (listId, todoData) => {
  try {
    const response = await fetch(`${BASE_URL}/todo-lists/${listId}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    })
    return await response.json()
  } catch (error) {
    console.error(`Failed to create todo: ${error}`)
    throw error
  }
}

export const updateTodo = async (id, todoData) => {
  try {
    const response = await fetch(`${BASE_URL}/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todoData),
    })
    return await response.json()
  } catch (error) {
    console.error(`Failed to update todo: ${error}`)
    throw error
  }
}

export const deleteTodo = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' })
    return response
  } catch (error) {
    console.error(`Failed to delete todo: ${error}`)
    throw error
  }
}