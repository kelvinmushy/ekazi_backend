const { getUsers, createUser, updateUser, deleteUser,getUserById } = require('../../models/users/user');

const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};


// Get user by ID
const getUser = async (req, res) => {
    const id = req.params.id;
    try {
      const user = await getUserById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  };



  const createNewUser = async (req, res) => {
    const { username, email, creator_id } = req.body;
  
    
    try {
      const userId = await createUser({ username, email, creator_id });
      res.status(201).json({ userId });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create user: ' + error.message });
    }
  };
  
 
const updateOldUser = async (req, res) => {
    const { username, email, phone, } = req.body; // Added phone here
    const id = req.params.id;
  
    try {
      const affectedRows = await updateUser({ id, username, phone, email });
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
