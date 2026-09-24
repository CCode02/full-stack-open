import { useState } from "react"

const Blog = ({ blog }) => {
  const [detailsVisible, setDetailsVisible] = useState(false)

  const details = () => (
    <div>
      {blog.url} <br />
      likes: {blog.likes} <button>like</button> <br />
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