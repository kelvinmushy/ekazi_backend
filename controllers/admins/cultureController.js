const { getCultures, createCulture, updateCulture, deleteCulture } = require('../../models/resources/cultureModel');

const getAllCultures = async (req, res) => {
  try {
    const cultures = await getCultures();
    res.json(cultures);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cultures' });
  }
};

const createNewCulture = async (req, res) => {
  const { name, creator_id } = req.body; // Destructure both name and creator_id
  try {
    const cultureId = await createCulture({ name, creator_id });
    res.status(201).json({ cultureId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create culture' });
  }
};

const updateOldCulture = async (req, res) => {
  const { name, updator_id, id } = req.body; // Destructure all necessary fields
  try {
    const affectedRows = await updateCulture({ name, creator_id: updator_id, id }); // Pass correct parameters
    res.status(200).json({ affectedRows }); // Return affected rows
  } catch (error) {
    res.status(500).json({ error: 'Failed to update culture' });
  }
};

const deleteOldCulture = async (req, res) => {
  const { id } = req.body; // Get the culture ID to delete
  try {
    const affectedRows = await deleteCulture(id); // Pass id directly
    res.status(200).json({ affectedRows }); // Return affected rows
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete culture' });
  }
};

module.exports = { getAllCultures, createNewCulture, updateOldCulture, deleteOldCulture };
