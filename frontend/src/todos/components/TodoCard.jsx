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
import toast from 'react-hot-toast'
import { createTodo, updateTodo, deleteTodo, getTodos } from '../../api'
import { TodoDetail } from './TodoDetail'

export const TodoCard = ({ todoList }) => {
  const [todos, setTodos] = useState([])
  const [showAddTask, setShowAddTask] = useState(false)

  useEffect(() => {
    const fetchTodos = async () => {
      const response = await getTodos(todoList.id)
      setTodos(response || [])
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

  const handleUpdateTodo = async (todoId, updateData) => {
    const result = await updateTodo(todoId, updateData)
    if (result) {
      setTodos(todos.map((todo) => (todo.id === todoId ? result : todo)))
    } else {
      toast.error('Error updating todo')
    }
  }

  const handleDeleteTodo = async (todoId) => {
    const response = await deleteTodo(todoId)
    if (response?.ok) {
      setTodos(todos.filter((todo) => todo.id !== todoId))
    } else {
      toast.error('Error deleting todo')
    }
  }

  const handleCreateTodo = async ({ title, detail, dueDate, form }) => {
    const todoData = {
      title,
      text: detail,
      due_date: dueDate,
    }
    const result = await createTodo(todoList.id, todoData)
    if (result) {
      setTodos((prev) => [...prev, { ...result, completed: 0 }])
      setShowAddTask(false)
      form.reset()
    } else {
      toast.error('Error creating todo')
    }
  }

  return (
    <Card
      data-testid='todo-card'
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
                data-testid='progress-bar'
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
          data-testid='add-todo-button'
          onClick={() => {
            setShowAddTask((prev) => !prev)
          }}
          sx={{
            mb: 2,
            textTransform: 'none',
            color: showAddTask ? '#d32f2f' : '#1976d2',
            '&:hover': {
              borderColor: showAddTask ? '#c62828' : '#1565c0',
              backgroundColor: showAddTask
                ? 'rgba(211, 47, 47, 0.04)'
                : 'rgba(25, 118, 210, 0.04)',
            },
          }}
        >
          {showAddTask ? 'Close' : 'Add Todo'}
        </Button>

        {showAddTask && (
          <form
            onSubmit={e => {
              e.preventDefault()
              const formData = new FormData(e.target)
              const title = formData.get('title')?.trim()
              const detail = formData.get('detail')
              const dueDate = formData.get('dueDate')
              if (!title) {
                return toast.error('Title is required')
              }
              handleCreateTodo({ title, detail, dueDate, form: e.target })
            }}
            style={{ marginBottom: 16 }}
          >
            <TextField
              fullWidth
              required
              label='Title'
              name='title'
              variant='outlined'
              size='small'
              data-testid='todo-title-input'
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Detail'
              name='detail'
              variant='outlined'
              size='small'
              multiline
              rows={3}
              data-testid='todo-detail-input'
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label='Due Date'
              name='dueDate'
              type='date'
              variant='outlined'
              size='small'
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& input[type="date"]::-webkit-calendar-picker-indicator': {
                  cursor: 'pointer',
                },
              }}
            />
            <Button type='submit' variant='contained' sx={{ mt: 2 }}>
              Add Task
            </Button>
          </form>
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
