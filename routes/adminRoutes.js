const express = require('express');
const router = express.Router();

const { getAllCultures } = require('../controllers/admins/cultureController');
const { createNewCulture } = require('../controllers/admins/cultureController');
const { updateOldCulture } = require('../controllers/admins/cultureController');
const { deleteOldCulture } = require('../controllers/admins/cultureController');
const {
    getAllExperiences,
    createNewExperience,
    updateOldExperience,
    deleteOldExperience
  } = require('../controllers/admins/experienceController');
router.use(express.json());

const {
    getAllJobTypes,
    createNewJobType,
    updateOldJobType,
    deleteOldJobType
  } = require('../controllers/admins/jobTypeController');

  const {
    getAllPositionLevels,
    createNewPositionLevel,
    updateOldPositionLevel,
    deleteOldPositionLevel
  } = require('../controllers/admins/positionLevelController');

  const {
    getAllSkills,
    createNewSkill,
    updateOldSkill,
    deleteOldSkill
  } = require('../controllers/admins/skillController');
  
  const {
    getAllCountries,
    createNewCountry,
    updateOldCountry,
    deleteOldCountry
  } = require('../controllers/admins/countryController');
  

  const {
    getAllRegions,
    createNewRegion,
    updateOldRegion,
    deleteOldRegion
  } = require('../controllers/admins/regionController');
  
  const {
    getAllCategories,
    createNewCategory,
    updateOldCategory,
    deleteOldCategory
  } = require('../controllers/admins/categoryController');
  const {
    getAllJobs,
    createNewJob,
    updateOldJob,
    deleteOldJob
  } = require('../controllers/admins/jobs/jobController');

//Cultures Routes API
router.get('/resource/cultures', getAllCultures);
router.post('/resource/new/culture', createNewCulture);
router.put('/resource/update/culture', updateOldCulture); // Changed to PUT
router.delete('/resource/delete/culture', deleteOldCulture); // Changed to DELETE

//Experience Routes API
router.get('/resource/experiences', getAllExperiences);
router.post('/resource/new/experience', createNewExperience);
router.put('/resource/update/experience', updateOldExperience);
router.delete('/resource/delete/experience', deleteOldExperience);

//Job Type Routes API
router.get('/resource/job-types', getAllJobTypes);
router.post('/resource/new/job-type', createNewJobType);
router.put('/resource/update/job-type', updateOldJobType);
router.delete('/resource/delete/job-type', deleteOldJobType);

//Position Level Routes API
router.get('/resource/position-levels', getAllPositionLevels);
router.post('/resource/new/position-level', createNewPositionLevel);
router.put('/resource/update/position-level', updateOldPositionLevel);
router.delete('/resource/delete/position-level', deleteOldPositionLevel);

//Skill Route API
router.get('/resource/skills', getAllSkills);
router.post('/resource/new/skill', createNewSkill);
router.put('/resource/update/skill', updateOldSkill);
router.delete('/resource/delete/skill', deleteOldSkill);

// Country Routes API
router.get('/resource/countries', getAllCountries);
router.post('/resource/new/country', createNewCountry);
router.put('/resource/update/country/:id', updateOldCountry);
router.delete('/resource/countries/:id', deleteOldCountry);

// Region Routes API
router.get('/resource/regions', getAllRegions);
router.post('/resource/region', createNewRegion);
router.put('/resource/region/:id', updateOldRegion);
router.delete('/resource/region/:id',deleteOldRegion );


// Category Routes API
router.get('/resource/categories', getAllCategories);
router.post('/resource/new/category', createNewCategory);
router.put('/resource/update/category', updateOldCategory);
router.delete('/resource/delete/category', deleteOldCategory);

// Job Routes API
router.get('/jobs', getAllJobs);
router.post('/new/job', createNewJob);
router.put('/update/job', updateOldJob);
router.delete('/delete/job', deleteOldJob);

module.exports = router;
