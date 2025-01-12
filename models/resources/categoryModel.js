// models/resources/categoryModel.js
const db = require('../../config/db'); 

const getCategories = async () => {
  const [results] = await db.query('SELECT * FROM industries');
  return results;
};

const getJobsByCategory = async () => {
  try {
    const query = `
      SELECT 
      i.id,
      i.creator_id,
      i.industry_name AS category, 
      i.slug AS slug,
      COUNT(j.id) AS job_count
      FROM industries i
      LEFT JOIN job_categories jc ON jc.category_id = i.id
      LEFT JOIN jobs j ON j.id = jc.job_id
      GROUP BY i.id
     ORDER BY job_count DESC;
    ;
    `;  
    // Execute the query and get the results
    const [results] = await db.query(query);
    return results;  // Return the results of the query (list of categories and job counts)
  } catch (error) {
    console.error('Error fetching jobs by category:', error);
    throw error;  // Throw error if something goes wrong
  }
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

module.exports = { getCategories, createCategory, updateCategory, deleteCategory,getJobsByCategory };
