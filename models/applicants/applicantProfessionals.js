const db = require('../../config/db'); // Correct path for your DB connection

// 1. Select Professional Qualifications by Applicant ID
const getProfessionalQualificationsByApplicantId = async (applicantId) => {
  try {
    const query = `
      SELECT 
        countries.name AS country,
        institutions.name AS institution,
        courses.name AS course,
        applicant_professionals.id AS id,
        applicant_professionals.started AS started,
        applicant_professionals.ended AS ended,
        applicant_professionals.attachment AS attachment,
        applicant_professionals.country_id AS country_id,
        applicant_professionals.course_id AS course_id,
        applicant_professionals.institution_id AS institution_id
      FROM applicant_professionals
      JOIN courses ON applicant_professionals.course_id = courses.id
      JOIN countries ON applicant_professionals.country_id = countries.id
      JOIN institutions ON applicant_professionals.institution_id = institutions.id
      WHERE applicant_professionals.applicant_id = ?;
    `;
    
    // Execute the query with the applicantId parameter
     const [rows] = await db.execute(query, [applicantId]);
    
   
      return rows;
  } catch (error) {
    console.error('Error fetching qualifications:', error);
    throw error;  // Propagate the error to be handled by the calling function
  }
};



// 2. Create a New Professional Qualification

const createProfessionalQualification = async (qualification) => {
  try {
    const query = `
      INSERT INTO applicant_professionals 
      (applicant_id, country_id, institution_id, course_id, attachment, started, ended, creator_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const { applicant_id, country_id, institution_id, course_id, attachment, started, ended, creator_id } = qualification;

    
    // If any value is undefined, replace it with null for MySQL compatibility
    const attachmentValue = attachment !== undefined ? attachment : null;
    const yearFromValue = started !== undefined ? started : null;
    const yearToValue = ended !== undefined ? ended : null;
    const creatorIdValue = creator_id !== undefined ? creator_id : null;
    const countryIdValue = country_id !== undefined ? country_id : null;

  
    const [result] = await db.execute(query, [
      applicant_id,
      countryIdValue,       // If undefined, it will be null
      institution_id,       // Correct institution_id
      course_id,            // Correct course_id
      attachmentValue,      // If undefined, it will be null
      yearFromValue,        // If undefined, it will be null
      yearToValue,          // If undefined, it will be null
      creatorIdValue,       // If undefined, it will be null
    ]);

    return {
      id: result.insertId,
      applicant_id,
      country_id: countryIdValue,
      institution_id,
      course_id,
      attachment: attachmentValue,
      yearFrom: yearFromValue,
      yearTo: yearToValue,
      creator_id: creatorIdValue,
    };
  } catch (error) {
    console.error("Error creating qualification:", error);
    throw error;
  }
};

// 3. Edit a Professional Qualification by ID
const updateProfessionalQualification = async (qualificationId, updatedQualification) => {
  try {
    const query = `
      UPDATE applicant_professionals
      SET institution_id = ?, course_id = ?, attachment = ?, started = ?, ended = ?, updator_id = ?
      WHERE id = ?;
    `;
    // Destructure the correct fields from updatedQualification
    const { institution_id, course_id, attachment, started, ended, updator_id } = updatedQualification;

    // Execute the query
    const [result] = await db.execute(query, [
      institution_id,
      course_id,
      attachment || null,  // If there's no attachment, send null
      started,
      ended || null,       // If no 'ended' date, send null
      updator_id,
      qualificationId,     // The qualification ID to update
    ]);

    return result;
  } catch (error) {
    console.error('Error updating qualification:', error);
    throw error;
  }
};


// 4. Delete a Professional Qualification by ID
const removeProfessionalQualification = async (qualificationId) => {
  try {
    const query = `
      DELETE FROM applicant_professionals
      WHERE id = ?;
    `;
    const [result] = await db.execute(query, [qualificationId]);
    return result;
  } catch (error) {
    console.error('Error deleting qualification:', error);
    throw error;
  }
};
// Function to get a professional qualification by ID
const getProfessionalQualificationById = async (qualificationId) => {
  try {
    const [rows] = await db.query('SELECT * FROM applicant_professionals WHERE id = ?', [qualificationId]);
    
    // Return the first row if it exists, otherwise return null
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error('Error fetching professional qualification:', error);
    throw error; // Propagate the error to be handled at the controller level
  }
};

module.exports = {
  getProfessionalQualificationsByApplicantId,
  createProfessionalQualification,
  updateProfessionalQualification,
  removeProfessionalQualification,
  getProfessionalQualificationById
};
