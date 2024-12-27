const db = require('../../config/db'); 

// Get all courses
const getCourses = async () => {
  const [results] = await db.query('SELECT * FROM courses');
  return results;
};

// Create a new course
const createCourse = async ({ name, creator_id }) => {
  const [result] = await db.query('INSERT INTO courses (name,creator_id) VALUES (?,?)', [name, creator_id]);
  return result.insertId;
};

// Update an existing course
const updateCourse = async ({ id, name, updator_id }) => {
  const [result] = await db.query('UPDATE courses SET name = ?, updator_id = ? WHERE id = ?', [name, updator_id, id]);
  return result.affectedRows;
};

// Delete a course
const deleteCourse = async (id) => {
  const [result] = await db.query('DELETE FROM courses WHERE id = ?', [id]);
  return result.affectedRows;
};

module.exports = { getCourses, createCourse, updateCourse, deleteCourse };
