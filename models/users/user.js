const db = require('../../config/db'); 

// Fetch all users
const getUsers = async () => {
  try {
    const [results] = await db.query('SELECT * FROM users');
    return results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Could not retrieve users');
  }
};

// Fetch a user by ID
const getUserById = async (id) => {
    try {
      const [results] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
      return results[0]; // Return the first user found
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw new Error('Could not retrieve user');
    }
  }

// Create a new user
const createUser = async (connection, username, password, email ,userType) => {
  try {
    const [result] = await connection.query(

      'INSERT INTO users (username,email,password,userType) VALUES (?,?,?,?)',

      [username,email,password,userType]
    );
    return result.insertId; 
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Could not create user');
  }
};

// const createCategory = async ({ industry_name, creator_id }) => {
//     const [result] = await db.query('INSERT INTO industries (industry_name, creator_id) VALUES (?, ?)', [industry_name, creator_id]);
//     return result.insertId;
//   };

// Update an existing user
const updateUser = async ({ id, username, phone, email }) => {
  try {
    const [result] = await db.query(
      'UPDATE users SET username = ?,email = ?,phone=? WHERE id = ?',
      [username, email,phone, id]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user');
  }
};

// Delete a user
const deleteUser = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Could not delete user');
  }
};

  const findUserByUsername = async (connection, username) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    
    try {
        const [rows] = await connection.query(query, [username]);
        return rows.length > 0 ? rows[0] : null; // Return the user if found, else null
    } catch (error) {
        console.error('Error finding user by username:', error);
        throw error; // Propagate the error
    }
};
const updateUserPassword = async (connection, userId, hashedPassword) => {
  await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
};

module.exports = { getUsers, createUser, updateUser, deleteUser ,getUserById,findUserByUsername,updateUserPassword};
