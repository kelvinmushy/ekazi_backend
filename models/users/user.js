const db = require('../../config/db'); // Make sure this imports your pool correctly

// Fetch all users
const getUsers = async () => {
  const connection = await db.getConnection();
  try {
    const [results] = await connection.query('SELECT * FROM users');
    return results;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Could not retrieve users');
  } finally {
    connection.release();
  }
};

// Fetch a user by ID
const getUserById = async (id) => {
  const connection = await db.getConnection();
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
const createUser = async (connection ,username, email,password, userType) => {

  try {
    const [result] = await connection.query(
      'INSERT INTO users (username, email, password, userType) VALUES (?, ?, ?, ?)',
      [username, email, password, userType]
    );
    return result.insertId; 
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw new Error('Could not create user');
  } finally {
    connection.release();
  }
};

// Update an existing user
const updateUser = async ( connection,id, username, email,password) => {

 
  try {
    const [result] = await connection.query(
      'UPDATE users SET username = ?, email = ?, password = ? WHERE id = ?',
      [ username, email,password,id]
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

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById, findUserByUsername, updateUserPassword };
