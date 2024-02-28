const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth')
const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
    },
    
  },
  Mutation: {
    login: async (parent, args) => {
      const user = await User.findOne({email: args.email});
    if (!user) {
      throw AuthenticationError;
    }

    const correctPw = await user.isCorrectPassword(args.password);

    if (!correctPw) {
      throw AuthenticationError;
    }
    const token = signToken(user);
    return {user, token};
    },

    signup: async (parent, { username, email, password }) => {
      const user = await User.create({username, email, password});

      if (!user) {
        throw AuthenticationError;
      }
      const token = signToken(user);
      return {user, token};
    },
    // saveBook: async (parent, args, context) => {},
    // deleteBook: async (parent, args, context) => {}
  },
};

module.exports = resolvers;
