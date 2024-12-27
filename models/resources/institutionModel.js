// models/resources/institutionModel.js
const db = require('../../config/db'); 

// Get all institutions
const getInstitutions = async () => {
  const [results] = await db.query('SELECT * FROM institutions');
  return results;
};

// Create a new institution
// Create a new institution
const createInstitution = async ({ name, creator_id }) => {
  try {
    const [result] = await db.query('INSERT INTO institutions (name, creator_id) VALUES (?, ?)', [name, creator_id]);
    return result.insertId; // Return the ID of the newly created institution
  } catch (error) {
    console.error('Error inserting institution into the database:', error.message || error);
    throw new Error(`Database error: ${error.message || error}`); // Rethrow the error for handling in the controller
  }
};


// Update an existing institution
const updateInstitution = async ({ id, name, updator_id }) => {
  const [result] = await db.query('UPDATE institutions SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

// Delete an institution
const deleteInstitution = async (id) => {
  const [result] = await db.query('DELETE FROM institutions WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getInstitutions, createInstitution, updateInstitution, deleteInstitution };
