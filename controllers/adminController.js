const { getJobs } = require('../models/jobs/jobModel');




const getAllJobs = async (req, res) => {
  try {
    const jobs = await getJobs();
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};



module.exports = { getAllJobs };
