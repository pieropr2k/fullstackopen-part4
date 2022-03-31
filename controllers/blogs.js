const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const logger = require('../utils/logger.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  //logger.info(request.body)
  const user = request.user
  logger.info('token user: ', user)
  const { title, author, url, likes } = request.body
  //const token = getTokenFrom(request)
  logger.info('token: ', request.token)
  if (!user || !request.token) {
    return response.status(401).json({ error: 'token is missing the first word' })
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0,
    user: user._id
  })
  //logger.info(blog, 'new blog')
  //logger.info(blog.user, 'new blog user id')
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
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  const user = request.user
  //logger.info('token user: ', user)
  const blog = await Blog.findById(request.params.id)
  //logger.info('blog info: ', blog)
  //logger.info('blog id info: ', blog.id)  // is a string
  //logger.info('blog user info: ', blog.user.toString())
  if ( !blog ) {
    return response.status(401).json({ error: 'this blog does not exist' })
  }
  // Exercise 4.21
  if ( blog.user.toString() !== user.id ){
    return response.status(401).json({ error: 'you cannot delete nothing by a wrong user' })
  }
  //logger.info(user.blogs)
  //logger.info(user.blogs.filter(blog => blog.toString() !== request.params.id))
  user.blogs = user.blogs.filter(blog => blog.toString() !== request.params.id)
  await user.save()
  // Before only was this
  await Blog.findByIdAndRemove(request.params.id)
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