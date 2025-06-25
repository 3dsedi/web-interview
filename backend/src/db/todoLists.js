import { v4 as uuidv4 } from 'uuid'

export function getAllTodoLists(db) {
  try {
    return db.prepare('SELECT * FROM todo_lists').all()
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function getTodoListById(db, id) {
  try {
    return db.prepare('SELECT * FROM todo_lists WHERE id = ?').get(id)
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}
export function createTodoList(db, title) {
  try {
    const id = uuidv4()
    const createdAt = new Date().toISOString()
    db.prepare('INSERT INTO todo_lists (id, title, created_at) VALUES (?, ?, ?)').run(id, title, createdAt)
    return { id, title, created_at: createdAt }
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function deleteTodoList(db, id) {
  try {
    db.prepare('DELETE FROM todos WHERE list_id = ?').run(id)
    const result = db.prepare('DELETE FROM todo_lists WHERE id = ?').run(id)
    return result.changes
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function updateTodoListTitle(db, id, title) {
  try {
    const result = db.prepare('UPDATE todo_lists SET title = ? WHERE id = ?').run(title, id)
    return result.changes
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}
