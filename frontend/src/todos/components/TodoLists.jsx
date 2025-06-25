import React, { Fragment, useState, useEffect, useRef } from 'react'
import {
  Card,
  CardContent,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from '@mui/material'
import ReceiptIcon from '@mui/icons-material/Receipt'
import { TodoListForm } from './TodoListForm'

// Simulate network
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// const fetchTodoLists = () => {
//   return sleep(1000).then(() =>
//     Promise.resolve({
//       '0000000001': {
//         id: '0000000001',
//         title: 'First List',
//         todos: ['First todo of first list!'],
//       },
//       '0000000002': {
//         id: '0000000002',
//         title: 'Second List',
//         todos: ['First todo of second list!'],
//       },
//     })
//   )
// }
const Be = 'http://localhost:3001'
const fetchTodoLists = async () => {
  const response = await fetch(`${Be}/api/todo-lists`)
  if (!response.ok) throw new Error('Failed to fetch todo lists')
  console.log(response)
  const lists = await response.json()
  return lists.reduce((acc, list) => {
    acc[list.id] = { ...list, todos: list.todos || [] }
    return acc
  }, {})
}

const postTodoList = async (title) => {
  const response = await fetch(`${Be}/api/todo-lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  })
  if (!response.ok) throw new Error('Failed to create todo list')
  return response.json()
}

export const TodoLists = ({ style }) => {
  const [todoLists, setTodoLists] = useState({})
  const [activeList, setActiveList] = useState()
  const [newTitle, setNewTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    fetchTodoLists().then(setTodoLists)
  }, [])

  const handleAddList = async (e) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    try {
      const newList = await postTodoList(newTitle)
      setTodoLists((prev) => ({
        ...prev,
        [newList.id]: { ...newList, todos: [] },
      }))
      setNewTitle('')
      inputRef.current?.focus()
    } catch (err) {
      alert('Failed to add list')
    }
  }

  if (!Object.keys(todoLists).length) return null
  return (
    <Fragment>
      <Card style={style}>
        <CardContent>
          <Typography component='h2'>My Todo Lists</Typography>
          <form onSubmit={handleAddList} style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
            <input
              ref={inputRef}
              type='text'
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder='New list title'
              style={{ flex: 1, padding: 4 }}
            />
            <button type='submit'>Add</button>
          </form>
          <List>
            {Object.keys(todoLists).map((key) => (
              <ListItemButton key={key} onClick={() => setActiveList(key)}>
                <ListItemIcon>
                  <ReceiptIcon />
                </ListItemIcon>
                <ListItemText primary={todoLists[key].title} />
              </ListItemButton>
            ))}
          </List>
        </CardContent>
      </Card>
      {todoLists[activeList] && (
        <TodoListForm
          key={activeList} // use key to make React recreate component to reset internal state
          todoList={todoLists[activeList]}
          saveTodoList={(id, { todos }) => {
            const listToUpdate = todoLists[id]
            setTodoLists({
              ...todoLists,
              [id]: { ...listToUpdate, todos },
            })
          }}
        />
      )}
    </Fragment>
  )
}
