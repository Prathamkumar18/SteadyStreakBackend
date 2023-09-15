const User = require('../models/user');
const bcrypt = require('bcrypt');
const Activity = require('../models/activity');

const userController = {
//GET
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

  getLast7DateWiseData: async (req, res) => {
    try {
      const { email } = req.params;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.dateWiseData.sort((a, b) => b.date - a.date);
      const last7DateWiseData = user.dateWiseData.slice(0, 7);
      res.status(200).json({ last7DateWiseData });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },

//POST
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
        user.dateWiseData[dateWiseEntryIndex].percent =(user.activities.length==0)?0: (points/user.activities.length)*100;
      } else {
        user.dateWiseData.push({
          date: new Date(date),
          points,
          activitiesCount: user.activities.length,
          percent: (user.activities.length==0)?0:(points/user.activities.length)*100
        });
      }
        user.activities = user.activities.filter((activity) => activity.daily !== "No");
        user.activities.forEach((activity) => {
          activity.isChecked = false;
        });
        await user.save();
      res.status(200).json({ message: 'Daily update executed successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  
//UPDATE
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

  updateUsername: async (req, res) => {
    try {
      const { email } = req.params;
      const { newUsername } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      user.name = newUsername;
      await user.save();
      res.status(200).json({ message: 'Username updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },

  updatePassword: async (req, res) => {
    try {
      const { email } = req.params;
      const { newPassword } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;
      await user.save();
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },

//DELETE
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

  deleteAccount: async (req, res) => {
    try {
      const { email } = req.params;
      const result = await User.deleteOne({ email });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'User account deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred' });
    }
  },
  
};

module.exports = userController;