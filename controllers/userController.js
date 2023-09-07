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

      user.dateWiseData.dailyActivities.push(activity);
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
};
module.exports = userController;


