const { getUsers, createUser, updateUser, deleteUser,getUserById } = require('../../models/users/user');
const bcrypt = require('bcryptjs');
const db = require('../../config/db');

const getAllUsers = async (req, res) => {
  // Extract the employer_id from the route parameter
  const employer_id = req.params.employer_id;
 

  try {
    // Pass employer_id to the getUsers function to fetch users for the specific employer
    const users = await getUsers(employer_id);

    // Return the list of users as a response
    res.json(users);
  } catch (error) {
    // Handle errors and send a response with status 500
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


// Get user by ID
const getUser = async (req, res) => {
    const id = req.params.id;
    try {
      const connection = await db.getConnection();
      const user = await getUserById(connection,id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  };



  const createNewUser = async (req, res) => {
    const {username, email, password,userType,employer_id } = req.body;
  
       console.log(req.body)
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const connection = await db.getConnection();
      const userId = await createUser(connection,username, email,hashedPassword,userType,employer_id);
     
      res.status(201).json({ userId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user: ' + error.message });
    }
  };
  
 
const updateOldUser = async (req, res) => {
  
    const { username, email,phone } = req.body; // Added phone here
    
    const userId = req.params.id;

    try {
        const connection = await db.getConnection();
      const affectedRows = await updateUser(connection,userId, username, email,phone);
      if (affectedRows === 0) {
        return res.status(404).json({ error: 'No user found with the given ID' });
      }
      res.status(200).json({ affectedRows });
    } catch (error) {
      console.error('SQL Error:', error); // Log the SQL error to the console
      res.status(500).json({ error: 'Failed to update user', details: error.message }); // Include error details in the response
    }
  };
  

const deleteOldUser = async (req, res) => {
  const id = req.params.id;
 
  try {
    const affectedRows = await deleteUser(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No user found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAllUsers, createNewUser, updateOldUser, deleteOldUser,getUser };
