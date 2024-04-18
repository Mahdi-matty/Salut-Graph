const { gql } = require('apollo-server-express');

const typeDefs = gql`
type User {
    id: ID
    username: String
    password: String
    email: String
}

type Post {
    id: ID
    title: String
    content: String
    imageSource: String
    comments: [Comment]
    likes: [Like]
    userId: ID
}


type Comment {
    id: ID
    text: String
    userId: ID
    postId: ID
}
type Like {
    id: ID
    status: LikeStatus
    userId: ID
    postId: ID
}
type Notification {
    id: ID
    message: String
    status: NotificationStatus
    userId: ID
}
enum LikeStatus {
    notLiked
    liked
}
enum NotificationStatus{
    read
    unread
}
type Story {
    id: ID
    imageSource: String
    userId: ID
}

type Follow {
    id: ID
    followingUserId: ID
    followedUserId: ID
}
type Message {
    text: String
    reciverId: ID
    senderId: ID
}
type Auth {
    token: ID
    user: User
}

type Query {
    users: [User]
    user(id: ID!): User
    posts: [Post]
    post(id: ID!): Post
    comments(postId: ID!): [Comment]
    likes(postId: ID!): [Like]
    userStory(userID : ID!): Story
    userPosts(userId: ID!): [Post]
    userFollowers(followedUserId: ID!): [User]
    userFollowing(followingUserId: ID!): [User]
    searchUsers(username: String!): User
    loggedin(tokne: ID!): User
    allMess(userId: ID!): [Message]
    userNotif(userId: ID): [Notification]
}
type Mutation {
    addUser( username: String!, email: String!, password: String!): Auth 
    login(username: String!, password: String!): Auth
    addPost( title: String!, content: String!, imageSource: String, userId: ID!): Post
    deletePost(id: ID!, userId: ID!): Post
    editPost(id: ID!, title: String, content: String, imageSource: String, userId: ID!): Post
    addComment(text: String!, userId: ID!, postId: ID!): Comment
    removeComment(id: ID!, userId: ID!): Comment
    addStory(imageSource: String!, userId: ID!): Story
    addFollow(followingUserId: ID!, followedUserId: ID!): Follow
    removeFollow(id: ID!, followingUserId: ID!): Follow
    addLike(status: LikeStatus!, userId: ID!, postId: ID!): Like
    removeLike(id: ID!, userId: ID!): Like
    sendMessage(text: String!, senderId: ID!, reciverId: ID!): Message
    addNotif(message: String!, status: NotificationStatus!, userId: ID!): Notification
}
`;


module.exports = typeDefs