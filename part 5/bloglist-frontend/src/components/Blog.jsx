import { useState } from "react"

const Blog = ({ blog, likeBlog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const handleLike = () => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    likeBlog(likedBlog)
  }

  const details = () => (
    <div>
      {blog.url} <br />
      likes: {blog.likes} <button onClick={handleLike}>like</button> <br />
      {blog.user.username}
    </div>
  )

  return (
    <div className="blog">
      <div>
        {blog.title} {blog.author} <button onClick={() => setDetailsVisible(!detailsVisible)}>{detailsVisible ? 'hide' : 'view'}</button>
      </div>
      {detailsVisible && details()}
    </div>
  )
}

export default Blog