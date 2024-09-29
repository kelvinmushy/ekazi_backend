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
  const { culture_name,} = req.body; // Destructure both name and creator_id
  const creator_id = 3;

  try {
    const cultureId = await createCulture({ culture_name, creator_id });
    res.status(201).json({ cultureId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create culture' });
  }
};

const updateOldCulture = async (req, res) => {
  const { culture_name } = req.body;
  const id = req.params.id; // Destructure all necessary fields
  const updator_id = 3;
  try {
    const affectedRows = await updateCulture({ culture_name, updator_id, id }); // Pass correct parameters
    res.status(200).json({ affectedRows }); // Return affected rows
  } catch (error) {
    res.status(500).json({ error: 'Failed to update culture' });
  }
};

const deleteOldCulture = async (req, res) => {
   const id = req.params.id;// Get the culture ID to delete
  try {
    const affectedRows = await deleteCulture(id); // Pass id directly
    res.status(200).json({ affectedRows }); // Return affected rows
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete culture' });
  }
};

module.exports = { getAllCultures, createNewCulture, updateOldCulture, deleteOldCulture };
