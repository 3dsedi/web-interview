import { v4 as uuidv4 } from 'uuid'

export function getTodosByListId(db, listId) {
  try {
    return db.prepare('SELECT * FROM todos WHERE list_id = ?').all(listId)
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function createTodo(db, listId, title, text, due_date) {
  try {
    const id = uuidv4()
    const createdAt = new Date().toISOString()
    db.prepare(
      'INSERT INTO todos (id, list_id, title, text, completed, due_date, created_at) VALUES (?, ?, ?,?, 0, ?,?)'
    ).run(id, listId, title, text !== undefined ? text : null, due_date || null, createdAt)
    return { id, list_id: listId, title, text: text !== undefined ? text : null, completed: 0, due_date: due_date || null }
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function updateTodo(db, id, { title, text, completed, due_date }) {
  try {
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id)
    if (!todo) return null
    let completed_at = todo.completed_at
    if (completed !== undefined && completed !== todo.completed) {
      completed_at = completed ? new Date().toISOString() : null
    }
    db.prepare(
      'UPDATE todos SET title = ?, text = ?, completed = ?, completed_at = ?, due_date = ? WHERE id = ?'
    ).run(
      title !== undefined ? title : todo.title,
      text !== undefined ? text : todo.text,
      completed !== undefined ? completed : todo.completed,
      completed_at,
      due_date !== undefined ? due_date : todo.due_date,
      id
    )
    return {
      id,
      list_id: todo.list_id,
      title: title !== undefined ? title : todo.title,
      text: text !== undefined ? text : todo.text,
      completed: completed !== undefined ? completed : todo.completed,
      completed_at,
      due_date: due_date !== undefined ? due_date : todo.due_date,
    }
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}

export function deleteTodo(db, id) {
  try {
    const result = db.prepare('DELETE FROM todos WHERE id = ?').run(id)
    return result.changes
  } catch (err) {
    console.error('DB error:', err)
    return null
  }
}
