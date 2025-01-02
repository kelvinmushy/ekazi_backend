const db = require('../../config/db'); // Replace with your actual database connection file

// 1. Select Experiences by Applicant ID
const selectExperiencesByApplicantId = async (applicantId) => {
  const query = `
    SELECT 
      ae.id, 
      i.name AS institution, 
      p.name AS position, 
      ae.from_date AS \`from\`, 
      ae.to_date AS \`to\`, 
      ae.is_currently_working,
      ae.responsibility AS responsibilities 
    FROM applicant_experiences ae
    JOIN institutions i ON ae.institution_id = i.id
    JOIN positions p ON ae.position_id = p.id
    WHERE ae.applicant_id = ?
  `;

  const [rows] = await db.execute(query, [applicantId]);
  return rows;
};

// 2. Create a New Experience
const createApplicantExperience = async (experience) => {
  const query = `
    INSERT INTO applicant_experiences 
    (applicant_id, institution_id, position_id, responsibility, from_date, to_date, is_currently_working)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const { applicant_id, institution_id, position_id, responsibilities, from, to, is_currently_working } = experience;

  const [result] = await db.execute(query, [
    applicant_id,
    institution_id,
    position_id,
    responsibilities, // Store responsibilities
    from,
    to,
    is_currently_working,
  ]);

  return {
    id: result.insertId,
    applicant_id,
    institution_id,
    position_id,
    responsibilities, // Include responsibilities in the return value
    from,
    to,
    is_currently_working,
  };
};

// 3. Edit an Experience by ID
const editExperience = async (experienceId, updatedExperience) => {
  const query = `
    UPDATE applicant_experiences
    SET institution_id = ?, position_id = ?, responsibility = ?, from_date = ?, 
        to_date = ?, is_currently_working = ?
    WHERE id = ?
  `;

  const { institution_id, position_id, responsibilities, from, to, is_currently_working } = updatedExperience;

  const [result] = await db.execute(query, [
    institution_id,
    position_id,
    responsibilities, // Update responsibilities
    from,
    to,
    is_currently_working,
    experienceId,
  ]);

  return result;
};

// 4. Delete an Experience by ID
const deleteExperience = async (experienceId) => {
  const query = `
    DELETE FROM applicant_experiences
    WHERE id = ?
  `;

  const [result] = await db.execute(query, [experienceId]);
  return result;
};

module.exports = {
  selectExperiencesByApplicantId,
  createApplicantExperience,
  editExperience,
  deleteExperience,
};
