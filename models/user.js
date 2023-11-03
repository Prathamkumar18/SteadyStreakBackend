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
  isPending: {
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
  upvoteCount:{
    type: Number,
  },
  downvoteCount:{
    type:Number
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
const Activity = mongoose.model('Activity', activitySchema);
module.exports = User,Activity;

//Bcrypt is used for securely hashing and salting passwords in order to enhance password storage security in applications.
//Hashing is the process of converting data into a fixed-length string of characters.
//Salting is the practice of adding a random value to data before hashing to enhance security.