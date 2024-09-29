// controllers/admins/positionLevelController.js
const { getPositionLevels, createPositionLevel, updatePositionLevel, deletePositionLevel } = require('../../models/resources/positionLevelModel');

const getAllPositionLevels = async (req, res) => {
  try {
    const positionLevels = await getPositionLevels();
    res.json(positionLevels);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch position levels' });
  }
};

const createNewPositionLevel = async (req, res) => {
  const { position_name, creator_id } = req.body;
  try {
    const positionLevelId = await createPositionLevel({ position_name, creator_id });
    res.status(201).json({ positionLevelId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create position level' + error.message});
  }
};

const updateOldPositionLevel = async (req, res) => {
  const { id, position_name, updator_id } = req.body;
  
  try {
    const affectedRows = await updatePositionLevel({ id, position_name, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No position level found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position level' });
  }
};

const deleteOldPositionLevel = async (req, res) => {
  const id = req.params.id;
  try {
    const affectedRows = await deletePositionLevel(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No position level found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete position level' + error.message});
  }
};

module.exports = { getAllPositionLevels, createNewPositionLevel, updateOldPositionLevel, deleteOldPositionLevel };
