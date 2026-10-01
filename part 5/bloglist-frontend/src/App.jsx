import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import BlogsForm from './components/BlogsForm'
import BlogList from './components/BlogList'
import Login from './components/Login'
import compareFunctions from './utils/compareFunctions'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({})

  const blogsFormRef = useRef()

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs => {
      blogs.sort(compareFunctions.blogsLikesAsc)
      setBlogs(blogs)
    })
  }, [])

  const login = async (credentials) => {

    try {
      const user = await loginService.login(credentials)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Successful login`, false)
    } catch (error) {
      showNotification('wrong username or password', true)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    setUser(null)
    blogService.clearToken()
    showNotification(`Successful logout`, false)
  }

  const addBlog = async (blog) => {
    try {
      const createdBlog = await blogService.createBlog(blog)
      blogsFormRef.current.toggleVisibility()
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${blog.title} by ${blog.author} added`, false)
    } catch (error) {
      showNotification(error.message, true)
    }
  }

  const addLike = async (likedBlog) => {
    try {
      const returnedBlog = await blogService.updateBlog(likedBlog.id, likedBlog)
      const prueba = blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog)

      const blogsTemp = blogs.map(blog => blog.id === returnedBlog.id ? returnedBlog : blog)
      blogsTemp.sort(compareFunctions.blogsLikesAsc)
      setBlogs(blogsTemp)
    } catch (error) {
      showNotification(error.message, true)
    }
  }

  const showNotification = (message, error) => {
    const notification = error ? { error: message } : { message }
    setNotification(notification)
    setTimeout(() => {
      setNotification({})
    }, 5000)
  }

  const loginForm = () => (
    <>
      <h2>log in to application</h2>
      <Notification notification={notification} />
      <Login loginUser={login} />
    </>
  )

  const blogsForm = () => (
    <>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {`${user.name} logged in`}
        <button onClick={handleLogout}>
          logout
        </button>
      </p>
      <Togglable buttonLabel='create new blog' ref={blogsFormRef}>
        <BlogsForm createBlog={addBlog} />
      </Togglable>
      <BlogList blogs={blogs} likeBlog={addLike} />
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