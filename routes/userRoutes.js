const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/add-activity/:email', userController.addActivity);
router.get('/get-username/:email', userController.getUserNameByEmail);
router.get('/:email/all-activities', userController.getAllUserActivities);
router.delete('/deleteTask', userController.deleteTask);
router.put('/update-activity-status', userController.updateActivityStatus);
router.post('/schedule-daily-update', userController.scheduleDailyUpdate); 
router.put('/update-username/:email', userController.updateUsername); 
router.put('/update-password/:email', userController.updatePassword); 

module.exports = router;