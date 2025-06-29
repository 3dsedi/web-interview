import React, { useState, useRef, useCallback } from 'react'
import {
  Box,
  Typography,
  Checkbox,
  IconButton,
  TextField,
  Menu,
  MenuItem,
  Chip,
} from '@mui/material'
import { MoreVert, Edit, Delete } from '@mui/icons-material'

export const TodoDetail = ({ todo, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false)
  const [completed, setCompleted] = useState(todo.completed)
  const [anchorEl, setAnchorEl] = useState(null)
  const [editData, setEditData] = useState({
    title: todo.title,
    text: todo.text || '',
    due_date: todo.due_date || ''
  })
  const containerRef = useRef(null)
  const open = Boolean(anchorEl)

  const handleMenuClick = (event) => {
    event.stopPropagation()
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleEditTodo = () => {
    setEditing(true)
    handleMenuClose()
  }

  const handleDeleteTodo = () => {
    console.log('Deleting todo with ID:', todo.id)
    onDelete(todo.id)
    handleMenuClose()
  }

  const handleSave = useCallback(() => {
    onUpdate(todo.id, editData)
    setEditing(false)
  }, [todo.id, editData, onUpdate])

  const handleBlur = (event) => {
    if (editing && !containerRef.current?.contains(event.relatedTarget)) {
      handleSave()
    }
  }

  const handleCancel = () => {
    setEditData({
      title: todo.title,
      text: todo.text || '',
      due_date: todo.due_date || ''
    })
    setEditing(false)
  }

  const handleCompletedChange = (isCompleted) => {
    setCompleted(isCompleted)
    onUpdate(todo.id, { 
      completed: isCompleted ? 1 : 0
    })
  }

  const handleChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const getDueDateChip = () => {
    if (completed && todo.completed_at) {
      const completedDate = new Date(todo.completed_at).toLocaleDateString()
      return {
        label: `Completed ${completedDate}`,
        color: '#e8f5e8', 
        textColor: '#2e7d32'
      }
    }

    if (!todo.due_date) return null

    const today = new Date()
    const dueDate = new Date(todo.due_date)
    const diffTime = dueDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays > 3) {
      return {
        label: `${diffDays} days left`,
        color: '#e8f5e8', 
        textColor: '#2e7d32'
      }
    } else if (diffDays >= 0) {
      return {
        label: diffDays === 0 ? 'Due today' : `${diffDays} days left`,
        color: '#fff8e1', 
        textColor: '#f57c00'
      }
    } else {
      return {
        label: `${Math.abs(diffDays)} days overdue`,
        color: '#ffebee', 
        textColor: '#d32f2f'
      }
    }
  }

  const dueDateChip = getDueDateChip()

  return (
    <Box
      ref={containerRef}
      onBlur={handleBlur}
      sx={{
        borderRadius: 5,
        mb: 1,
        p: 1,
        cursor: editing ? 'default' : 'pointer',
        '&:hover': {
          backgroundColor: editing ? 'transparent' : '#f5f5f5',
        },
      }}
      onClick={() => !editing && setEditing(true)}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', flex: 1 }}>
          <Box onClick={(e) => e.stopPropagation()}>
            <Checkbox
              checked={completed}
              onChange={(e) => {
                e.stopPropagation()
                handleCompletedChange(e.target.checked)
              }}
              sx={{ p: 0, mt: 0.25, mr: 1 }}
              size="small"
            />
          </Box>
          
          <Box sx={{ flex: 1 }}>
            {editing ? (
              <>
                <TextField
                  value={editData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSave()
                    if (e.key === 'Escape') handleCancel()
                  }}
                  variant="standard"
                  size="small"
                  sx={{ mb: 1, width: '100%' }}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
                <TextField
                  fullWidth
                  label="Detail"
                  value={editData.text}
                  onChange={(e) => handleChange('text', e.target.value)}
                  multiline
                  rows={2}
                  variant="standard"
                  size="small"
                  sx={{ mb: 1 }}
                  onClick={(e) => e.stopPropagation()}
                />
                <TextField
                  fullWidth
                  label="Due Date"
                  type="date"
                  value={editData.due_date}
                  onChange={(e) => handleChange('due_date', e.target.value)}
                  variant="standard"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  onClick={(e) => e.stopPropagation()}
                />
              </>
            ) : (
              <>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    textDecoration: completed ? 'line-through' : 'none',
                    color: completed ? 'text.secondary' : 'text.primary',
                    mb: todo.text || todo.due_date ? 0.5 : 0,
                  }}
                >
                  {todo.title}
                </Typography>
                {todo.text && (
                  <Typography 
                    variant="caption" 
                    color="text.secondary" 
                    sx={{ display: 'block', mb: dueDateChip ? 0.5 : 0 }}
                  >
                    {todo.text}
                  </Typography>
                )}
                {dueDateChip && (
                  <Chip
                    label={dueDateChip.label}
                    size="small"
                    sx={{
                      backgroundColor: dueDateChip.color,
                      color: dueDateChip.textColor,
                      fontSize: '0.7rem',
                      height: 20,
                      '& .MuiChip-label': {
                        px: 1
                      }
                    }}
                  />
                )}
              </>
            )}
          </Box>
        </Box>

        {!editing && (
          <Box onClick={(e) => e.stopPropagation()}>
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{ ml: 1, mt: -0.5 }}
            >
              <MoreVert fontSize="small" />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              onClick={(e) => e.stopPropagation()}
            >
              <MenuItem onClick={handleEditTodo}>
                <Edit sx={{ mr: 1 }} fontSize="small" />
                Edit
              </MenuItem>
              <MenuItem onClick={handleDeleteTodo} sx={{ color: 'error.main' }}>
                <Delete sx={{ mr: 1 }} fontSize="small" />
                Delete
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  )
}
