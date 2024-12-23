// routes/employerRoutes.js
const upload = require('../../middleware/multerMiddleware');
const express = require('express');
const {
    getRefereesBYapplicantId,
  createRefereesBYapplicantId,
  editRefereeById,
  deleteRefereeById,
  
  } = require('../../controllers/applicants/applicantRefereesController');

const router = express.Router();

// Get employer by ID
router.get('/referees/:applicantId', getRefereesBYapplicantId);


// Add a new referee for the applicant
router.post('/referees/:applicantId', createRefereesBYapplicantId);

// Update referee details by refereeId
router.put('/referees/:refereeId', editRefereeById);

// Delete a referee by refereeId
router.delete('/referees/:refereeId', deleteRefereeById);



module.exports = router;
