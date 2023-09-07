const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  color: String,
  icon: String,
  title: String,
  description: String,
  priority: String,
  daily: String,
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
