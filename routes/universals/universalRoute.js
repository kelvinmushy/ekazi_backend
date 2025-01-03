// Route to fetch all CV templates
const express = require('express');
const router = express.Router();

const {
    fetchCvTemplates,
  } = require('../../controllers/admins/cvTemplateController');
  

const {
  getApplicantsController
}= require('../../controllers/applicants/applicantController')








router.get('/cv', fetchCvTemplates);
router.get('/all-applicants',getApplicantsController);


module.exports = router;