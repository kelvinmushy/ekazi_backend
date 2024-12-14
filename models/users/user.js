const db = require('../../config/db'); // Make sure this imports your pool correctly

// // Fetch all users
// const getUsers = async () => {
//   const connection = await db.getConnection();
//   try {
//     const [results] = await connection.query('SELECT * FROM users');
//     return results;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     throw new Error('Could not retrieve users');
//   } finally {
//     connection.release();
//   }
// };
// Fetch all users based on employer_id
const getUsers = async (employerId) => {
  const connection = await db.getConnection();
  try {
    // SQL query to join users with user_employers and filter by employer_id
    const [results] = await connection.query(
      `SELECT u.* 
       FROM users u
       JOIN user_employers ue ON u.id = ue.user_id
       WHERE ue.employer_id = ?`, 
      [employerId]
    );
    
    return results; // Return the list of users for the specified employer_id
  } catch (error) {
    console.error('Error fetching users by employer_id:', error);
    throw new Error('Could not retrieve users for this employer');
  } finally {
    connection.release();
  }
};
// Fetch a user by ID
const getUserById = async (connection, id) => {
  try {
    const [results] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
    return results[0]; // Return the first user found
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw new Error('Could not retrieve user');
  } finally {
    connection.release();
  }
};

// Create a new user
const createUser = async (connection, username, email, password, userType, employer_id = null) => {
  try {
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)',
      [username, email, password, userType]
    );
    
    console.log(employer_id);
    if (userType === 'employer' && employer_id) {
      // If the user is an employer, link to employer_id
      console.log(employer_id);
      await userEmployer(connection, result.insertId, employer_id);
    }

    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw new Error('Could not create user');
  } finally {
    connection.release();
  }
};

// Update an existing user
const updateUser = async (connection, userId, username, email, phone) => {
  try {
    const [result] = await connection.query(
      'UPDATE users SET username = ?, email = ?, phone = ? WHERE id = ?',
      [username, email, phone, userId]
    );
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Could not update user');
  } finally {
    connection.release();
  }
};

// Delete a user
const deleteUser = async (id) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
    
    await deleteUserEmployer(id); // Delete the user's employer record
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw new Error('Could not delete user');
  } finally {
    connection.release();
  }
};

// Find user by username
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

// Update user password
const updateUserPassword = async (connection, userId, hashedPassword) => {
  await connection.execute('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);
};

// Create user employer relationship
const userEmployer = async (connection, user_id, employer_id) => {
  try {
    const [result] = await connection.query(
      'INSERT INTO user_employers (user_id, employer_id) VALUES (?, ?)',
      [user_id, employer_id]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating user-employer record:', error.message);
    throw new Error('Could not create user-employer relationship');
  }
};

// Delete a user employer relationship
const deleteUserEmployer = async (id) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query('DELETE FROM user_employers WHERE user_id = ?', [id]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error deleting user employer:', error);
    throw new Error('Could not delete user employer');
  } finally {
    connection.release();
  }
};

// Fetch employer by user ID
const getUserEmployer = async (userId) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      'SELECT employer_id FROM user_employers WHERE user_id = ?',
      [userId]
    );
    connection.release();
    return result[0] || null;
  } catch (error) {
    console.error('Error fetching employer record:', error.message);
    throw new Error('Could not fetch employer data');
  }
};

module.exports = {
  
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  findUserByUsername,
  updateUserPassword,
  userEmployer,
  getUserEmployer,
  deleteUserEmployer,
  getUsers
};
