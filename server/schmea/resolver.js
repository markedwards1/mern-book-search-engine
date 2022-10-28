const AuthenticationError = require("../AuthError/AuthenticationError");
const { User } = require("../models");
// const { AuthenticationError } = require('apollo-server-express');

const { signToken } = require("../utils/auth");

// const auth = require('../utils/auth');

//helper function
function checkIfLoggedIn(context) {
  if (!context.user) {
    throw new AuthenticationError("you are not logged in");
  }
}

const resolvers = {
  Query: {
    me: async () => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        return userData;
      }
    },

    // me: async (parent, args, context) => {
    //   //checks if this property exisits inside the context object
    //   // this one uses the helper function
    //   checkIfLoggedIn(context);
    //   const userdata = await User.findOne({ _id: context.user._id }).select(
    //     "-__v -password"
    //   );
    //   return userdata;
    // },
  },

  Mutation: {

    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email: email });
      if (!user) {
        throw new AuthenticationError("Wrong Username");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Wrong Password");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookId, authors, description, title, image, link }, context ) => {
      checkIfLoggedIn(context);

      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user },
        { $addToSet: { savedBooks: { bookId, authors, description, title, image, link }, }, 
        },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      checkIfLoggedIn(context);
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user },
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      if (!updatedUser) {
        throw new AuthenticationError("could not find user id");
      }
      return updatedUser;
    },
  },
};

module.exports = resolvers;
