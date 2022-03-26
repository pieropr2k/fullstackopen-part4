const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const logger = require('../utils/logger.js')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
})

blogsRouter.post('/', async (request, response) => {
  //logger.info(request.body)
  const { title, author, url, likes } = request.body
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes || 0
  })
  logger.info(blog)
  const savedBlog = await blog.save()
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
  await Blog.findByIdAndRemove(request.params.id)
  response.status(204).end()
  /*try {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }*/
})

blogsRouter.put('/:id', async (request, response) => {
  logger.info(request.body)
  await Blog.findByIdAndUpdate(request.params.id, request.body)
  response.status(204).end()
})

module.exports = blogsRouter