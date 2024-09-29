// controllers/admins/countryController.js
const { getCountries, createCountry, updateCountry, deleteCountry } = require('../../models/resources/countryModel');

const getAllCountries = async (req, res) => {
  try {
    const countries = await getCountries();
    res.json(countries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch countries' });
  }
};

const createNewCountry = async (req, res) => {
  const { name, citizenship, country_code, alpha_code, currency, creator_id } = req.body;
  try {
    const countryId = await createCountry({ name, citizenship, country_code, alpha_code, currency, creator_id });
    res.status(201).json({ countryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create country' });
  }
};

const updateOldCountry = async (req, res) => {
  const { name, citizenship, country_code, alpha_code, currency, updator_id } = req.body;
  const id = req.params.id;
  try {
    const affectedRows = await updateCountry({ id, name, citizenship, country_code, alpha_code, currency, updator_id });
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No country found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update country' });
  }
};

const deleteOldCountry = async (req, res) => {
  const { id } = req.body;
  try {
    const affectedRows = await deleteCountry(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: 'No country found with the given ID' });
    }
    res.status(200).json({ affectedRows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete country' });
  }
};

module.exports = { getAllCountries, createNewCountry, updateOldCountry, deleteOldCountry };
