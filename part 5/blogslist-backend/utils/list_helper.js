var _ = require('lodash');

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    const reducer = (favorite, blog) => {
        return favorite.likes === undefined || favorite.likes < blog.likes
            ? {
                title: blog.title,
                author: blog.author,
                likes: blog.likes
            }
            : favorite

    }

    return blogs.reduce(reducer, {})
}

const mostBlogs = (blogs) => {
    const blogsCounter = _.countBy(blogs, 'author')
    let mostBlogsAuthor = {}
    for(const property in blogsCounter){
        mostBlogsAuthor = mostBlogsAuthor.blogs === undefined || mostBlogsAuthor.blogs < blogsCounter[property]
            ? {
                author: property,
                blogs: blogsCounter[property]
            }
            : mostBlogsAuthor
    }
    return mostBlogsAuthor
}

const mostLikes = (blogs) => {
    const blogsGroupBy = _.groupBy(blogs, 'author')
    let mostLikesAuthor = {}
    for(const property in blogsGroupBy){
        const sumLikes = _.sumBy(blogsGroupBy[property], 'likes')
        mostLikesAuthor = mostLikesAuthor.likes === undefined || mostLikesAuthor.likes < sumLikes
        ? {
            author: property,
            likes: sumLikes
        }
        : mostLikesAuthor
    }
    return mostLikesAuthor
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}