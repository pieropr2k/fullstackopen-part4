const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const User = require('../models/user.js')
const logger = require('../utils/logger.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    // Exercise 4.17
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  //logger.info(request.body)
  const { title, author, url, likes, userId } = request.body
  const user = await User.findById(userId)
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })
  logger.info(blog, 'new blog')
  logger.info(blog.user, 'new blog user id')

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).json({ error: 'this blog does not exist' })
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const blog = await Blog.findByIdAndRemove(request.params.id)
  //await Blog.findById(request.params.id)
  //logger.info('blog info: ', blog)
  //logger.info('blog id info: ', blog.id)  // is a string
  //logger.info('blog user info: ', blog.user.toString())
  if ( !blog ) {
    return response.status(401).json({ error: 'this blog does not exist' })
  }
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  logger.info(request.body)
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true
  })
  if ( !blog ) {
    return response.status(401).json({ error: 'this blog does not exist' })
  }
  response.status(201).json(blog)
})

module.exports = blogsRouter