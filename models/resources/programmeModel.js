const db = require('../../config/db'); 

// Get all Programmes
const getProgrammes = async () => {
  const [results] = await db.query('SELECT * FROM  programmes');
  return results;
};

// Create a new Programme
const createdProgrammes = async ({ name, creator_id }) => {
  const [result] = await db.query('INSERT INTO programmes (name,creator_id) VALUES (?,?)', [name, creator_id]);
  return result.insertId;
};

// Update an existing Programme
const updateProgramme = async ({ id, name, updator_id }) => {
  const [result] = await db.query('UPDATE programmes SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

// Delete a Programme
const deleteProgramme = async (id) => {
  const [result] = await db.query('DELETE FROM programmes WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getProgrammes,createdProgrammes, updateProgramme, deleteProgramme };
