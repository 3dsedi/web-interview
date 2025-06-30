import express from 'express'
import {
  getAllTodoListsService,
  createTodoListService,
  deleteTodoListService,
  updateTodoListTitleService,
} from '../service/todoLists.js'
import { validate as validateUUID } from 'uuid'

const router = express.Router()

router.get('/', (req, res) => {
  try {
    const lists = getAllTodoListsService()
    res.json(lists)
  } catch (err) {
    console.error(err)
    if (err.message === 'No todo lists found') {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

router.post('/', (req, res) => {
  try {
    const { title } = req.body
    if (!title) return res.status(400).json({ error: 'Title is required' })
    const result = createTodoListService(title)
    res.status(201).json(result)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
}
})

router.delete('/:id', (req, res) => {
  const { id } = req.params
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  try {
    deleteTodoListService(id)
    res.status(204).end()
  } catch (err) {
    console.error(err)
    if (err.message === 'Todo list not found') {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

router.patch('/:id', (req, res) => {
  const { id } = req.params
  if (!validateUUID(id)) {
    return res.status(400).json({ error: 'Invalid ID format' })
  }
  const { title } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })
  try {
    const updated = updateTodoListTitleService(id, title)
    res.json({ id: updated.id, title: updated.title })
  } catch (err) {
    console.error(err)
    if (err.message === 'Todo list not found') {
      res.status(404).json({ error: err.message })
    } else {
      res.status(500).json({ error: err.message })
    }
  }
})

export default router
