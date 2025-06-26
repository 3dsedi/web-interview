/* eslint-env jest */
import request from 'supertest'
import express from 'express'
import todosRouter from '../src/routes/todos.js'
import todoListsRouter from '../src/routes/todoLists.js'
import { validate as validateUuid } from 'uuid'

const app = express()
app.use(express.json())
app.use('/api/todo-lists', todoListsRouter)
app.use('/api', todosRouter)

describe('Todos API', () => {
  let listId
  let todo1, todo2

  beforeAll(async () => {
    const res = await request(app).post('/api/todo-lists').send({ title: 'List for todos' })
    listId = res.body.id
  })
  // POST
  it('should return 400 when creating todo with missing title', async () => {
    const res = await request(app).post(`/api/todo-lists/${listId}/todos`).send({})
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Title is required')
  })

  it('should return 404 when creating todo in non existing list', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    expect(validateUuid(fakeId)).toBe(true)
    const res = await request(app)
      .post(`/api/todo-lists/${fakeId}/todos`)
      .send({ title: 'Should not work' })
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })

  it('should return 201 and create two todos for one todo list', async () => {
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

  const fakeId = '123e4567-e89b-12d3-a456-426614174000'
  // GET
  it('should return 404 when getting todos for non existing todo list', async () => {
    const res = await request(app).get(`/api/todo-lists/${fakeId}/todos`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo list not found')
  })
  it('should return 2 items when getting todos for created todo list', async () => {
    const res = await request(app).get(`/api/todo-lists/${listId}/todos`)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    expect(res.body.length).toBe(2)
    expect(res.body.some((t) => t.title === 'First todo')).toBe(true)
    expect(res.body.some((t) => t.title === 'Second todo')).toBe(true)
  })
  it('should return 404 when getting non existing todo by id', async () => {
    const res = await request(app).get(`/api/todos/${fakeId}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo not found')
  })
  it('should return todo info when getting valid todo by id', async () => {
    const res = await request(app).get(`/api/todos/${todo1.id}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe('First todo')
  })

  // PATCH
  it('should return 200 and set completed_at when updating todo to completed', async () => {
    const patchRes = await request(app).patch(`/api/todos/${todo1.id}`).send({ completed: 1 })
    expect(patchRes.statusCode).toBe(200)
    expect(patchRes.body.completed).toBe(1)
    expect(patchRes.body.completed_at).toBeTruthy()
  })
  it('should return 400 when deleting todo with invalid UUID', async () => {
    const res = await request(app).delete(`/api/todos/not-a-uuid`)
    expect(res.statusCode).toBe(400)
    expect(res.body.error).toBe('Invalid ID format')
  })
  it('should return 404 when deleting todo with non existing id', async () => {
    const fakeId = '123e4567-e89b-12d3-a456-426614174000'
    const res = await request(app).delete(`/api/todos/${fakeId}`)
    expect(res.statusCode).toBe(404)
    expect(res.body.error).toBe('Todo not found')
  })
  it('should return 204 when deleting todo with correct id', async () => {
    const res = await request(app).delete(`/api/todos/${todo1.id}`)
    expect(res.statusCode).toBe(204)
  })
  it('should delete all todos for a list when list is deleting', async () => {
    const res = await request(app).delete(`/api/todo-lists/${listId}`)
    expect(res.statusCode).toBe(204)
    const todoRes = await request(app).get(`/api/todos/${todo2.id}`)
    expect(todoRes.statusCode).toBe(404)
    expect(todoRes.body.error).toBe('Todo not found')
  })
})
