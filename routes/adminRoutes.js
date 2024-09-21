const express = require('express');
const router = express.Router();

const { getAllJobs } = require('../controllers/adminController');
const { getAllCultures } = require('../controllers/admins/cultureController');
const { createNewCulture } = require('../controllers/admins/cultureController');
const { updateOldCulture } = require('../controllers/admins/cultureController');
const { deleteOldCulture } = require('../controllers/admins/cultureController');

router.use(express.json());


//Cultures Routes API
router.get('/resource/cultures', getAllCultures);
router.post('/resource/new/culture', createNewCulture);
router.put('/resource/update/culture', updateOldCulture); // Changed to PUT
router.delete('/resource/delete/culture', deleteOldCulture); // Changed to DELETE




// Jobs routes
router.get('/jobs', getAllJobs);

module.exports = router;
