import React, { useState, useEffect, useMemo } from 'react'
import { Box } from '@mui/material'
import { Sidebar } from './Sidebar'
import { TodoCard } from './TodoCard'
import { getTodoLists, createTodoList, deleteTodoList, updateTodoList } from '../../api'
import toast from 'react-hot-toast'

export const HomePage = () => {
  const [todoLists, setTodoLists] = useState([])
  const [sortOrder, setSortOrder] = useState('newest')

  const fetchTodoLists = async () => {
    const lists = await getTodoLists()
    setTodoLists(lists ? lists : [])
  }

  const handleCreateTodoList = async (title) => {
    const newTodoList = await createTodoList(title)
    if (newTodoList) {
      setTodoLists((prev) => [...prev, newTodoList])
      toast.success('List created successfully!')
      return newTodoList
    } else {
      toast.error('Failed to create todo list')
      return null
    }
  }

  const handleUpdateTodoList = async (listId, updates) => {
    const updatedList = await updateTodoList(listId, updates)
    if (updatedList) {
      setTodoLists((prev) =>
        prev.map((list) => (list.id === listId ? { ...list, ...updatedList } : list))
      )
      return updatedList
    } else {
      toast.error('Failed to update todo list')
      return null
    }
  }

  const handleDeleteTodoList = async (listId) => {
    const response = await deleteTodoList(listId)
    if (response?.ok) {
      setTodoLists((prev) => prev.filter((list) => list.id !== listId))
      toast.success('List deleted successfully!')
    } else {
      toast.error('Failed to delete todo list')
    }
  }

  useEffect(() => {
    fetchTodoLists()
  }, [])

  const sortedTodoLists = useMemo(() => {
    return [...todoLists].sort((a, b) => {
      const dateA = new Date(a.created_at)
      const dateB = new Date(b.created_at)

      if (sortOrder === 'newest') {
        return dateB - dateA
      } else {
        return dateA - dateB
      }
    })
  }, [todoLists, sortOrder])

  return (
    <Box sx={{ display: 'flex', height: '98vh' }}>
      <Box sx={{ flexShrink: 0 }}>
        <Sidebar
          todoLists={sortedTodoLists}
          onCreateList={handleCreateTodoList}
          onDeleteList={handleDeleteTodoList}
          onEditList={handleUpdateTodoList}
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          gap: 2,
          padding: 2,
          overflowX: 'auto',
          '&::-webkit-scrollbar': {
            height: 8,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: '#f1f1f1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 4,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a8a8a8',
          },
        }}
      >
        {sortedTodoLists.map((item) => (
          <Box key={item.id}>
            <TodoCard todoList={item} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
