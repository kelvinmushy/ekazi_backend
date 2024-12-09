// routes/employerRoutes.js

const express = require('express');
const { getAllEmployers, getEmployer, createNewEmployer, updateOldEmployer, deleteOldEmployer, getEmployerByUser } = require('../../controllers/employers/EmployerController');
const router = express.Router();

// Get all employers
router.get('/employers', getAllEmployers);

// Get employer by ID
router.get('/employers/:id', getEmployer);

// Get employer by user_id
router.get('/user/:user_id', getEmployerByUser);

// Create a new employer
router.post('/employers', createNewEmployer);

// Update employer
router.put('/employers/:id', updateOldEmployer);

// Delete employer
router.delete('/employers/:id', deleteOldEmployer);

module.exports = router;
