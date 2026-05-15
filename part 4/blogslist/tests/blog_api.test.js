const { test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)
const baseUrl = '/api/blogs'

const login = async () => {
    const user = {
        username: 'root',
        password: 'admin'
    }

    const result = await api
        .post('/api/login')
        .send(user)

    return result.body.token
}

beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash(helper.initialUser.password, 10)
    const user = new User({ 
        username: helper.initialUser.username,
        name: helper.initialUser.name, 
        passwordHash })

    await user.save()

    const blogObjects = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user._id }))
    const blogPromises = blogObjects.map(blog => blog.save())

    user.blogs = helper.initialBlogs.map(blog => blog._id)

    await user.save()

    await Promise.all(blogPromises)
})

test('all blogs are returned as json', async () => {
    const response = await api
        .get(baseUrl)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('property id exist', async () => {
    const response = await api.get(baseUrl)

    assert(response.body[0].id)
})

test('a blog can be added', async () => {
    const token = await login()

    const newBlog = {
        title: "Fictional blog",
        author: "CCode02",
        url: "https://github.com/CCode02",
        likes: 1
    }

    await api
        .post(baseUrl)
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(titles.includes('Fictional blog'))
})

test('a blog without property likes is created with zero likes', async () => {
    const token = await login()

    const newBlog = {
        title: "Fictional blog",
        author: "CCode02",
        url: "https://github.com/CCode02",
    }

    await api
        .post(baseUrl)
        .set('authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const blogCreated = blogsAtEnd.find(blog => blog.title === 'Fictional blog')
    assert.strictEqual(blogCreated.likes, 0)
})

test('a blog can\'t be created without a token', async () => {
    const newBlog = {
        title: "Fictional blog",
        author: "CCode02",
        url: "https://github.com/CCode02",
        likes: 1
    }

    const result = await api
        .post(baseUrl)
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    assert(result.body.error.includes('token invalid'))
})

test('a blog without title or url is not added', async () => {
    const token = await login()

    const blogWithoutTittle = {
        author: "CCode02",
        url: "https://github.com/CCode02",
        likes: 1
    }

    await api
        .post(baseUrl)
        .set('authorization', `Bearer ${token}`)
        .send(blogWithoutTittle)
        .expect(400)

    const blogWithoutUrl = {
        title: "Fictional blog",
        author: "CCode02",
        likes: 1
    }

    await api
        .post(baseUrl)
        .set('authorization', `Bearer ${token}`)
        .send(blogWithoutUrl)
        .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
})

test('deletion of a blog', async () => {
    const token = await login()

    const blogsAtStart = await helper.blogsInDb()
    const deletedBlog = blogsAtStart[0]

    await api
        .delete(`/api/blogs/${deletedBlog.id}`)
        .set('authorization', `Bearer ${token}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

    const titles = blogsAtEnd.map(blog => blog.title)
    assert(!titles.includes(deletedBlog.title))
})

test('update a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const updatedBlog = { ...blogsAtStart[0], likes: blogsAtStart[0].likes + 1 }

    await api
        .put(`/api/blogs/${updatedBlog.id}`)
        .send(updatedBlog)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(updatedBlog.likes, blogsAtEnd[0].likes)
    assert.deepStrictEqual(updatedBlog, blogsAtEnd[0])
})

after(async () => await mongoose.connection.close())