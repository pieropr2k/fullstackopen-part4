const { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes } = require('../utils/list_helper')


test('dummy returns one', () => {
  const blogs = []
  const result = dummy(blogs)
  expect(result).toBe(1)
})

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  }
]

const listWithMultipleBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '6233f0473be5d774215926df',
    title: 'Hell',
    author: 'Sing',
    url: 'rl',
    likes: 70,
    __v: 0
  },
  {
    _id: '6233d871e356be8c56f62ebe',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'String',
    likes: 99,
    __v: 0
  },
  {
    _id: '6233f0473be5d774215925de',
    title: 'Hellen',
    author: 'Single',
    url: 'String',
    likes: 19,
    __v: 0
  },
  {
    _id: '6233f0473be5d774215926de',
    title: 'Hell',
    author: 'Sing',
    url: 'Sing',
    likes: 30,
    __v: 0
  },
  {
    _id: '6233f0473be5d774215926df',
    title: 'Hell',
    author: 'Sing',
    url: 'rl',
    likes: 35,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d1710',
    title: 'Go',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 45,
    __v: 0
  }
]

describe('total likes', () => {
  test('of empty list is zero', () => {
    expect(totalLikes([])).toBe(0)
  })
  test('when list has only one blog, equals the likes of that', () => {
    const result = totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })
  test('of a bigger list is calculated right', () => {
    const result = totalLikes(listWithMultipleBlog)
    expect(result).toBe(303)
  })
})

describe('top liked blog', () => {
  test('of empty list is zero', () => {
    expect(favoriteBlog([])).toBe(undefined)
  })
  test('when is only one blog, equals the likes of that', () => {
    const formattedOneBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    expect(favoriteBlog(listWithOneBlog)).toEqual(formattedOneBlog)
  })
  test('of a bigger list is calculated with no problem', () => {
    const formattedTopBlog = {
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 99
    }
    expect(favoriteBlog(listWithMultipleBlog)).toEqual(formattedTopBlog)
  })
})

describe('user with more blogs', () => {
  test('of empty list is nothing', () => {
    expect(mostBlogs([])).toBe(undefined)
  })
  test('when is only one blog, equals the same user', () => {
    const formattedOneBlog = {
      author: 'Edsger W. Dijkstra',
      blogs: 1
    }
    expect(mostBlogs(listWithOneBlog)).toEqual(formattedOneBlog)
  })
  test('of a bigger list is calculated with no problem', () => {
    const formattedTopBlog = {
      author: 'Sing',
      blogs: 3
    }
    expect(mostBlogs(listWithMultipleBlog)).toEqual(formattedTopBlog)
  })
})

describe('user with more likes accumulated', () => {
  test('of empty list is nothing accumulated', () => {
    expect(mostLikes([])).toBe(undefined)
  })
  test('when is only one blog, equals the same user and his respective average', () => {
    const formattedOneBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 5
    }
    expect(mostLikes(listWithOneBlog)).toEqual(formattedOneBlog)
  })
  test('of a bigger list is calculated with no problem the accumulation', () => {
    const formattedTopBlog = {
      author: 'Edsger W. Dijkstra',
      likes: 149
    }
    expect(mostLikes(listWithMultipleBlog)).toEqual(formattedTopBlog)
  })
})