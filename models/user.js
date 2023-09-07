const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// const dailyActivitySchema = new mongoose.Schema({
//   activity: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Activity',
//   },
// });

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateWiseData: [
    {
      date: Date,
      points: Number,
    },
  ],
  activities: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
    },
  ],
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
