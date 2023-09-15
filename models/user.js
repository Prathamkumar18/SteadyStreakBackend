const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const activitySchema = new mongoose.Schema({
  color: String,
  icon: String,
  title: String,
  description: String,
  priority: String,
  daily: String,
  isChecked: {
    type: Boolean,
    default: false,
  },
});

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
      percent: Number,
      activitiesCount: Number,
    },
  ],
  activities: [activitySchema],
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;