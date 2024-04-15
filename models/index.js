const Comment = require('./Comment')
const Follow = require('./Follow')
const Like = require('./Like')
const Post = require('./Post')
const Story = require('./Story')
const User = require('./User')
const Message = require('./Message')
const Notification = require('./Notification')

User.hasOne(Story, {
    foreignKey: "userId"
})

User.hasMany(Post, {
    foreignKey: "userId"
})
Post.belongsTo(User, {
    foreignKey: "userId"
})
User.hasMany(Notification, {
    as: 'notifications',
    foreignKey: 'userId'
  })
  
Notification.belongsTo(User, {
    foreignKey: 'userId'
  })
User.hasMany(Comment, {
    foreignKey: "userId"
})
Comment.belongsTo(User, {
    foreignKey: "userId"
})
Post.hasMany(Comment, {
    foreignKey: "postId"
})
Comment.belongsTo(Post, {
    foreignKey: "postId"
})

Post.hasMany(Like, {
    foreignKey: "postId"
})
Like.belongsTo(Post, {
    foreignKey: "postId"
})
User.hasMany(Like, {
    foreignKey: 'userId'
})
Like.belongsTo(User, {
    foreignKey: "userId"
})

User.belongsToMany(User, {
    through: Follow,
    as: "Followers",
    foreignKey: "followedUserId"
})
User.belongsToMany(User, {
    through: Follow,
    as: "Following",
    foreignKey: "followingUserId"
})

Message.belongsTo(User, {
    foreignKey: "senderId",
    as: "sender"
})
Message.belongsTo(User, {
    foreignKey: "reciverId",
    as: "reciver"
})



module.exports = {
    Comment,
    Follow,
    Like,
    User,
    Story,
    Post,
    Message,
    Notification
}