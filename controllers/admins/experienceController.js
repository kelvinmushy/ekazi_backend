// controllers/admins/experienceController.js
const { getExperiences, createExperience, updateExperience, deleteExperience } = require('../../models/resources/experienceModal');

const getAllExperiences = async (req, res) => {
  try {
    const experiences = await getExperiences();
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
};

const createNewExperience = async (req, res) => {
  const { name,creator_id } = req.body;
  try {
    const experienceId = await createExperience({name, creator_id });
    res.status(201).json({ experienceId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create experience' });
  }
};

const updateOldExperience = async (req, res) => {
  const { id,name, updator_id  } = req.body;
  try {
    const affectedRows = await updateExperience({ id,name, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No experience found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update experience' });
  }
};

const deleteOldExperience = async (req, res) => {
  const { id } = req.body;
  try {
    const affectedRows = await deleteExperience(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No experience found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete experience' });
  }
};

module.exports = { getAllExperiences, createNewExperience, updateOldExperience, deleteOldExperience };
