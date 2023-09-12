const User = require('../models/user');
const Activity = require('../models/activity');
const cron = require('node-cron');

const userController = {
  addActivity: async (req, res) => {
    try {
      const { email } = req.params; 
      const { activityName, color, icon, title, description, priority, daily } = req.body;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const activity = new Activity({
        activityName,
        color,
        icon,
        title,
        description,
        priority,
        daily,
      });

      user.activities.push(activity);
      await user.save();

      res.status(200).json({ message: 'Activity added successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  getUserNameByEmail: async (req, res) => {
    try {
      const { email } = req.params;

      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ name: user.name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  getAllUserActivities: async (req, res) => {
    try {
      const { email } = req.params;
    
      const user = await User.findOne({ email }).populate('activities');
  
      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }
  
      const activities = user.activities;  
      res.status(200).json({ activities });
    } catch (error) {
      console.error('Error occurred:', error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  deleteTask: async (req, res) => {
    try {
      const { email, title } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const activityIndex = user.activities.findIndex(
        (activity) => activity.title === title
      );
      if (activityIndex === -1) {
        return res.status(404).json({ message: 'Task not found' });
      }
      user.activities.splice(activityIndex, 1);
      await user.save();
      res.status(204).send(); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  updateActivityStatus: async (req, res) => {
    try {
      const { email, title, isChecked } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const activity = user.activities.find((activity) => activity.title === title);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      activity.isChecked = isChecked;
      await user.save();
      res.status(200).json({ message: 'Activity status updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  scheduleDailyUpdate: async (req, res) => {
    try {
      const { email, date } = req.body;
      const user = await User.findOne({ email });  
      if (!user) {
        console.log(`User with email ${email} not found`);
        return res.status(404).json({ message: 'User not found' });
      }
        const points = user.activities.filter((act) => act.isChecked).length;
      const dateWiseEntryIndex = user.dateWiseData.findIndex(
        (entry) => entry.date.toDateString() === new Date(date).toDateString()
      );
  
      if (dateWiseEntryIndex !== -1) {
        user.dateWiseData[dateWiseEntryIndex].points = points;
        user.dateWiseData[dateWiseEntryIndex].activitiesCount = user.activities.length;
      } else {
        user.dateWiseData.push({
          date: new Date(date),
          points,
          activitiesCount: user.activities.length,
        });
      }
        user.activities = user.activities.filter((activity) => activity.daily !== "No");
        await user.save();
      res.status(200).json({ message: 'Daily update executed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  
};

module.exports = userController;