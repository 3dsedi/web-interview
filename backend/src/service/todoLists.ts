import express from 'express'
import db from '../db/db.js'
import {
  getAllTodoLists,
  createTodoList,
  deleteTodoList,
  updateTodoListTitle,
} from '../db/todoLists.ts'
import { validate } from 'uuid'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const lists = getAllTodoLists(db)
    res.json(lists)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/', (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const result = createTodoList(db, title)
    res.status(201).json(result)
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.delete('/:id', (req, res) => {
  try {
    const id = req.params.id
    if (!validate(id)) return res.status(400).json({ error: 'Invalid ID format' })
    const changes = deleteTodoList(db, id)
    if (changes === 0) return res.status(404).json({ error: 'List not found' })
    res.status(204).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/:id', (req, res) => {
  try {
    const id = req.params.id
    if (!validate(id)) return res.status(400).json({ error: 'Invalid ID format' })
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const changes = updateTodoListTitle(db, id, title)
    if (changes === 0) return res.status(404).json({ error: 'List not found' })
    res.json({ id, title })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
