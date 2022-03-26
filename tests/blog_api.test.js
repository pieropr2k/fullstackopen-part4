const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const { initialBlogs, blogsInDb } = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  //console.log('cleared')  // 1st executed
  /*
  initialBlogs.forEach(async (oneblog) => {
    let blogObject = new Blog(oneblog)
    await blogObject.save()
    console.log('saved')  // real last executed
    // after the tests have run
  })
  // 2nd executed
  console.log('done')

  // Other method:
  const blogObjects = initialBlogs.map(blog => new Blog(blog))
  const promiseArray = blogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)*/
  await Blog.insertMany(initialBlogs)
})

describe('when there is initially some blogs saved', () => {
  // Exercise 4.8
  test('blogs are returned as json', async () => {
    //console.log('entered test') //'last' executed
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')
    // execution gets here only after the HTTP request is complete
    // the result of HTTP request is saved in variable response
    expect(response.body).toHaveLength(initialBlogs.length)
  })

  // Exercise 4.9
  test('id property is in the correct format', async () => {
    const blogsAtStart = await blogsInDb()
    expect(blogsAtStart[0].id).toBeDefined()
    expect(typeof blogsAtStart[0].id).toBe('string')
  })
})

describe('addition of a new blog', () => {
  // Exercise 4.10
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'Peru',
      author: 'Fallen',
      url: 'whatever',
      likes: 24
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    expect(blogsAtEnd.map(n => n.author)).toContain('Fallen')
  })

  // Exercise 4.11
  test('blog without likes is still valid', async () => {
    const newBlog = {
      title: 'Pizza',
      author: 'Mauricio',
      url: 'whatever fm'
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await blogsInDb()
    //expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    expect(blogsAtEnd[initialBlogs.length].likes).toBe(0)
  })

  // Exercise 4.12
  test('blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Donna',
      likes: 70
    }
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length)
  })
})
describe('deletion of a blog', () => {
  // Exercise 4.13
  test('a blog can be deleted', async () => {
    const blogsAtStart = await blogsInDb()

    await api
      .delete(`/api/blogs/${blogsAtStart[0].id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      initialBlogs.length - 1
    )
    const contents = blogsAtEnd.map(r => r.author)
    expect(contents).not.toContain(blogsAtStart[0].author)
  })
})

describe('modification of a blog', () => {
  // Exercise 4.14
  test('a blog can be updated', async () => {
    const updatedBlog = {
      author: 'Donna',
      likes: 55
    }
    const blogsAtStart = await blogsInDb()
    await api
      .put(`/api/blogs/${blogsAtStart[0].id}`)
      .send(updatedBlog)
      .expect(204)

    const blogsAtEnd = await blogsInDb()
    const contents = blogsAtEnd.map(r => r.author)
    expect(contents).toContain(updatedBlog.author)
    // to check if we updated the amount of likes for the blog post
    expect(blogsAtEnd[0].likes).toBe(55)
  })
})

afterAll(() => {
  mongoose.connection.close()
})