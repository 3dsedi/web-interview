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
  it('Create without title should return 400', async () => {
    const res = await request(app).post('/api/todo-lists').send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('Successfully create a list', async () => {
    const res = await request(app).post('/api/todo-lists').send({ title: 'Test todo list' })
    expect(res.statusCode).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.title).toBe('Test todo list')
    expect(validateUuid(res.body.id)).toBe(true)
    createdId = res.body.id
  })

  //GET
  it('Get should return an array and contain at least one item with title "Test todo list"', async () => {
    const res = await request(app).get('/api/todo-lists')
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.some((item) => item.title === 'Test todo list')).toBe(true)
  })

  // PATCH
  it('Update Todo list with empty title should return 400', async () => {
    const res = await request(app).patch(`/api/todo-lists/${createdId}`).send({ title: '' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('Update with invalid UUID should return 400', async () => {
    const res = await request(app).patch('/api/todo-lists/not-a-uuid').send({ title: 'New Title' })
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })

  it('Update with non existing id should return 404', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app).patch(`/api/todo-lists/${fakeId}`).send({ title: 'New Title' })
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('Update with correct id should update title', async () => {
    const patchRes = await request(app)
      .patch(`/api/todo-lists/${createdId}`)
      .send({ title: 'Updated Title' })
    expect(patchRes.statusCode).toBe(200)
    expect(patchRes.body).toEqual({ id: createdId, title: 'Updated Title' })
  })

  // DELETE
  it('Delete with invalid id should return 400', async () => {
    const res = await request(app).delete('/api/todo-lists/not-a-uuid')
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })

  it('Delete with non existing id should return 404', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app).delete(`/api/todo-lists/${fakeId}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('Delete with correct id should return 204', async () => {
    const res = await request(app).delete(`/api/todo-lists/${createdId}`)
    expect(res.statusCode).toBe(204)
  })
})
