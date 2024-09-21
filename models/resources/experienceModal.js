// models/resources/experienceModel.js
const db = require('../../config/db'); // Adjust the path as needed

const getExperiences = async () => {
  const [results] = await db.query('SELECT * FROM experiences');
  return results;
};

const createExperience = async ({ name, creator_id }) => {
  const [result] = await db.query('INSERT INTO experiences (name, creator_id) VALUES (?, ?)', [name, creator_id]);
  return result.insertId;
};

const updateExperience = async ({ name,updator_id ,id}) => {
  const [result] = await db.query('UPDATE experiences SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

const deleteExperience = async (id) => {
  const [result] = await db.query('DELETE FROM experiences WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getExperiences, createExperience, updateExperience, deleteExperience };
