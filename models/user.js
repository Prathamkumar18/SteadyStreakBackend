const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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
  dailyActivities: [
    {
      activity: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
      },
      completed: Boolean,
    },
  ],
  dateWiseData: [
    {
      date: Date,
      points: Number,
    },
  ],
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
