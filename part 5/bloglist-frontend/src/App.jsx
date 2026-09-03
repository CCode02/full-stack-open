import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.clearToken()
  }

  const handleCreateBlog = () => {
    const blog = {
      title,
      author,
      url
    }
    try {
      blogService.createBlog(blog)
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (error) {
      console.log(error.message)
    }

  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)} />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </>
  )

  const blogsForm = () => (
    <>
      <h2>blogs</h2>
      <p>
        {`${user.name} logged in`}
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <h2>create new</h2>
      <div>
        <label>
          title:
          <input 
          type="text"
          value={title} 
          onChange={({ target }) => setTitle(target.value)} />
        </label>
      </div>
      <div>
        <label>
          author:
          <input 
          type="text"
          value={author} 
          onChange={({ target }) => setAuthor(target.value)} />
        </label>
      </div>
      <div>
        <label>
          url:
          <input 
          type="text"
          value={url} 
          onChange={({ target }) => setUrl(target.value)} />
        </label>
      </div>
      <button onClick={handleCreateBlog}>create</button>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </>
  )

  return (
    <div>
      {!user && loginForm()}
      {user && blogsForm()}
    </div>
  )
}

export default App