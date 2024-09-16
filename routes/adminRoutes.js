const express = require('express');
const router = express.Router();
const { getAllJobs } = require('../controllers/adminController');

router.get('/jobs', getAllJobs);

module.exports = router;
