const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.get('/get-username/:email', userController.getUserNameByEmail);
router.get('/:email/all-activities', userController.getAllUserActivities);
router.get('/:email/last-7-date-wise-data', userController.getLast7DateWiseData);
router.post('/schedule-daily-update', userController.scheduleDailyUpdate); 
router.post('/add-activity/:email', userController.addActivity);
router.put('/update-activity-status', userController.updateActivityStatus);
router.put('/update-username/:email', userController.updateUsername); 
router.put('/update-password/:email', userController.updatePassword); 
router.delete('/delete-account/:email', userController.deleteAccount);
router.delete('/deleteTask', userController.deleteTask);

module.exports = router;