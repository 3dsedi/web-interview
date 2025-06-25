import express from 'express'
import db from '../db/db.js'
import { getTodosByListId, createTodo, updateTodo, deleteTodo } from '../db/todos.js'
import { getTodoListById } from '../db/todoLists.js'
import { validate } from 'uuid'

const router = express.Router()

router.get('/todo-lists/:listId/todos', (req, res) => {
  try {
    const { listId } = req.params
    if (!validate(listId)) return res.status(400).json({ error: 'Invalid ID format' })

    const todos = getTodosByListId(db, listId)
    if (todos === null) return res.status(500).json({ error: 'Database error' })
    res.json(todos)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/todo-lists/:listId/todos', (req, res) => {
  try {
    const { listId } = req.params
    if (!validate(listId)) return res.status(400).json({ error: 'Invalid ID format' })

    const list = getTodoListById(db, listId)
    if (!list) return res.status(404).json({ error: 'Todo list not found' })

    const {title, text, due_date } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })

    const result = createTodo(db, listId, title, text, due_date)
    if (result === null) return res.status(500).json({ error: 'Database error' })
    res.status(201).json(result)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/todos/:id', (req, res) => {
  try {
    const { id } = req.params
    if (!validate(id)) return res.status(400).json({ error: 'Invalid ID format' })

    const {title, text, completed, due_date } = req.body
    const result = updateTodo(db, id, {title, text, completed, due_date })
    if (result === null) return res.status(404).json({ error: 'Todo id not found' })
    res.json(result)
  
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/todos/:id', (req, res) => {
  try {
    const { id } = req.params
    if (!validate(id)) return res.status(400).json({ error: 'Invalid ID format' })
    const changes = deleteTodo(db, id)
    if (changes === null) return res.status(500).json({ error: 'Database error' })
    if (changes === 0) return res.status(404).json({ error: 'Todo not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
