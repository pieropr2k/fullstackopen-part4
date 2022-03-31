const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    // Exercise 4.17
    .populate('blogs', { url: 1, title: 1 , author: 1 })
    // Shows the entire blog object list, not only the id

  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body
  //console.log(username, name, password)

  // Exercise 4.16
  if (!username || !name || !password) {
    return response.status(400).json({
      error: 'The data is not complete. You must complete'
    })
  }
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'Both username and password must be at least 3 characters long'
    })
  }
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  // Exercise 4.15
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter