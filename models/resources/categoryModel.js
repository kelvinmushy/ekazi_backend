// models/resources/categoryModel.js
const db = require('../../config/db'); 

const getCategories = async () => {
  const [results] = await db.query('SELECT * FROM industries');
  return results;
};

const createCategory = async ({ industry_name, creator_id }) => {
  const [result] = await db.query('INSERT INTO industries (industry_name, creator_id) VALUES (?, ?)', [industry_name, creator_id]);
  return result.insertId;
};

const updateCategory = async ({ id, industry_name, updator_id }) => {
  const [result] = await db.query('UPDATE industries SET industry_name = ?, updator_id = ? WHERE id = ?', [industry_name, updator_id, id]);
  return result.affectedRows;
};

const deleteCategory = async (id) => {
  const [result] = await db.query('DELETE FROM industries WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
