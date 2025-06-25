/* eslint-env jest */
import request from 'supertest'
import express from 'express'
import todosRouter from '../src/service/todos.js'
import todoListsRouter from '../src/service/todoLists.js'
import { validate as validateUuid } from 'uuid'

const app = express()
app.use(express.json())
app.use('/api/todo-lists', todoListsRouter)
app.use('/api', todosRouter)

describe('Todos API', () => {
  let listId
  let todo1, todo2

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/todo-lists')
      .send({ title: 'List for todos' })
    listId = res.body.id
  })
// POST
  it('Create todo without title should return 400', async () => {
    const res = await request(app)
      .post(`/api/todo-lists/${listId}/todos`)
      .send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('Create todo with non existing list should return 404', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app)
      .post(`/api/todo-lists/${fakeId}/todos`)
      .send({ title: 'Should not work' })
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('Successfully Create two todos for one todo list', async () => {
    const res1 = await request(app)
      .post(`/api/todo-lists/${listId}/todos`)
      .send({ title: 'First todo' })
    expect(res1.statusCode).toBe(201)
    expect(res1.body).toHaveProperty('id')
    expect(res1.body.title).toBe('First todo')
    expect(validateUuid(res1.body.id)).toBe(true)
    todo1 = res1.body

    const res2 = await request(app)
      .post(`/api/todo-lists/${listId}/todos`)
      .send({ title: 'Second todo' })
    expect(res2.statusCode).toBe(201)
    expect(res2.body).toHaveProperty('id')
    expect(res2.body.title).toBe('Second todo')
    expect(validateUuid(res2.body.id)).toBe(true)
    todo2 = res2.body
  })

// GET
  it('Get todos for the created list should return 2 items', async () => {
    const res = await request(app).get(`/api/todo-lists/${listId}/todos`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(2)
    expect(res.body.some(t => t.title === 'First todo')).toBe(true)
    expect(res.body.some(t => t.title === 'Second todo')).toBe(true)
  })

  it('Get todos for non existing list should return 404', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    const res = await request(app).get(`/api/todo-lists/${fakeId}/todos`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

// PATCH
  it('Update todo to completed should set completed_at', async () => {
    const patchRes = await request(app)
      .patch(`/api/todos/${todo1.id}`)
      .send({ completed: 1 })
    expect(patchRes.statusCode).toBe(200)
    expect(patchRes.body.completed).toBe(1)
    expect(patchRes.body.completed_at).toBeTruthy()
  })
// DELETE
  it('Delete todo with invalid UUID should return 400', async () => {
    const res = await request(app)
      .delete(`/api/todos/not-a-uuid`)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })

  it('Delete todo with non existing id should return 404', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    const res = await request(app)
      .delete(`/api/todos/${fakeId}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo not found')
  })

  it('Delete todo with correct id should return 204', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todo1.id}`)
    expect(res.statusCode).toBe(204)
  })

  it('DELETE second todo with correct id should return 204', async () => {
    const res = await request(app)
      .delete(`/api/todos/${todo2.id}`)
    expect(res.statusCode).toBe(204)
  })
})
