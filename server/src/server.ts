import express from 'express';
import path from 'node:path';
import type { Request, Response } from 'express';
import db from './config/connection.js'
import { ApolloServer } from '@apollo/server';// Note: Import from @apollo/server-express
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs, resolvers } from './schemas/index.js';
import { authenticateToken } from './utils/auth.js';
// import cors from 'cors';

// dotenv.config();

//create  the Apollo server instace
const server = new ApolloServer({
  typeDefs,
  resolvers
});

//starting the Apollo server and connecting it to the db
const startApolloServer = async () => {
  await server.start();
  await db;

  const PORT = process.env.PORT || 3001;
  const app = express();

  //use CORS to handle cross-origin requests
  // app.use(cors());

  //middlewar for parsing request bodies
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());


  //Sets up Apollo server as middleware on the Express app to handle the GraphQL requests
  app.use('/graphql', expressMiddleware(server as any,
    {
      context: authenticateToken as any
    })
  );

  //serve static files in production 
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join('../client/dist')));
    console.log('production mode activated')

    app.get('*', (_req: Request, res: Response) => {
      try {
        res.sendFile(path.join('../client/dist/index.html'));
      } catch (error) {
        console.error(error)
        res.status(400).json(error)
      }
      
    });
  }
// setup the server to listen on a port
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
    console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
  });
};

startApolloServer();
