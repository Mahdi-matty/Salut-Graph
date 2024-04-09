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
    status: Boolean
    userId: ID
    postId: ID
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
    searchUsers(query: String!): [User]
    loggedin(tokne: ID!): User
}
type Mutation {
    addUser( username: String!, email: String!, password: String!): Auth 
    login(username: String!, password: String!): Auth
    addPost( title: String!, content: String!, imageSource: String!, userId: ID!): Post
    deletePost(id: ID!, userId: ID!): Post
    editPost(id: ID!, title: String!, content: String!, imageSource: String!, userId: ID!): Post
    editPostTitle(id: ID!, title: String!, userId: ID!): Post
    editPostContent(id: ID!, content: String!, userId: ID!): Post
    editPostImage(id: ID!, imageSource: String!, userId: ID!): Post
    addComment(text: String!, userId: ID!, postId: ID!): Comment
    removeComment(id: ID!, userId: ID!): Comment
    addStory(imageSource: String!, userId: ID!): Story
    addFollow(followingUserId: ID!, followedUserId: ID!): Follow
    removeFollow(id: ID!, followingUserId: ID!): Follow
    addLike(status: Boolean!, userId: ID!, postId: ID!): Like
    removeLike(id: ID!, userId: ID!): Like
}
`;


module.exports = typeDefs