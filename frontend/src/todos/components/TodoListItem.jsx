import React, { useState, useEffect } from 'react'
import { Box, Typography, IconButton, TextField } from '@mui/material'
import { Delete as DeleteIcon } from '@mui/icons-material'
import toast from 'react-hot-toast'

export const TodoListItem = ({ title, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(title)

  useEffect(() => {
    setEditTitle(title)
  }, [title])

  const handleSaveEdit = async () => {
    if (!editTitle || !editTitle.trim()) {
      toast.error('Title is required')
      return
    }

       await onEdit(editTitle.trim())
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(title)
  }

  return (
    <Box
      sx={{
        p: 1,
        mb: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        borderRadius: 5,
        '&:hover': {
          borderRadius: 5,
          border: '1px solid #e0e0e0',
          cursor: 'pointer',
          backgroundColor: '#f5f5f5',
          '& .delete-button': {
            opacity: 1,
            visibility: 'visible',
          },
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
        {isEditing ? (
          <TextField
            value={editTitle}
            onChange={(e) => {
              handleSaveEdit(e.target.value)
              setEditTitle(e.target.value)
            }}
            onBlur={()=>setIsEditing(false)}
            autoFocus
            required
            size='small'
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
                fontWeight: 500,
              },
            }}
          />
        ) : (
          <Typography
            variant='body1'
            sx={{
              fontWeight: 500,
              color: 'text.primary',
              cursor: 'pointer',
              flex: 1,
            }}
            onClick={(e) => {
              e.stopPropagation()
              setIsEditing(true)
            }}
          >
            {title}
          </Typography>
        )}
      </Box>
      <IconButton
        className='delete-button'
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        size='small'
        sx={{
          padding: 0.5,
          opacity: 0,
          visibility: 'hidden',
          transition: 'all 0.2s ease',
          color: 'error.main',
          backgroundColor: 'rgba(255, 0, 0, 0.1)',
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <DeleteIcon fontSize='small' />
      </IconButton>
    </Box>
  )
}
