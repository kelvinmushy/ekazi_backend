const express = require('express');
const router = express.Router();

// Import the controllers
const {
    fetchCvTemplates,
} = require('../../controllers/admins/cvTemplateController');

const {
    getApplicantsController,
} = require('../../controllers/applicants/applicantController');

const {
    createSavedResume,
    getSavedResumes,
    updateSavedResume,
    deleteSavedResume,
    getCollectionByIdController

} = require('../../controllers/applicants/savedResumeController'); // Ensure this path is correct

const {getUniversalJobs,getJobById}=require('../../controllers/jobs/jobController')

//return all industries here
const {
    getAllIndustries
} = require('../../controllers/admins/categoryController'); // Ensure this path is correct
const {
    getAllEmployersFunction,getAllEmployersJob
} = require('../../controllers/employers/EmployerController'); // Ensure this path is correct



// Route to fetch all CV templates
router.get('/cv', fetchCvTemplates);

// Route to get all applicants
router.get('/all-applicants', getApplicantsController);

// Route to create a new saved resume
router.post('/saved-resumes', createSavedResume);

// Route to fetch all saved resumes for a specific applicant
router.get('/saved-resumes/:employerId/:collectionId', getSavedResumes);

// Route to fetch all saved resumes for a specific applicant
router.get('/collection/:employerId', getCollectionByIdController);


// Route to update a specific saved resume
router.put('/saved-resumes', updateSavedResume);

// Route to delete a specific saved resume
router.delete('/saved-resumes/:id', deleteSavedResume);

//Route to return jobs 
router.get('/jobs/:categoryId', getUniversalJobs);

router.get('/job/:id',getJobById);

//Route to return industries 
router.get('/industries', getAllIndustries);
// router.get('/job/:id',getJobById);

router.get('/employers',getAllEmployersFunction);

router.get('/employers/jobs/:id',getAllEmployersJob);



module.exports = router;
