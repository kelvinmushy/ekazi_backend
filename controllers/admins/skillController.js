// controllers/admins/skillController.js
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../../models/resources/skillModel');

const getAllSkills = async (req, res) => {
  try {
    const skills = await getSkills();
    res.json(skills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
};

const createNewSkill = async (req, res) => {
  const { skill_name} = req.body;
  const creator_id=6;
  try {
    const skillId = await createSkill({ skill_name, creator_id });
    res.status(201).json({ skillId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create skill' });
  }
};

const updateOldSkill = async (req, res) => {
  const { skill_name } = req.body;
  const id = req.params.id;
  const updator_id=1;
  try {
    const affectedRows = await updateSkill({ id, skill_name,updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No skill found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update skill' });
  }
};

const deleteOldSkill = async (req, res) => {
  const id = req.params.id;
  try {
    const affectedRows = await deleteSkill(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No skill found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete skill' });
  }
};

module.exports = { getAllSkills, createNewSkill, updateOldSkill, deleteOldSkill };
