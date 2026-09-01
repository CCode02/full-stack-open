const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const supertest = require('supertest')
const User = require('../models/user')
const app = require('../app')

const api = supertest(app)
const baseUrl = '/api/login'

describe('when there is initially one user in db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('admin', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('login succeeds', async () => {
        const user = {
            username: 'root',
            password: 'admin'
        }

        const result = await api
            .post(baseUrl)
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert(result.body.token)
    })

    test('login failed, incorrect password', async () => {
        const user = {
            username: 'root',
            password: 'adm'
        }

        const result = await api
            .post(baseUrl)
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('invalid username or password'))
    })

    test('login failed, username don\'t exist', async () => {
        const user = {
            username: 'mluukkai',
            password: 'admin'
        }

        const result = await api
            .post(baseUrl)
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('invalid username or password'))
    })
})

after(async () => mongoose.connection.close())