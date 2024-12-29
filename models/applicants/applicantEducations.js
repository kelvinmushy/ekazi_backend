const db = require('../../config/db'); // Correct path for your DB connection

// 1. Select Educational Qualifications by Applicant ID
const getEducationalQualificationsByApplicantId = async (applicantId) => {
  try {
    const query = `
      SELECT 
        countries.name AS country,
        countries.id AS country_id,
        institutions.name AS institution,
        education_levels.education_level AS education_level,
        programmes.name AS programme,
        applicant_educations.id AS id,
        applicant_educations.started AS started,
        applicant_educations.ended AS ended,
        applicant_educations.attachment AS attachment,
        applicant_educations.education_level_id AS education_level_id,
        applicant_educations.category_id AS category_id,
        applicant_educations.programme_id AS programme_id,
        applicant_educations.institution_id AS institution_id
      FROM applicant_educations
      JOIN programmes ON applicant_educations.programme_id = programmes.id
      JOIN countries ON applicant_educations.country_id = countries.id
      JOIN institutions ON applicant_educations.institution_id = institutions.id
      JOIN education_levels ON applicant_educations.education_level_id=education_levels.id
      WHERE applicant_educations.applicant_id = ?;
    `;

    // Execute the query with the applicantId parameter
    const [rows] = await db.execute(query, [applicantId]);
    return rows;
    
  } catch (error) {
    console.error('Error fetching educational qualifications:', error);
    throw error;  // Propagate the error to be handled by the calling function
  }
};

// 2. Create a New Educational Qualification
const createEducationalQualification = async (qualification) => {
  try {
    const query = `
      INSERT INTO applicant_educations 
      (applicant_id, education_level_id, category_id, programme_id, institution_id, country_id, attachment, started, ended)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const { applicant_id, education_level_id, category_id, programme_id, institution_id, country_id, attachment, date_from, date_to } = qualification;

    // If any value is undefined, replace it with null for MySQL compatibility
    const attachmentValue = attachment !== undefined ? attachment : null;
    const yearFromValue = date_from !== undefined ? date_from : null;
    const yearToValue = date_to !== undefined ? date_to : null;
    const countryIdValue = country_id !== undefined ? country_id : null;

    const [result] = await db.execute(query, [
      applicant_id,
      education_level_id,
      category_id,
      programme_id,
      institution_id,
      countryIdValue,
      attachmentValue,
      yearFromValue,
      yearToValue,
    ]);

    return {
      id: result.insertId,
      applicant_id,
      education_level_id,
      category_id,
      programme_id,
      institution_id,
      country_id: countryIdValue,
      attachment: attachmentValue,
      started: yearFromValue,
      ended: yearToValue,
    };
  } catch (error) {
    console.error("Error creating educational qualification:", error);
    throw error;
  }
};

// 3. Edit an Educational Qualification by ID
const updateEducationalQualification = async (qualificationId, updatedQualification) => {
  try {
    const query = `
      UPDATE applicant_educations
      SET education_level_id = ?, category_id = ?, programme_id = ?, institution_id = ?, country_id = ?, attachment = ?, started = ?, ended = ?
      WHERE id = ?;
    `;
    
    const { education_level_id, category_id, programme_id, institution_id, country_id, attachment, date_from, date_to } = updatedQualification;

    // Execute the query
    const [result] = await db.execute(query, [
      education_level_id,
      category_id,
      programme_id,
      institution_id,
      country_id || null,
      attachment || null,  // If there's no attachment, send null
      date_from,
      date_to || null,       // If no 'ended' date, send null
      qualificationId,     // The qualification ID to update
    ]);

    return result;
  } catch (error) {
    console.error('Error updating educational qualification:', error);
    throw error;
  }
};

// 4. Delete an Educational Qualification by ID
const removeEducationalQualification = async (qualificationId) => {
  try {
    const query = `
      DELETE FROM applicant_educations
      WHERE id = ?;
    `;
    const [result] = await db.execute(query, [qualificationId]);
    return result;
  } catch (error) {
    console.error('Error deleting educational qualification:', error);
    throw error;
  }
};

// Function to get an educational qualification by ID
const getEducationalQualificationById = async (qualificationId) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicant_educations WHERE id = ?', [qualificationId]);
    
    // Return the first row if it exists, otherwise return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching educational qualification:', error);
    throw error; // Propagate the error to be handled at the controller level
  }
};

module.exports = {
  getEducationalQualificationsByApplicantId,
  createEducationalQualification,
  updateEducationalQualification,
  removeEducationalQualification,
  getEducationalQualificationById,
};
