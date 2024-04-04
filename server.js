const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { typeDefs, resolvers } = require('./schemas');
const sequelize = require('./config/connection');
const authMiddleware = require('./middleware/withTokenAuth')

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
  typeDefs,
  resolvers,
});
const startApolloServer = async () => {
    await server.start();
  
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());
  
    app.use('/graphql', expressMiddleware(server, {
      context: authMiddleware
    }));
    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));
    
        app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
      }
      sequelize.once('open', () => {
        app.listen(PORT, () => {
          console.log(`API server running on port ${PORT}!`);
          console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
        });
      });
    };
    startApolloServer();          