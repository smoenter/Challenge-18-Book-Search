const typeDefs = `
  type User {
    _id: ID
    username: String
    email: String
    password: String
    books: [Book]!
  }

  type Book {
    _id: ID
    bookText: String
    bookAuthor: String
    createdAt: String
    comments: [Comment]!
  }

  type Comment {
    _id: ID
    commentText: String
    createdAt: String
  }

  input BookInput {
    bookText: String!
    bookAuthor: String!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
  }
  
  type Auth {
    token: ID!
    user: User
  }

  type Query {
    users: [User]
    user(username: String!): User
    books: [Book]!
    book(bookId: ID!): Book
    me: User
  }

  type Mutation {
    addUser(input: UserInput!): Auth
    login(email: String!, password: String!): Auth
    addBook(input: BookInput!): Book
    addComment(bookId: ID!, commentText: String!): Book
    removeBook(bookId: ID!): Book
    removeComment(bookId: ID!, commentId: ID!): Book
  }
`;

export default typeDefs;
