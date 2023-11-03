const User = require('../models/user');
const Activity = require('../models/user');
const bcrypt = require('bcrypt');

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
      const user = await User.findOne({ email });
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
  
      const today = new Date();
      const last7DateWiseData = [];
      
      for (let i = 0; i < 7; i++) {
        const dateToCheck = new Date(today);
        dateToCheck.setDate(today.getDate() - i);
        const dataForDate = user.dateWiseData.find(data => 
          data.date.getFullYear() === dateToCheck.getFullYear() &&
          data.date.getMonth() === dateToCheck.getMonth() &&
          data.date.getDate() === dateToCheck.getDate()
        );
  
        if (dataForDate) {
          last7DateWiseData.push(dataForDate);
        } else {
          last7DateWiseData.push({
            date: dateToCheck,
            point: 0,
            percent: 0,
            activityCount: 0
          });
        }
      }
  
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
      const { color, icon, title, description, priority, daily } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const activity = new Activity({
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
      const { email,date } = req.body;
      const user = await User.findOne({ email });
      if (!user) { 
        console.log(`User with email ${email} not found`);
        return res.status(404).json({ message: 'User not found' });
      }
      const previousDay = date;
      const points = user.activities.filter((act) => act.isChecked).length;
      const dateWiseEntryIndex = user.dateWiseData.findIndex(
        (entry) => entry.date.toDateString() === new Date(previousDay).toDateString()
      );
      if (dateWiseEntryIndex !== -1) {
        user.dateWiseData[dateWiseEntryIndex].points = points;
        user.dateWiseData[dateWiseEntryIndex].activitiesCount = user.activities.length;
        user.dateWiseData[dateWiseEntryIndex].percent = (user.activities.length == 0) ? 0 : parseInt((points * 100)/ user.activities.length);
      } else {
        user.dateWiseData.push({
          date: new Date(previousDay),
          points,
          activitiesCount: user.activities.length,
          percent: user.activities.length === 0 ? 0 : parseInt((points * 100)/ user.activities.length)
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
      const { email, title, isPending ,isChecked} = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const activity = user.activities.find((activity) => activity.title === title);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      activity.isChecked = isChecked;
      activity.isPending = isPending;
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

  updateRating: async (req, res) => {
    try {
      const { email } = req.params;
      const { upvote } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if(upvote==1)user.upvoteCount+=1;
      else user.downvoteCount+=1;
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