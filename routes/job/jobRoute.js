const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    createNewJob,
    updateOldJob,
    deleteOldJob,
    getJobCounts
  } = require('../../controllers/jobs/jobController');

// Job Routes API
router.get('/get', getAllJobs);
router.post('/create', createNewJob);
router.put('/update/:id', updateOldJob);
router.delete('/delete/:id', deleteOldJob);
router.get('/counts/:employerId', getJobCounts);

module.exports = router;