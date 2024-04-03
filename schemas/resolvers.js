const { AuthenticationError } = require('apollo-server-express');
const { User, Post, Comment, Follow, Story, Like } = require('../models')
const TokenAuth = require('../middleware/withTokenAuth')

const resolvers = {
    Query: {
        users: async () => {
            return await User.findAll()
        },
        user: async (_, { id }) => {
            try {
                const userName = await User.findByPk(id)
                return userName
            } catch (error) {
                console.log(error)
            }
        },
        posts: async () => {
            return await Post.findAll()
        },
        post: async (_, { id }) => {
            try {
                const post = await Post.findByPk(id)
                return post
            } catch (error) {
                console.log(error)
            }
        },
        userPosts: async (_, { userId }) => {
            try {
                const userPost = await Post.findAll({ where: { userId } })
                return userPost
            } catch (error) {
                throw new Error("can't find any post")
            }
        },
        comments: async (_, { postId }) => {
            try {
                const postComment = await Comment.findAll({ where: { postId } })
                return postComment
            } catch (error) {
                console.log(error)
            }
        },
        likes: async (_, { postId }) => {
            try {
                const postlike = await Like.findAll({ where: { postId } })
                return postlike
            } catch (error) {
                console.log(error)
            }
        },
        userStory: async (_, { userId }) => {
            try {
                const stroy = await Story.findAll({ where: { userId } })
                return stroy
            } catch (error) {
                console.log(error)
            }
        },
        userFollowers: async (_, { userId }) => {
            try {
                const follow = await Follow.findAll({ where: { userId } })
                return follow
            } catch (error) {
                console.log(error)
            }
        },
        userFollowing: async (_, { userId }) => {
            try {
                const follow = await Follow.findAll({ where: { userId } })
                return follow
            } catch (error) {
                console.log(error)
            }
        },
    },
    Mutation : {
        addUser: async 
    }
}