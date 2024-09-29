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
router.get('/resource/experience', getAllExperiences);
router.post('/resource/experience', createNewExperience);
router.put('/resource/experience', updateOldExperience);
router.delete('/resource/experience', deleteOldExperience);

//Job Type Routes API
router.get('/resource/type', getAllJobTypes);
router.post('/resource/type', createNewJobType);
router.put('/resource/type/:id', updateOldJobType);
router.delete('/resource/type/:id', deleteOldJobType);

//Position Level Routes API
router.get('/resource/position-levels', getAllPositionLevels);
router.post('/resource/position-level', createNewPositionLevel);
router.put('/resource/position-level', updateOldPositionLevel);
router.delete('/resource/position-level', deleteOldPositionLevel);

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
router.post('/resource/category', createNewCategory);
router.put('/resource/category/:id', updateOldCategory);
router.delete('/resource/category/:id', deleteOldCategory);

// Job Routes API
router.get('/jobs', getAllJobs);
router.post('/new/job', createNewJob);
router.put('/update/job', updateOldJob);
router.delete('/delete/job', deleteOldJob);

module.exports = router;
