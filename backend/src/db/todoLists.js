import { v4 as uuidv4 } from 'uuid'

export function getAllTodoLists(db) {
  return db.prepare('SELECT * FROM todo_lists').all()
}

export function getTodoListById(db, id) {
  return db.prepare('SELECT * FROM todo_lists WHERE id = ?').get(id)
}

export function createTodoList(db, title) {
  const id = uuidv4()
  const createdAt = new Date().toISOString()
  db.prepare('INSERT INTO todo_lists (id, title, created_at) VALUES (?, ?, ?)').run(
    id,
    title,
    createdAt
  )
  return { id, title, created_at: createdAt }
}

export function deleteTodoList(db, id) {
  const result = db.prepare('DELETE FROM todo_lists WHERE id = ?').run(id)
  return result.changes
}

export function updateTodoListTitle(db, id, title) {
  const result = db.prepare('UPDATE todo_lists SET title = ? WHERE id = ?').run(title, id)
  return result.changes
}
