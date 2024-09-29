const db = require('../../config/db'); // Adjust the path as needed

const getCultures = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM cultures');
    return rows;
  } catch (error) {
    throw new Error('Failed to fetch cultures from database');
  }
};

const createCulture = async (culture) => {
  const { culture_name } = culture;
  const { creator_id } = culture;

  try {
    const [result] = await db.query('INSERT INTO cultures (creator_id, culture_name) VALUES (?, ?)', [creator_id, culture_name]);
    return result.insertId;
  } catch (error) {
    throw new Error('Failed to create culture in the database');
  }
};

const updateCulture = async (culture) => {
  const { updator_id,culture_name,  id } = culture;

  try {
    const [result] = await db.query('UPDATE cultures SET  updator_id = ? ,culture_name = ? WHERE id = ?', [updator_id,culture_name,id]);
    if (result.affectedRows === 0) {
      throw new Error('No culture found with the given ID');
    }
    return result.affectedRows; // Return the number of affected rows
  } catch (error) {
    throw new Error('Failed to update culture in the database');
  }
};

const deleteCulture = async (id) => {
  try {
    const [result] = await db.query('DELETE FROM cultures WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('No culture found with the given ID');
    }
    return result.affectedRows; // Return the number of affected rows
  } catch (error) {
    throw new Error('Failed to delete culture from the database');
  }
};

module.exports = { getCultures, createCulture ,updateCulture,deleteCulture};
