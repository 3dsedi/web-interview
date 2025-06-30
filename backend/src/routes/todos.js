import express from 'express'
import {
  getTodosByListIdService,
  createTodoService,
  updateTodoService,
  deleteTodoService,
  getTodoByIdService,
} from '../service/todos.js'
import { validate as validateUUID } from 'uuid'

const router = express.Router()

router.get('/todo-lists/:listId/todos', (req, res) => {
  const { listId } = req.params
  if (!validateUUID(listId)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  try {
    const todos = getTodosByListIdService(listId)
    res.json(todos)
  } catch (err) {
    console.error(err)
    if (err.message === 'Todo list not found') {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

router.get('/todos/:id', (req, res) => {
  const { id } = req.params
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  try {
    const todo = getTodoByIdService(id)
    res.json(todo)
  } catch (err) {
    console.error(err)
    if (err.message === 'Todo not found') {
      return res.status(404).json({ error: err.message })
    }
    res.status(500).json({ error: err.message })
  }
})

router.post('/todo-lists/:listId/todos', (req, res) => {
  const { listId } = req.params
  if (!validateUUID(listId)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  const { title, text, due_date } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  try {
    const result = createTodoService(listId, title, text, due_date)
    res.status(201).json(result)
  } catch (err) {
    if (err.message === 'Todo list not found') {
      return res.status(404).json({ error: err.message })
    }
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.patch('/todos/:id', (req, res) => {
  const { id } = req.params
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  const { title, text, completed, due_date } = req.body
  try {
    const updated = updateTodoService(id, { title, text, completed, due_date })
    res.json(updated)
  } catch (err) {
    if (err.message === 'Todo not found') {
      return res.status(404).json({ error: err.message })
    }
    console.error(err)
    res.status(500).json({ error: err.message })
  }
})

router.delete('/todos/:id', (req, res) => {
  const { id } = req.params
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  try {
    deleteTodoService(id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    if (err.message === 'Todo not found') {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

export default router
