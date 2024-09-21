// models/resources/jobTypeModel.js
const db = require('../../config/db'); 


const getPositionLevels = async () => {
  const [results] = await db.query('SELECT * FROM position_levels');
  return results;
};

const createPositionLevel = async ({ position_name, creator_id }) => {
  const [result] = await db.query('INSERT INTO position_levels (position_name, creator_id) VALUES (?, ?)', [position_name, creator_id]);
  return result.insertId;
};

const updatePositionLevel = async ({ id, position_name, updator_id }) => {
  const [result] = await db.query('UPDATE position_levels SET position_name = ?, updator_id = ? WHERE id = ?', [position_name, updator_id, id]);
  return result.affectedRows;
};

const deletePositionLevel = async (id) => {
  const [result] = await db.query('DELETE FROM position_levels WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getPositionLevels, createPositionLevel, updatePositionLevel, deletePositionLevel };
