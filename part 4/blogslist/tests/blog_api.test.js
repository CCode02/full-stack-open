const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const blogPromises = blogObjects.map(blog => blog.save())

    await Promise.all(blogPromises)
})

test('all blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('property id exist', async () => {
    const response = await api.get('/api/blogs')

    assert(response.body[0].id)
})

test('a blog can be added', async () => {
    const newBlog = {
        title: "Fictional blog",
        author: "CCode02",
        url: "https://github.com/CCode02",
        likes: 1,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Fictional blog'))
})

test('a blog without property likes is created with zero likes', async () => {
    const newBlog = {
        title: "Fictional blog",
        author: "CCode02",
        url: "https://github.com/CCode02",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogCreated = blogsAtEnd.find(blog => blog.title === 'Fictional blog')
    assert.strictEqual(blogCreated.likes, 0)
})

test('a blog without title or url is not added', async () => {
    const blogWithoutTittle = {
        author: "CCode02",
        url: "https://github.com/CCode02",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutTittle)
        .expect(400)

    const blogWithoutUrl = {
        title: "Fictional blog",
        author: "CCode02",
        likes: 1
    }

    await api
        .post('/api/blogs')
        .send(blogWithoutUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const deletedBlog = blogsAtStart[0]

    await api
    .delete(`/api/blogs/${deletedBlog.id}`)
    .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(deletedBlog.title))
})

test('update a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatedBlog = {...blogsAtStart[0], likes: blogsAtStart[0].likes + 1}

    await api
    .put(`/api/blogs/${updatedBlog.id}`)
    .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(updatedBlog.likes, blogsAtEnd[0].likes)
    assert.deepStrictEqual(updatedBlog, blogsAtEnd[0])
})

after(async () => await mongoose.connection.close())