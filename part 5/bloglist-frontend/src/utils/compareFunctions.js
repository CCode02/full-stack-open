const blogsLikesAsc = (a, b) => {
    if (a.likes > b.likes) {
        return -1
    }

    if (a.likes < b.likes) {
        return 1
    }

    return 0
}

const blogsLikesDesc = (a, b) => {
    if (a.likes > b.likes) {
        return 1
    }

    if (a.likes < b.likes) {
        return -1
    }

    return 0
}

export default {
    blogsLikesAsc,
    blogsLikesDesc
}