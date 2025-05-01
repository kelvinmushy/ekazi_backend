const express = require('express');
const router = express.Router();

const {
    getAllJobs,
    createNewJob,
    updateOldJob,
    deleteOldJob,
    getJobCounts,
    getDashboardStatic
  } = require('../../controllers/jobs/jobController');

// Job Routes API
router.get('/get', getAllJobs);
router.post('/create', createNewJob);
router.put('/update/:id', updateOldJob);
router.delete('/delete/:id', deleteOldJob);
router.get('/counts/:employerId', getJobCounts);


//Get Employer Static
router.get('/dashboard-stats/:employer_id', getDashboardStatic);  // Notice there's no `:employer_id` in the route



module.exports = router;