import express from 'express'
import cors from 'cors'
import todoListsRouter from './routes/todoLists.js'
import todosRouter from './routes/todos.js'

export const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/todo-lists', todoListsRouter)
app.use('/api', todosRouter)

const PORT = 3001

app.get('/', (req, res) => res.send('The Backend Is Up And Running!'))

app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))
