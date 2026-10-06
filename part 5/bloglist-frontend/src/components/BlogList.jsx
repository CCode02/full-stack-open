import Blog from './Blog'

const BlogList = ({ blogs, likeBlog, deleteBlog }) => {
  return (
    <>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} />
      )}
    </>
  )
}

export default BlogList