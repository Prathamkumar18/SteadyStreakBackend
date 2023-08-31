const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityName: String,
  color: String,
  icon: String,
  title: String,
  description: String,
  priority: Number,
  daily: Boolean,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
