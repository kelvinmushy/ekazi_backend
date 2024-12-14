// routes/employerRoutes.js

const express = require('express');
const { getAllEmployers, getEmployer, createNewEmployer, updateOldEmployer, deleteOldEmployer, getEmployerByUser } = require('../../controllers/employers/EmployerController');
//User API
const {
    getAllUsers,
    createNewUser,
    updateOldUser,
    deleteOldUser,
    getUser
  } = require('../../controllers/employers/employerUserController');

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
router.put('/update/:id', updateOldEmployer);

// Delete employer
router.delete('/employers/:id', deleteOldEmployer);

// Route to get all users
router.get('/users/:employer_id', getAllUsers);  // Notice there's no `:employer_id` in the route

// Route to create a new user
router.post('/user', createNewUser);
// Route to update an existing user by ID
router.put('/user/:id', updateOldUser);
// Route to delete a user by ID
router.delete('/user/delete/:id', deleteOldUser);

module.exports = router;
