const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
//const notesRouter = require('./controllers/notes')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs.js')
const usersRouter = require('./controllers/users.js')
const loginRouter = require('./controllers/login')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(cors())
// If is there's not this line, for example: the request.body will be undefined
app.use(express.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(cors())
//app.use(express.static('build'))
app.use(middleware.requestLogger)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app