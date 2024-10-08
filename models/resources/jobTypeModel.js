// models/resources/jobTypeModel.js
const db = require('../../config/db'); // Adjust the path as needed

const getJobTypes = async () => {
  const [results] = await db.query('SELECT * FROM types');
  return results;
};

const createJobType = async ({ name, creator_id }) => {
  const [result] = await db.query('INSERT INTO types (name, creator_id) VALUES (?, ?)', [name, creator_id]);
  return result.insertId;
};

const updateJobType = async ({ id, name, updator_id }) => {
  const [result] = await db.query('UPDATE types SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

const deleteJobType = async (id) => {
  const [result] = await db.query('DELETE FROM types WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getJobTypes, createJobType, updateJobType, deleteJobType };
