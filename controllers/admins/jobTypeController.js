// controllers/admins/jobTypeController.js
const { getJobTypes, createJobType, updateJobType, deleteJobType } = require('../../models/resources/jobTypeModel');

const getAllJobTypes = async (req, res) => {
  try {
    const jobTypes = await getJobTypes();
    res.json(jobTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job types' });
  }
};

const createNewJobType = async (req, res) => {
  const { name } = req.body;
  const creator_id='1';
  try {
    const jobTypeId = await createJobType({ name, creator_id });
    res.status(201).json({ jobTypeId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job type' });
  }
};

const updateOldJobType = async (req, res) => {
  const {name } = req.body;
  const id = req.params.id;
  const  updator_id='1';
  try {
    const affectedRows = await updateJobType({ id, name, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No job type found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job type' });
  }
};

const deleteOldJobType = async (req, res) => {
  const id = req.params.id;
  try {
    const affectedRows = await deleteJobType(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No job type found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job type' });
  }
};


module.exports = { getAllJobTypes, createNewJobType, updateOldJobType, deleteOldJobType };
