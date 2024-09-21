// models/resources/skillModel.js
const db = require('../../config/db'); // Adjust the path as needed

const getSkills = async () => {
  const [results] = await db.query('SELECT * FROM skills');
  return results;
};

const createSkill = async ({ skill_name, creator_id }) => {
  const [result] = await db.query('INSERT INTO skills (skill_name, creator_id) VALUES (?, ?)', [skill_name, creator_id]);
  return result.insertId;
};

const updateSkill = async ({ id, skill_name, updator_id }) => {
  const [result] = await db.query('UPDATE skills SET skill_name = ?, updator_id = ? WHERE id = ?', [skill_name, updator_id, id]);
  return result.affectedRows;
};

const deleteSkill = async (id) => {
  const [result] = await db.query('DELETE FROM skills WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };
