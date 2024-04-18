const { User, Post, Comment, Follow, Story, Like, Message, Notification } = require('../models')
const { signToken } = require('../middleware/withTokenAuth')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

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
        searchUsers: async (_, { username }) => {
            try {
                const user = await User.findOne({ where: { username: username } })
                return user
            } catch (error) {
                console.error("Error searching users:", error);
                throw new Error('Failed to search users');
            }
        },
        posts: async () => {
            const newPosts = await Post.findAll()
            const postsWithData = await Promise.all(newPosts.map(async (post) => {
                const postComments = await Comment.findAll({ where: { postId: post.id } })
                const postLikes = await Like.findAll({ where: { postId: post.id } })
                return {
                    ...post.toJSON(),
                    comments: postComments,
                    likes: postLikes
                };
            }))
            return postsWithData
        },
        post: async (_, { id }) => {
            try {
                const post = await Post.findByPk(id)
                const comments = await Comment.findAll({ where: { postId: id } })
                const likes = await Like.findAll({ where: { postId: id } })
                post.dataValues.comments = comments;
                post.dataValues.likes = likes;
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
                const followsIds = await Follow.findAll({ where: { followedUserId: userId } })
                const usersPromises = followsIds.map(async (follow) => {
                    const user = await User.findByPk(follow.followingUserId)
                    return user
                });
                const users = await Promise.all(usersPromises)
                return users
            } catch (error) {
                console.log(error)
            }
        },
        userFollowing: async (_, { userId }) => {
            try {
                const followsIds = await Follow.findAll({ where: { followingUserId: userId } })
                const usersPromises = followsIds.map(async (follow) => {
                    const user = await User.findByPk(follow.followedUserId)
                    return user
                });
                const users = await Promise.all(usersPromises)
                return users
            } catch (error) {
                console.log(error)
            }
        },
        loggedin: async (_, { token }) => {
            if (!token) {
                throw new Error('Token not provided');
            }

            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const userName = decoded.username;

                const user = await User.findOne({
                    where: {
                        username: userName
                    }
                });

                if (user) {
                    return user;
                } else {
                    throw new Error('User not found');
                }
            } catch (error) {
                throw new Error('Invalid token');
            }
        },
        allMess: async (_, { userId }) => {
            try {
                const newMessages = await Message.findAll({ where: {[Op.or]: [
                    { senderId: userId },
                    { reciverId: userId }
                ] }
            })
                return newMessages
            } catch (error) {
                console.log(error)
                throw error
            }
        },
        userNotif: async (_, { userId }) => {
            try {
                const notifications = await Notification.findAll({ where: { userId } })
                return notifications
            } catch (error) {
                console.log(error)
            }

        }
    },
    Mutation: {
        addUser: async (_, { username, email, password }) => {
            try {
                const user = await User.create({ username, email, password });
                const token = signToken(user);
                return { token, user };
            } catch (error) {
                // Handle errors (e.g., database errors, token generation errors) here
                console.error("Error creating user:", error);
                throw new Error("Failed to create user");
            }
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
        addPost: async (_, { title, content, imageSource, userId }) => {
            try {
                const user = await User.findByPk(userId)
                if (!user) {
                    throw new Error('user not found')
                }
                const post = await Post.create({ title, content, imageSource, userId })
                return post
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        deletePost: async (_, { id, userId }) => {
            try {
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if (findPos.userId !== user.id) {
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.destroy({ where: { id } })
                if (post === 0) {
                    throw new Error('Post not found or you are not authorized to delete it');
                }

                return { success: true, message: 'Post deleted successfully' };
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        editPost: async (_, { id, title, content, imageSource, userId }) => {
            try {
                const user = await User.findByPk(userId)
                const findPos = await Post.findByPk(id)
                if (findPos.userId !== user.id) {
                    throw new Error('You are not authorized to edit this post')
                }
                const post = await Post.update({ title, content, imageSource }, { where: { id } })
                return post
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addComment: async (_, { text, userId, postId }) => {
            try {
                const user = await User.findByPk(userId)
                if (!user) {
                    throw new Error('user not found')
                }
                const comments = await Comment.create({ text, userId, postId })
                return comments
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeComment: async (_, { id, userId }) => {
            try {
                const user = await User.findByPk(userId)
                const findPCom = await Comment.findByPk(id)
                if (findPCom.userId !== user.id) {
                    throw new Error('You are not authorized to edit this comment')
                }
                const comment = await Comment.destroy({ where: { id } })
                if (comment === 0) {
                    throw new Error('Post not found or you are not authorized to delete it');
                }

                return { success: true, message: 'comment deleted successfully' };
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addStory: async (_, { imageSource, userId }) => {
            try {
                const user = await User.findByPk(userId)
                if (!user) {
                    throw new Error('user not found')
                }
                const story = await Story.create({ imageSource, userId })
                return story
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addFollow: async (_, { followingUserId, followedUserId }) => {
            try {
                const user = await User.findByPk(followingUserId)
                if (!user) {
                    throw new Error('user not found')
                }
                const follow = await Follow.create({ followingUserId, followedUserId })
                return follow
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeFollow: async (_, { id, followingUserId }) => {
            try {
                const user = await User.findByPk(followingUserId)
                const findPCom = await Follow.findByPk(id)
                if (findPCom.followingUserId !== user.id) {
                    throw new Error('You are not authorized to edit this')
                }
                const follow = await Follow.destroy({ where: { id } })
                if (follow === 0) {
                    throw new Error('you are not authorized to delete it');
                }

                return { success: true, message: 'deleted successfully' };
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        addLike: async (_, { status, userId, postId }) => {
            try {
                const user = await User.findByPk(userId)
                if (!user) {
                    throw new Error('user not found')
                }
                const post = await Post.findByPk(postId)
                if (!post) {
                    throw new Error('post not found')
                }
                const like = await Like.create({ status, userId, postId })
                return like
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        removeLike: async (_, { id, userId }) => {
            try {
                const user = await User.findByPk(userId)
                const findPCom = await Like.findByPk(id)
                if (findPCom.userId !== user.id) {
                    throw new Error('You are not authorized to edit')
                }
                const like = await Like.destroy({ where: { id } })
                if (like === 0) {
                    throw new Error('not found or you are not authorized to edit it');
                }

                return { success: true, message: 'deleted successfully' };
            } catch (error) {
                console.error("error", error)
                throw new Error('failed')
            }
        },
        sendMessage: async(_, {text, senderId, reciverId})=>{
            try{
                const newMsg = await Message.create({text, senderId, reciverId})
                return newMsg
            }catch(error){
                console.log(error)
            }
        },
        addNotif: async (_, {userId, message, status})=>{
            try{    
                const newNote = await Notification.create({userId, message, status})
                return newNote
            }catch(error){
                console.log(error)
            }
        }

    }
}

module.exports = resolvers

