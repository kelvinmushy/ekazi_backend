// models/resources/regionModel.js
const db = require('../../config/db'); 

const getRegions = async () => {
  const [results] = await db.query('SELECT * FROM regions');
  return results;
};

const createRegion = async ({ region_name, country_id, creator_id }) => {
  const [result] = await db.query('INSERT INTO regions (region_name, country_id, creator_id) VALUES (?, ?, ?)', [region_name, country_id, creator_id]);
  return result.insertId;
};

const updateRegion = async ({ id, region_name, country_id, updator_id }) => {
  const [result] = await db.query('UPDATE regions SET region_name = ?, country_id = ?, updator_id = ? WHERE id = ?', [region_name, country_id, updator_id, id]);
  return result.affectedRows;
};

const deleteRegion = async (id) => {
  const [result] = await db.query('DELETE FROM regions WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getRegions, createRegion, updateRegion, deleteRegion };
