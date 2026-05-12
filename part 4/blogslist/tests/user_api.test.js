const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const baseUrl = '/api/users'

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('admin', 10)
        const user = new User ({username:'root', passwordHash})
        
        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'hellas',
            name: 'Arto Hellas',
            password: 'salainen'
        }

        await api
            .post(baseUrl)
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(user => user.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails, username is not included', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const result = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('username: Path `username` is required.'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails, username is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const result = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('is shorter than the minimum allowed length (3).'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails, password is not included', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen'
        }

        const result = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password is required'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
    
    test('creation fails, password is too short', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        const result = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('password is too short'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails, username must be unique', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'superuser',
            password: 'admin',
        }

        const result = await api
        .post(baseUrl)
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expected `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

})



after(async () => {
    await mongoose.connection.close()
})