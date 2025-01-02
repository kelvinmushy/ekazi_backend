// Route to fetch all CV templates
const express = require('express');
const router = express.Router();

const {
    fetchCvTemplates,
  } = require('../../controllers/admins/cvTemplateController');
  










router.get('/cv', fetchCvTemplates);


module.exports = router;