import React, { useState } from 'react'
import {
  Drawer,
  Typography,
  Box,
  Toolbar,
  TextField,
  Button,
  Divider,
  Modal,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { Add as AddIcon, Assignment as TodoIcon } from '@mui/icons-material'
import toast from 'react-hot-toast'
import { TodoListItem } from './TodoListItem'

const DRAWER_WIDTH = 280

export const Sidebar = ({
  todoLists ,
  onCreateList,
  onDeleteList,
  onEditList,
  sortOrder,
  onSortChange
}) => {
  const [openModal, setOpenModal] = useState(false)
  const [newListTitle, setNewListTitle] = useState('')

  const handleCreateTodoList = async () => {
    try {
      await onCreateList(newListTitle)
      setNewListTitle('')
      setOpenModal(false)
    } catch (error) {
      toast.error('Failed to create todo list')
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setNewListTitle('')
  }

  return (
    <Grid container>
      <Drawer
        variant='persistent'
        open={true}
        sx={{
          width: DRAWER_WIDTH,
          maxWidth: DRAWER_WIDTH,
          overflowX: 'hidden',
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            backgroundColor: '#f8f9fa',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TodoIcon sx={{ color: 'primary.main' }} />
            <Typography variant='h6' noWrap component='div' sx={{ fontWeight: 600 }}>
              Todo App
            </Typography>
          </Box>
        </Toolbar>
        <Divider />
        <Box sx={{ p: 2 }}>
          <FormControl fullWidth size="small" sx={{ mb: 2 }}>
            <InputLabel>Sort by</InputLabel>
            <Select
              value={sortOrder}
              label="Sort by"
              onChange={(e) => onSortChange?.(e.target.value)}
            >
              <MenuItem value="newest">Newest First</MenuItem>
              <MenuItem value="oldest">Oldest First</MenuItem>
            </Select>
          </FormControl>

          {todoLists &&
            todoLists.map((item) => (
              <TodoListItem
                key={item.id}
                title={item.title}
                onEdit={(newTitle) => onEditList?.(item.id, newTitle)}
                onDelete={() => onDeleteList(item.id)}
              />
            ))}
          <Button
            fullWidth
            variant='contained'
            startIcon={<AddIcon />}
            sx={{
              py: 1.5,
              textTransform: 'none',
              fontWeight: 500,
            }}
            onClick={() => setOpenModal(true)}
          >
            Create New List
          </Button>
        </Box>
      </Drawer>

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Paper sx={{ width: 400, maxWidth: 400, p: 3, height: 150, borderRadius: 4 }}>
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant='subtitle'
              sx={{
                fontSize: '1.1rem',
                fontWeight: 500,
                color: 'text.secondary',
              }}
            >
              Create New Todo List
            </Typography>
          </Box>
          <TextField
            fullWidth
            label='Todo List Title'
            value={newListTitle}
            onChange={(e) => setNewListTitle(e.target.value)}
            autoFocus
          />
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={(e) => setOpenModal(false)}>Cancel</Button>
            <Button onClick={handleCreateTodoList} disabled={!newListTitle}>
              Create
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Grid>
  )
}
