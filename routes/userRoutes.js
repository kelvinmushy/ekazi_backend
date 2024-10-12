const express = require('express');
const {
  getAllUsers,
  createNewUser,
  updateOldUser,
  deleteOldUser
} = require('../controllers/users/userController');

const { registerUser } = require('../controllers/Auth/authController');



const router = express.Router();
router.use(express.json());
// Route to get all users
router.get('/users', getAllUsers);

// Route to create a new user
router.post('/', createNewUser);

// Route to update an existing user by ID
router.put('/:id', updateOldUser);

// Route to delete a user by ID
router.delete('/:id', deleteOldUser);

router.post('/register', registerUser);

module.exports = router;
