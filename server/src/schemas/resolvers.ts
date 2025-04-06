import { Book, User } from '../models/index.js';
import { signToken, AuthenticationError } from '../utils/auth.js'; 

// Define types for the arguments
interface AddUserArgs {
  input:{
    username: string;
    email: string;
    password: string;
  }
}

interface LoginUserArgs {
  email: string;
  password: string;
}

interface UserArgs {
  username: string;
}

interface BookArgs {
  bookId: string;
}

interface AddBookArgs {
  input:{
    title: string;
    author: string;
    description: string;
    publishedDate: string;
  }
}



const resolvers = {
  Query: {
    users: async () => {
      return User.find().populate('books');
    },
    user: async (_parent: any, { username }: UserArgs) => {
      return User.findOne({ username }).populate('books');
    },
    books: async () => {
      return await Book.find().sort({ createdAt: -1 });
    },
    book: async (_parent: any, { bookId }: BookArgs) => {
      return await Book.findOne({ _id: bookId });
    },
    // Query to get the authenticated user's information
    // The 'me' query relies on the context to check if the user is authenticated
    me: async (_parent: any, _args: any, context: any) => {
      // If the user is authenticated, find and return the user's information along with their books
      if (context.user) {
        return User.findOne({ _id: context.user._id }).populate('savedBooks');
      }
      // If the user is not authenticated, throw an AuthenticationError
      throw new AuthenticationError('Could not authenticate user.');
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs) => {
      // Create a new user with the provided username, email, and password
      const user = await User.create({ ...input });
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    
    login: async (_parent: any, { email, password }: LoginUserArgs) => {
      // Find a user with the provided email
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email, user._id);
    
      // Return the token and the user
      return { token, user };
    },
    saveBook: async (_parent: any, { input }: AddBookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate( 
          { _id: context.user._id },
          { $addToSet: {savedBooks: input } },
          { new: true}
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    },
  
    removeBook: async (_parent: any, { bookId }: BookArgs, context: any) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
          return updatedUser;
        }
      throw  new AuthenticationError("You need to be logged in!");
    },
  }
};

export default resolvers;
