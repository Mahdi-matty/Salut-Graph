const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schemas');
const sequelize = require('./config/connection');
const { authMiddleware } = require('./middleware/withTokenAuth')
const path = require('path');
const {User, Post, Comment, Like, Follow, Story } = require('./models')

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {authMiddleware, User, Post, Follow, Like, Story, Comment}
})
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });


      sequelize.sync({force: false }).then(function() {
        app.listen(PORT, () => {
          console.log(`API server running on port ${PORT}!`);
          console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        });
      });
    }

    startApolloServer()  