const db = require('../../config/db'); // Adjust the attachment as needed

// Fetch all CV templates
const getCvTemplates = async () => {
  try {
    const [rows] = await db.query('SELECT * FROM cv_templates');
    return rows; // Returns an array of templates
  } catch (error) {
    throw new Error('Failed to fetch CV templates from database: ' + error.message);
  }
};

// Fetch a CV template by ID
const getCvTemplateById = async (id) => {
  if (!id) {
    throw new Error('No ID provided to fetch CV template.');
  }

  try {
    const [rows] = await db.query('SELECT * FROM cv_templates WHERE id = ?', [id]);
    if (rows.length === 0) {
      throw new Error('No CV template found with the given ID');
    }
    return rows[0]; // Returns the template with the given ID
  } catch (error) {
    throw new Error('Failed to fetch CV template by ID: ' + error.message);
  }
};

// Create a new CV template
const createCvTemplate = async (CvTemplate) => {
  const { name, creator_id, attachment } = CvTemplate; // Added 'attachment' field

  if (!name || !creator_id || !attachment) {
    throw new Error('Missing required fields: name, creator_id, and attachment.');
  }

  try {
    const [result] = await db.query('INSERT INTO cv_templates (creator_id, name, attachment) VALUES (?, ?, ?)', [creator_id, name, attachment]);
    return result.insertId; // Return the inserted row ID
  } catch (error) {
    throw new Error('Failed to create CV template in the database: ' + error.message);
  }
};

// Update an existing CV template
const updateCvTemplate = async (CvTemplate) => {
  const { updator_id, name, attachment, id } = CvTemplate; // Added 'attachment' field

  if (!name || !attachment || !id) {
    throw new Error('Missing required fields: name, attachment, and id.');
  }

  try {
    const [result] = await db.query(
      'UPDATE cv_templates SET updator_id = ?, name = ?, attachment = ? WHERE id = ?',
      [updator_id, name, attachment, id]
    );
    
    if (result.affectedRows === 0) {
      throw new Error('No CV Template found with the given ID');
    }

    return result.affectedRows; // Return the number of affected rows
  } catch (error) {
    throw new Error('Failed to update CV template in the database: ' + error.message);
  }
};

// Delete a CV template
const deleteCvTemplate = async (id) => {
  if (!id) {
    throw new Error('No ID provided for deletion.');
  }

  try {
    const [result] = await db.query('DELETE FROM cv_templates WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      throw new Error('No CV Template found with the given ID');
    }
    return result.affectedRows; // Return the number of affected rows
  } catch (error) {
    throw new Error('Failed to delete CV template from the database: ' + error.message);
  }
};

module.exports = { getCvTemplates, createCvTemplate, updateCvTemplate, deleteCvTemplate, getCvTemplateById };
