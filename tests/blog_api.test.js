const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, usersInDb } = require('./test_helper')
const jwt = require('jsonwebtoken')

const api = supertest(app)

describe('blog api requests', () => {
  let auth_token = ''
  let userID = ''

  beforeAll(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
    const userBeforeLog = {
      username: user.username,
      id: user.id
    }
    userID = user.id
    auth_token = 'bearer ' + jwt.sign(userBeforeLog, process.env.SECRET)
    //console.log(auth_token, '- auth_token')
  })

  beforeEach(async () => {
    await Blog.deleteMany({})
    // Other method:
    //console.log(userID, '- user id before each')
    const blogObjects = initialBlogs.map(blog => new Blog({ ...blog, user: userID }))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
    //await Blog.insertMany(initialBlogs)
  })

  describe('when there is initially some blogs saved', () => {
    // Exercise 4.8
    test('blogs are returned as json', async () => {
      //console.log('entered test') //  'last' executed
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

  describe('addition of a new blog with the correct token', () => {
    // Exercise 4.10
    test('a valid blog can be added', async () => {
      //console.log(auth_token, '- add blog token')
      const newBlog = {
        title: 'Peru',
        author: 'Fallen',
        url: 'whatever',
        likes: 24
      }
      // Exercise 4.24
      await api
        .post('/api/blogs')
        // We put the Authorization header token here to run the post request
        .set('Authorization', auth_token)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
      expect(blogsAtEnd.map(n => n.author)).toContain('Fallen')
    })

    // Exercise 4.23
    test('a valid blog cannot be added with the incorrect token', async () => {
      //console.log(auth_token, '- add blog token')
      const newBlog = {
        title: 'Peru',
        author: 'Fallen',
        url: 'whatever',
        likes: 24
      }
      await api
        .post('/api/blogs')
        .set('Authorization', 'bearer hello_world')
        .send(newBlog)
        .expect(401)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(initialBlogs.length)
      expect(blogsAtEnd.map(n => n.author)).not.toContain('Fallen')
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
        .set('Authorization', auth_token)
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
        .set('Authorization', auth_token)
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
      //console.log(blogsAtStart)
      //console.log(blogsAtStart[0])
      //console.log(blogsAtStart[0]._id, '- first blog objected _id')
      //console.log(blogsAtStart[0].id, '- first blog string id')
      //console.log(auth_token, ': delete blog token')

      // Exercise 4.23
      await api
        .delete(`/api/blogs/${blogsAtStart[0].id}`)
        // We put the Authorization header token here to run the delete request
        .set('Authorization', auth_token)
        .expect(204)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(initialBlogs.length - 1)

      const contents = blogsAtEnd.map(r => r.author)
      expect(contents).not.toContain(blogsAtStart[0].author)
    })

    test('a blog cannot be deleted with the wrong user id', async () => {
      const blogsAtStart = await blogsInDb()
      await api
        // This is a random blog id that doesn't exists in the db
        .delete('/api/blogs/6240a126fdbafbdcef671234')
        .set('Authorization', auth_token)
        .expect(401)

      const blogsAtEnd = await blogsInDb()
      expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
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
        .expect(201)

      const blogsAtEnd = await blogsInDb()
      const contents = blogsAtEnd.map(r => r.author)
      expect(contents).toContain(updatedBlog.author)
      // to check if we updated the amount of likes for the blog post
      expect(blogsAtEnd[0].likes).toBe(55)
    })
  })
})


describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })
    await user.save()
  })

  test('that invalid users are not created: password not minimum 3 length', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'taxidrive',
      name: 'Mattias Lukaku',
      password: 'so',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).not.toContain(newUser.username)
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})

afterAll(() => {
  mongoose.connection.close()
})