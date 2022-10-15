const { gql } = require('apollo-server-express');




// we need two mutations, create user and save book. 



const typeDefs = gql`
  type User {
    _id: ID!
    username: String
    email: String!
    bookCount: Int
    saveBooks: [Book]
  }
  type Auth {
    
    token: String!
    user: User
  }

  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String
    image: String
    link: String
  }

  type Query {
    me: User
  }
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookId: String!, authors: [String], description: String, title: String, image: String, link: String): User
    removeBook(bookId: String!): User
  }

`;

module.exports = typeDefs;