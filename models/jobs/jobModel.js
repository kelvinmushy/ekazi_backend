const db = require('../../config/db');


const getJobs = async () => {
  const [rows] = await db.query('SELECT * FROM jobs');
  return rows;
};


const createJob = async (job) => {
  const { title, description, employerId } = job;
  const [result] = await db.query('INSERT INTO jobs (title, description, employer_id) VALUES (?, ?, ?)', [title, description, employerId]);
  return result.insertId;
};

module.exports = { getJobs, createJob };
