const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/add-activity/:email', userController.addActivity);
router.get('/get-username/:email', userController.getUserNameByEmail);
router.get('/:email/all-activities', userController.getAllUserActivities);

module.exports = router;
