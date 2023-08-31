const User = require('../models/user');

const authService = {
  authenticate: async (email, password) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return null;
      }
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return null;
      }
      return user;
    } catch (error) {
      console.error(error);
      throw new Error('Authentication failed');
    }
  },

  // Other methods...
};

module.exports = authService;
