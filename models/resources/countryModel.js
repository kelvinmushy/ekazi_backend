// models/resources/countryModel.js
const db = require('../../config/db'); 

const getCountries = async () => {
  const [results] = await db.query('SELECT * FROM countries');
  return results;
};

const createCountry = async ({ name, citizenship, country_code, alpha_code, currency, creator_id }) => {
  const [result] = await db.query('INSERT INTO countries (name, citizenship, country_code, alpha_code, currency, creator_id) VALUES (?, ?, ?, ?, ?, ?)', [name, citizenship, country_code, alpha_code, currency, creator_id]);
  return result.insertId;
};

const updateCountry = async ({ id, name, citizenship, country_code, alpha_code, currency, updator_id }) => {
  const [result] = await db.query('UPDATE countries SET name = ?, citizenship = ?, country_code = ?, alpha_code = ?, currency = ?, updator_id = ? WHERE id = ?', [name, citizenship, country_code, alpha_code, currency, updator_id, id]);
  return result.affectedRows;
};

const deleteCountry = async (id) => {
  const [result] = await db.query('DELETE FROM countries WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getCountries, createCountry, updateCountry, deleteCountry };
