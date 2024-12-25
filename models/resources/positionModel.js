// models/resources/positionModel.js
const db = require('../../config/db'); 

// Get all positions
const getPositions = async () => {
  const [results] = await db.query('SELECT * FROM positions');
  return results;
};

// Create a new position
const createPosition = async ({ name, creator_id }) => {
  const [result] = await db.query('INSERT INTO positions (name, creator_id) VALUES (?, ?)', [name, creator_id]);
  return result.insertId;
};

// Update an existing position
const updatePosition = async ({ id, name, updator_id }) => {
  const [result] = await db.query('UPDATE positions SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

// Delete a position
const deletePosition = async (id) => {
  const [result] = await db.query('DELETE FROM positions WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getPositions, createPosition, updatePosition, deletePosition };
