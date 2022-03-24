const _ = require('lodash')

const dummy = (blogs) => {
  // ...
  return 1
}

const totalLikes = (blogs) => {
  return (blogs.length === 0)
    ? 0
    : (blogs.length === 1)
      ? blogs[0].likes
      : blogs.reduce((a, b) => {
        if (a.likes) return a.likes + b.likes
        return a + b.likes
      })
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  const { title, author, likes } = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current)
  return { title, author, likes }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  const obj = _.countBy(blogs, 'author')
  const key =  Object.keys(obj).reduce((prev, current) => (obj[prev] > obj[current]) ? prev : current)
  return {
    author: key,
    blogs: obj[key]
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return undefined
  }
  const obj =  _.reduce(blogs, function (result, value) {
    if (!result[value.author])
      result[value.author] = 0
    result[value.author] += value.likes
    return result
  }, {})
  const key =  Object.keys(obj).reduce((prev, current) => (obj[prev] > obj[current]) ? prev : current)
  return {
    author: key,
    likes: obj[key]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}