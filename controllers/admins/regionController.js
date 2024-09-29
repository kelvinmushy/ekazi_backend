// controllers/admins/regionController.js
const { getRegions, createRegion, updateRegion, deleteRegion } = require('../../models/resources/regionModel');

const getAllRegions = async (req, res) => {
  try {
    const regions = await getRegions();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch regions' });
  }
};

const createNewRegion = async (req, res) => {
  const { region_name, country_id, creator_id } = req.body;
  try {
    const regionId = await createRegion({ region_name, country_id, creator_id });
    res.status(201).json({ regionId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create region' });
  }
};

const updateOldRegion = async (req, res) => {
  const {region_name, country_id, updator_id } = req.body;
  const id = req.params.id;
  try {
    const affectedRows = await updateRegion({ id, region_name, country_id, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No region found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update region' });
  }
};

const deleteOldRegion = async (req, res) => {
  const id = req.params.id;
  try {
    const affectedRows = await deleteRegion(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No region found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete region' });
  }
};

module.exports = { getAllRegions, createNewRegion, updateOldRegion, deleteOldRegion };
