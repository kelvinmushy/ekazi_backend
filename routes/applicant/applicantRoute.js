const express = require('express');

// Controllers for different applicant modules
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
    getTotalExperience
} = require('../../controllers/applicants/applicantExperiencesController');

const {
    getLanguagesByApplicantId,
    createLanguageByApplicantId,
    editLanguageById,
    deleteLanguageById,
} = require('../../controllers/applicants/applicantLanguageController');

const {
    createProfessionalQualificationController,
    getProfessionalQualificationsByApplicantIdController,
    updateProfessionalQualificationController,
    removeProfessionalQualificationController,
} = require('../../controllers/applicants/applicantProfessionalController'); // Professional Qualifications controller

const {
  createEducationalQualificationController,
  getEducationalQualificationsByApplicantIdController,
  updateEducationalQualificationController,
  removeEducationalQualificationController,
} = require('../../controllers/applicants/applicantEducationController'); // Educational Qualifications controller

const {
 createApplicantController,
 getApplicantByIdController,
 updateApplicantController,
 uploadLogo,getLogo,applicanSelectCv

} = require('../../controllers/applicants/applicantController'); // Educational Qualifications controller

const {
   createApplicantSocialMedia,
    getSocialMediaByApplicantId,
    updateSocialMediaLink,
    deleteSocialMediaLink,
 
 } = require('../../controllers/applicants/applicantSocialMediaController'); // Educational Qualifications controller

 const {
 applicantApplication,selectApplicantById,updateApplication,
 deleteApplication,applicantSaveJob,applicantDeleteSavedJob,
 applicantGetSavedJob
} = require('../../controllers/applicants/ApplicantApplicationController'); // Educational Qualifications controller


const upload = require('../../middleware/multerMiddleware');
const courses = require('../../middleware/multerCourseMiddleware'); // Multer middleware for handling file uploads (e.g., course attachments)
const education = require('../../middleware/multerEducationMiddleware'); 
const router = express.Router();

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
  // Handling Multer specific errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File is too large. Max size is 10MB.' });
    }
    if (err.code === 'INVALID_FILE_TYPE') {
      return res.status(400).json({ message: 'Invalid file type. Only PDF, JPG, JPEG, PNG files are allowed.' });
    }
  }

  // Handling other errors
  if (err) {
    return res.status(500).json({ message: 'An error occurred while uploading the file.' });
  }

  next(err); // Pass to the next error handler
};

// Referees Routes
router.get('/referees/:applicantId', getRefereesBYapplicantId);  // Get all referees by applicant ID
router.post('/referees/:applicantId', createRefereesBYapplicantId);  // Create new referee for an applicant
router.put('/referees/:refereeId', editRefereeById);  // Edit a referee by ID
router.delete('/referees/:refereeId', deleteRefereeById);  // Delete a referee by ID

// Skills Routes
router.get('/skills/:applicantId', getSkillsByApplicantId);  // Get all skills by applicant ID
router.post('/skills', createApplicantSkill);  // Create new skill
router.put('/skills/:skillId', updateSkill);  // Edit a skill by ID
router.delete('/skills/:skillId', deleteSkill);  // Delete a skill by ID

// Experiences Routes
router.get('/experiences/:applicantId', getExperiencesByApplicantId);  // Get all experiences by applicant ID
router.post('/experiences/:applicantId', createExperienceByApplicantId);  // Create new experience for an applicant
router.put('/experiences/:experienceId', editExperienceById);  // Edit an experience by ID
router.delete('/experiences/:experienceId', deleteExperienceById);  // Delete an experience by ID

router.get('/total-experiences/:applicantId', getTotalExperience);  

// Languages Routes
router.get('/languages/:applicantId', getLanguagesByApplicantId);  // Get all languages by applicant ID
router.post('/languages/:applicantId', createLanguageByApplicantId);  // Create new language for an applicant
router.put('/languages/:languageId', editLanguageById);  // Edit a language by ID
router.delete('/languages/:languageId', deleteLanguageById);  // Delete a language by ID

// Professional Qualifications Routes
router.get('/professional-qualifications/:applicantId', getProfessionalQualificationsByApplicantIdController);  // Get all professional qualifications by applicant ID
router.post('/professional-qualifications/:applicantId', courses, handleMulterError, createProfessionalQualificationController);  // Create new professional qualification with file upload
router.put('/professional-qualifications/:qualificationId', courses, handleMulterError, updateProfessionalQualificationController);  // Edit a professional qualification with file upload
router.delete('/professional-qualifications/:qualificationId', removeProfessionalQualificationController);  // Delete a professional qualification by ID

// Educational Qualifications Routes
router.get('/educational-qualifications/:applicantId', getEducationalQualificationsByApplicantIdController);  // Get all educational qualifications by applicant ID
router.post('/educational-qualifications/:applicantId', education,createEducationalQualificationController);  // Create new educational qualification with file upload
router.put('/educational-qualifications/:qualificationId',education, updateEducationalQualificationController);  // Edit an educational qualification with file upload
router.delete('/educational-qualifications/:qualificationId', removeEducationalQualificationController);  // Delete an educational qualification by ID

//applicant route 
router.get('/:applicantId', getApplicantByIdController);
router.put('/:qualificationId', updateApplicantController);  // Edit an educational qualification with file upload
//applicant logo
router.post('/upload-logo/:applicantId', upload, uploadLogo);
router.get('/logo/:applicantId', getLogo);

//applicant cv will be here 
router.post('/cv/save/:applicantId', applicanSelectCv);
//social media routes
router.get('/social-media/:applicantId', getSocialMediaByApplicantId);  // Get all social media links by applicant ID
router.post('/social-media', createApplicantSocialMedia);  // Create new social media links
router.put('/social-media', updateSocialMediaLink);  // Edit a social media link by ID
router.delete('/social-media/:socialMediaId', deleteSocialMediaLink); 

//applicantApplication
router.post('/applications', applicantApplication);
router.get('/all/applications/:applicant_id',selectApplicantById);
router.put('/applications/:applicationId',updateApplication)
router.delete('/applications/:applicationId',deleteApplication);

//applicant save job
router.get('/saved-jobs/:applicant_id',applicantGetSavedJob);
router.post('/save-job', applicantSaveJob);
router.delete('/delete/saved-job/:savedJobId',applicantDeleteSavedJob)


module.exports = router;
