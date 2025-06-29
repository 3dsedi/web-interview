import React, { useState, useEffect, useMemo } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Divider,
  Button,
  TextField,
  Box,
  LinearProgress,
} from '@mui/material'
import { Add, Close, Assignment } from '@mui/icons-material'
import { createTodo, updateTodo, deleteTodo, getTodos } from '../../api'
import { TodoDetail } from './TodoDetail'

export const TodoCard = ({ todoList }) => {
  const [todos, setTodos] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    detail: '',
    dueDate: '',
  })

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await getTodos(todoList.id)
        setTodos(response)
      } catch (error) {
        console.error('Failed to fetch todos:', error)
        setTodos([])
      }
    }
    fetchTodos()
  }, [todoList.id])

  const getProgress = () => {
    if (todos.length === 0) {
      return { completed: 0, total: 0, percentage: 0 }
    }

    const completedCount = todos.filter((todo) => todo.completed === 1).length
    const totalCount = todos.length
    const percentage = (completedCount / totalCount) * 100

    return { completed: completedCount, total: totalCount, percentage }
  }

  const progress = getProgress()

  const sortedTodos = useMemo(() => {
    return [...todos].sort((a, b) => {
      if (a.completed !== b.completed) {
        return a.completed - b.completed
      }

      if (a.completed === 0) {
        if (!a.due_date && !b.due_date) return 0
        if (!a.due_date) return 1 
        if (!b.due_date) return -1 

        const dateA = new Date(a.due_date)
        const dateB = new Date(b.due_date)
        return dateA - dateB
      }
      return 0
    })
  }, [todos])

  const handleTaskChange = (field, value) => {
    const updatedTask = { ...newTask, [field]: value }
    setNewTask(updatedTask)
  }

  const handleCreateTodo = async () => {
    if (newTask.title.trim()) {
      try {
        const todoData = {
          title: newTask.title,
          text: newTask.detail,
          due_date: newTask.dueDate,
        }
        const result = await createTodo(todoList.id, todoData)
        setTodos([...todos, result])
        console.log('Todo created successfully:', result)
        resetForm()
      } catch (error) {
        console.error('Error creating todo:', error)
      }
    }
  }

  const resetForm = () => {
    setNewTask({ title: '', detail: '', dueDate: '' })
    setShowAddTask(false)
  }

  const handleUpdateTodo = async (todoId, updateData) => {
    try {
      const result = await updateTodo(todoId, updateData)
      setTodos(todos.map((todo) => (todo.id === todoId ? result : todo)))
      console.log('Todo updated successfully:', result)
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try {
      await deleteTodo(todoId)
      setTodos(todos.filter((todo) => todo.id !== todoId))
      console.log('Todo deleted successfully')
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  return (
    <Card
      sx={{
        height: 'fit-content',
        minHeight: 200,
        width: 400,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardHeader
        title={
          <Box>
            <Typography variant='h6' sx={{ fontSize: '1.1rem', fontWeight: 600, mb: 1 }}>
              {todoList.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LinearProgress
                variant='determinate'
                value={progress.percentage}
                sx={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: '#f5f5f5',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    backgroundColor: progress.percentage === 100 ? '#4caf50' : '#2196f3',
                  },
                }}
              />
              <Typography
                variant='body2'
                color='text.secondary'
                sx={{ minWidth: '60px', fontSize: '0.875rem' }}
              >
                {progress.completed}/{progress.total}
              </Typography>
            </Box>
            {progress.percentage === 100 && progress.total > 0 && (
              <Typography
                variant='caption'
                color='success.main'
                sx={{ fontWeight: 600, mt: 0.5, display: 'block' }}
              >
                All tasks completed!
              </Typography>
            )}
          </Box>
        }
      />
      <Divider />
      <CardContent
        sx={{
          pt: 2,
          maxHeight: 500,
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: 4,
            opacity: 0,
            transition: 'opacity 0.2s ease',
          },
          '&:hover::-webkit-scrollbar': {
            opacity: 1,
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'transparent',
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c1c1c1',
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#a8a8a8',
          },
        }}
      >
        <Button
          startIcon={showAddTask ? <Close /> : <Add />}
          onClick={() => {
            if (showAddTask && !newTask.title.trim()) {
              resetForm()
            } else if (!showAddTask) {
              setShowAddTask(true)
            }
          }}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: showAddTask && !newTask.title.trim() ? '#d32f2f' : '#1976d2',
            opacity: showAddTask && newTask.title.trim() ? 0 : 1,
            pointerEvents: showAddTask && newTask.title.trim() ? 'none' : 'auto',
            '&:hover': {
              borderColor: showAddTask && !newTask.title.trim() ? '#c62828' : '#1565c0',
              backgroundColor:
                showAddTask && !newTask.title.trim()
                  ? 'rgba(211, 47, 47, 0.04)'
                  : 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          {showAddTask ? 'Close' : 'Add Todo'}
        </Button>

        {showAddTask && (
          <Box
            sx={{ mb: 2 }}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget)) {
                handleCreateTodo()
              }
            }}
          >
            <TextField
              fullWidth
              label='Title'
              variant='outlined'
              size='small'
              value={newTask.title}
              onChange={(e) => handleTaskChange('title', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Detail'
              variant='outlined'
              size='small'
              multiline
              rows={3}
              value={newTask.detail}
              onChange={(e) => handleTaskChange('detail', e.target.value)}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Due Date'
              type='date'
              variant='outlined'
              size='small'
              value={newTask.dueDate}
              onChange={(e) => handleTaskChange('dueDate', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer',
                },
              }}
            />
          </Box>
        )}
        {sortedTodos.map((todo) => (
          <TodoDetail
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
        {todos.length === 0 && !showAddTask && (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              px: 2,
              textAlign: 'center',
            }}
          >
            <Assignment
              sx={{
                fontSize: 48,
                color: 'text.disabled',
                mb: 2,
                opacity: 0.5,
              }}
            />
            <Typography
              variant='body2'
              color='text.secondary'
              sx={{
                fontStyle: 'italic',
                lineHeight: 1.5,
              }}
            >
              Start adding your todos to this list!
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
