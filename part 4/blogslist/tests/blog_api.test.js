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

after(async () => await mongoose.connection.close())