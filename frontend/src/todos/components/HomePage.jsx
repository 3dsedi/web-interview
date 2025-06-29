import React, { useState, useEffect, useMemo } from 'react'
import { Box } from '@mui/material'
import { Sidebar } from './Sidebar'
import { TodoCard } from './TodoCard'
import { getTodoLists, createTodoList, deleteTodoList, updateTodoList } from '../../api'
import toast from 'react-hot-toast'

export const HomePage = () => {
  const [todoLists, setTodoLists] = useState([])
  const [selectedListId, setSelectedListId] = useState(null)
  const [sortOrder, setSortOrder] = useState('newest') 

  const fetchTodoLists = async () => {
    try {
      const lists = await getTodoLists()
      setTodoLists(Array.isArray(lists) ? lists : [])
    } catch (error) {
      console.error('Failed to fetch todo lists:', error)
      setTodoLists([])
      toast.error('Failed to fetch todo lists')
    }
  }

  const handleCreateTodoList = async (title) => {
    try {
      const newTodoList = await createTodoList(title)
      setTodoLists((prev) => [...prev, newTodoList])
      toast.success('List created successfully!')
      return newTodoList
    } catch (error) {
      toast.error('Failed to create todo list')
      throw error
    }
  }

  const handleUpdateTodoList = async (listId, updates) => {
    try {
      const updatedList = await updateTodoList(listId, updates)
      setTodoLists((prev) =>
        prev.map((list) => (list.id === listId ? { ...list, ...updatedList } : list))
      )
      return updatedList
    } catch (error) {
      toast.error('Failed to update todo list')
      throw error
    }
  }

  const handleDeleteTodoList = async (listId) => {
    try {
      await deleteTodoList(listId)
      setTodoLists((prev) => prev.filter((list) => list.id !== listId))
      if (selectedListId === listId) {
        setSelectedListId(null)
      }
      toast.success('List deleted successfully!')
    } catch (error) {
      toast.error('Failed to delete todo list')
      throw error
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
          selectedListId={selectedListId}
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
