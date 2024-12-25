// routes/employerRoutes.js
const upload = require('../../middleware/multerMiddleware');
const express = require('express');
const {
    getRefereesBYapplicantId,
  createRefereesBYapplicantId,
  editRefereeById,
  deleteRefereeById,
  
  } = require('../../controllers/applicants/applicantRefereesController');

  const {
    createApplicantSkill,
    getSkillsByApplicantId,
    updateSkill,
    deleteSkill,
} = require('../../controllers/applicants/applicantSkillsController');

const router = express.Router();

// Get employer by ID
router.get('/referees/:applicantId', getRefereesBYapplicantId);


// Add a new referee for the applicant
router.post('/referees/:applicantId', createRefereesBYapplicantId);

// Update referee details by refereeId
router.put('/referees/:refereeId', editRefereeById);

// Delete a referee by refereeId
router.delete('/referees/:refereeId', deleteRefereeById);



// Get all skills for an applicant by applicantId
router.get('/skills/:applicantId', getSkillsByApplicantId);

// Add a new skill for the applicant
router.post('/skills', createApplicantSkill);

// Update a skill for an applicant by skillId
router.put('/skills/:skillId', updateSkill);

// Delete a skill for an applicant by skillId
router.delete('/skills/:skillId', deleteSkill);


module.exports = router;
