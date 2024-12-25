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

const {
    getExperiencesByApplicantId,
    createExperienceByApplicantId,
    editExperienceById,
    deleteExperienceById,
} = require('../../controllers/applicants/applicantExperiencesController');

const router = express.Router();

// Referees Routes
router.get('/referees/:applicantId', getRefereesBYapplicantId);
router.post('/referees/:applicantId', createRefereesBYapplicantId);
router.put('/referees/:refereeId', editRefereeById);
router.delete('/referees/:refereeId', deleteRefereeById);

// Skills Routes
router.get('/skills/:applicantId', getSkillsByApplicantId);
router.post('/skills', createApplicantSkill);
router.put('/skills/:skillId', updateSkill);
router.delete('/skills/:skillId', deleteSkill);

// Experiences Routes
router.get('/experiences/:applicantId', getExperiencesByApplicantId);
router.post('/experiences/:applicantId', createExperienceByApplicantId);
router.put('/experiences/:experienceId', editExperienceById);
router.delete('/experiences/:experienceId', deleteExperienceById);

module.exports = router;
