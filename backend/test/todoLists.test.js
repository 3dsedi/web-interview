/* eslint-env jest */
import request from 'supertest'
import express from 'express'
import { validate as validateUuid } from 'uuid'
import todoListsRouter from '../src/routes/todoLists.js'

const app = express()
app.use(express.json())
app.use('/api/todo-lists', todoListsRouter)

describe('TodoLists API', () => {
  let createdId

  // POST
  it('should return 400 when creating todo list with missing title', async () => {
    const res = await request(app).post('/api/todo-lists').send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('should return 201 and create a todo list', async () => {
    const res = await request(app).post('/api/todo-lists').send({ title: 'Test todo list' })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Test todo list')
    expect(validateUuid(res.body.id)).toBe(true)
    createdId = res.body.id
  })

  //GET
  it('should return an array and contain at least one item with title "Test todo list"', async () => {
    const res = await request(app).get('/api/todo-lists')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((item) => item.title === 'Test todo list')).toBe(true)
  })

  // PATCH
  it('should return 400 when updating todo list with empty title', async () => {
    const res = await request(app).patch(`/api/todo-lists/${createdId}`).send({ title: '' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('should return 400 when updating todo list with invalid UUID', async () => {
    const res = await request(app).patch('/api/todo-lists/not-a-uuid').send({ title: 'New Title' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })

  it('should return 404 when updating todo list with non existing id', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app).patch(`/api/todo-lists/${fakeId}`).send({ title: 'New Title' })
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('should return 200 and update title when updating todo list with correct id', async () => {
    const patchRes = await request(app)
      .patch(`/api/todo-lists/${createdId}`)
      .send({ title: 'Updated Title' })
    expect(patchRes.statusCode).toBe(200)
    expect(patchRes.body).toEqual({ id: createdId, title: 'Updated Title' })
  })

  // DELETE
  it('should return 400 when deleting todo list with invalid id', async () => {
    const res = await request(app).delete('/api/todo-lists/not-a-uuid')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })

  it('should return 404 when deleting todo list with non existing id', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app).delete(`/api/todo-lists/${fakeId}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('should return 204 when deleting todo list with correct id', async () => {
    const res = await request(app).delete(`/api/todo-lists/${createdId}`)
    expect(res.statusCode).toBe(204)
  })
})
 