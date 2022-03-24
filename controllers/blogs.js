const blogsRouter = require('express').Router()
const Blog = require('../models/blog.js')
const logger = require('../utils/logger.js')

blogsRouter.get('/', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

blogsRouter.post('/', async (request, response, next) => {
  //logger.info(request.body)
  const body = request.body
  //const { title, author, url, likes } = request.body
  const blog = new Blog({
    author: body.author,
    title: body.title,
    url: body.url,
    likes: body.likes
  })
  //const blog = new Blog({ title, author, url, likes })
  /*logger.info(blog)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)*/
  logger.info(blog)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => next(error))
})

module.exports = blogsRouter