import { v4 as uuidv4 } from 'uuid'

export function getTodosByListId(db, listId) {
  return db.prepare('SELECT * FROM todos WHERE list_id = ?').all(listId)
}

export function getTodoById(db, id) {
  return db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
}

export function createTodo(db, listId, title, text = '', due_date = null) {
  const id = uuidv4()
  const createdAt = new Date().toISOString()
  db.prepare(
    'INSERT INTO todos (id, list_id, title, text, due_date, created_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, listId, title, text, due_date, createdAt)
  return { id, list_id: listId, title, text, due_date, created_at: createdAt }
}

export function updateTodo(db, id, { title, text, completed, due_date }) {
  const todo = getTodoById(db, id)
  if (!todo) return null

  let completed_at = todo.completed_at
  if (completed !== undefined && completed === 1 && todo.completed === 0) {
    completed_at = new Date().toISOString()
  }

  const result = db
    .prepare(
      'UPDATE todos SET title = ?, text = ?, completed = ?, completed_at = ?, due_date = ? WHERE id = ?'
    )
    .run(
      title !== undefined ? title : todo.title,
      text !== undefined ? text : todo.text,
      completed !== undefined ? completed : todo.completed,
      completed_at,
      due_date !== undefined ? due_date : todo.due_date,
      id
    )

  return result.changes
}

export function deleteTodo(db, id) {
  const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
  return result.changes
}
