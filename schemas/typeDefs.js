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
    following_user_id: ID
    followed_user_id: ID
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
    userFollowers(userId: ID!): [User]
    userFollowing(userId: ID!): [User]
}
type Mutation {
    addUser( userame: String!, email: String!, password: String!): Auth 
    updateUser(username: String, email: String, password: String): User
    login(username: String!, password: String!): Auth
}`