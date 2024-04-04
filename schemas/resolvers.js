const { AuthenticationError } = require('apollo-server-express');
const { User, Post, Comment, Follow, Story, Like } = require('../models')
const withTokenAuth = require('../middleware/withTokenAuth');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
    Mutation: {
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password })
            const token = withTokenAuth(user)
            return { token, user }
        },
        login: async (_, { username, password }) => {
            const user = await User.findOne({ username })
            if (!user) {
                throw new Error('incorrect credential')
            }
            const correctPass = await bcrypt.compare(password, user.password)

            if (!correctPass) {
                throw new Error("invalid credintial")
            }
            const token = jwt.sign(
                { username: user.username, email: user.email, id: user.id },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );
            return { token, user };
        },
        addPost: async(_, {title, content, imageSource, userId})=>{
            try{
                const user = await User.findByPk(userId)
                if(!user){
                    throw new Error('user not found')
                }
                const post = await Post.create({title, content, imageSource, userId})
                return post
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        deletePost: async (_, {id, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if(findPos.userId !== user.id){
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.destroy ({where: {id}})
                if (post === 0) {
                    throw new Error('Post not found or you are not authorized to delete it');
                  }
          
                  return { success: true, message: 'Post deleted successfully' };
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        editPost: async (_, {id, title, content, imageSource, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if(findPos.userId !== user.id){
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.update({title, content, imageSource},{where: {id}})
                return post
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        editPostTitle: async (_, {id, title, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if(findPos.userId !== user.id){
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.update({title},{where: {id}})
                return post
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        editPostContent:  async (_, {id, content, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if(findPos.userId !== user.id){
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.update({content},{where: {id}})
                return post
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        editPostImage: async (_, {id, imageSource, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if(findPos.userId !== user.id){
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.update({imageSource},{where: {id}})
                return post
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addComment:  async(_, {text, userId, postId})=>{
            try{
                const user = await User.findByPk(userId)
                if(!user){
                    throw new Error('user not found')
                }
                const comments = await Comment.create({text, userId, postId})
                return comments
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeComment : async (_, {id, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPCom = await Comment.findByPk(id)
                if(findPCom.userId !== user.id){
                    throw new Error('You are not authorized to edit this comment')
                }
                const comment = await Comment.destroy ({where: {id}})
                if (comment === 0) {
                    throw new Error('Post not found or you are not authorized to delete it');
                  }
          
                  return { success: true, message: 'comment deleted successfully' };
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addStory:  async(_, {imageSource, userId})=>{
            try{
                const user = await User.findByPk(userId)
                if(!user){
                    throw new Error('user not found')
                }
                const story = await Story.create({imageSource, userId})
                return story
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addFollow:  async(_, {followingUserId, followedUserId})=>{
            try{
                const user = await User.findByPk(followingUserId)
                if(!user){
                    throw new Error('user not found')
                }
                const follow = await Follow.create({followingUserId, followedUserId})
                return follow
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeFollow : async (_, {id, followingUserId})=>{
            try{
                const user = await User.findByPk(followingUserId)
                const findPCom = await Follow.findByPk(id)
                if(findPCom.followingUserId !== user.id){
                    throw new Error('You are not authorized to edit this')
                }
                const follow = await Follow.destroy ({where: {id}})
                if (follow === 0) {
                    throw new Error('you are not authorized to delete it');
                  }
          
                  return { success: true, message: 'deleted successfully' };
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addLike:  async(_, {status, userId, postId})=>{
            try{
                const user = await User.findByPk(userId)
                if(!user){
                    throw new Error('user not found')
                }
                const post = await Post.findByPk(postId)
                if(!post){
                    throw new Error('post not found')
                }
                const like = await Like.create({status, userId, postId})
                return like
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeLike : async (_, {id, userId})=>{
            try{
                const user = await User.findByPk(userId)
                const findPCom = await Like.findByPk(id)
                if(findPCom.userId !== user.id){
                    throw new Error('You are not authorized to edit')
                }
                const like = await Like.destroy ({where: {id}})
                if (like === 0) {
                    throw new Error('not found or you are not authorized to delete it');
                  }
          
                  return { success: true, message: 'deleted successfully' };
            }catch(error){
                console.error("error", error)
                throw new Error('failed')
            }
        },
        
    }
}

