const User = require('../models/user');
const Activity = require('../models/activity');

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
  
      console.log(`Fetching activities for user with email: ${email}`);
  
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
};
module.exports = userController;


