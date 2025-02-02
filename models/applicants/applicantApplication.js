const db = require('../../config/db');

// 1. Fetch all applications by applicant ID
const selectApplicationsByApplicantId = async (applicantId) => {
  const query = `
    SELECT 
    aa.id, 
    aa.job_id,
    aa.applicant_id,
    aa.letter,
    aa.hide,
    aa.status,
    aa.stage_id,
    aa.created_at,
    aa.updated_at,
    j.title AS job_title,
    j.posting_date,
    j.expired_date
FROM 
    applicant_applications aa
JOIN 
    jobs j ON aa.job_id = j.id
WHERE 
    aa.applicant_id = ?;

  `;
  const [rows] = await db.execute(query, [applicantId]);
  return rows;
};

// 2. Create a new application entry for the applicant
const createApplicantApplication = async (applicationData) => {
  const query = `
    INSERT INTO applicant_applications 
      (job_id, applicant_id, letter,stage_id) 
    VALUES 
      (?, ?, ?, ?);
  `;
  const { job_id, applicant_id,letter,stage_id = 1 } = applicationData;
  const [result] = await db.execute(query, [job_id, applicant_id, letter, stage_id]);
  return {
    id: result.insertId,
    job_id,
    applicant_id,
    letter,
    stage_id,
  };
};

// 3. Edit an existing application entry by ID
const editApplicantApplication = async (applicationId, updatedData) => {
  const query = `
  UPDATE applicant_applications
  SET letter = ?
  WHERE id = ?;
`;
const { letter } = updatedData;
const [result] = await db.execute(query, [letter, applicationId]);

return result;


};

// 4. Delete an application entry by ID
const deleteApplicantApplication = async (applicationId) => {
  const query = `
    DELETE FROM applicant_applications
    WHERE id = ?;
  `;
  const [result] = await db.execute(query, [applicationId]);
  return result;
};

//applicant get all saved job

// Function to get saved jobs by applicant_id
const getSavedJobsByApplicantId = async (applicantId) => {
  const query = `
    SELECT sj.id, sj.job_id, sj.applicant_id, j.title, j.posting_date, j.expired_date
    FROM applicant_saved_jobs sj
    JOIN jobs j ON sj.job_id = j.id
    WHERE sj.applicant_id = ?;
  `;

  try {
    const [rows] = await db.execute(query, [applicantId]);
    return rows; // Return the saved jobs
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    throw new Error("Failed to fetch saved jobs");
  }
};


//applicant save job
const JobSavedModel = async (savedData) => {
  const { job_id, applicant_id } = savedData; // Destructure the saved data

  const query = `
    INSERT INTO applicant_saved_jobs (job_id, applicant_id) 
    VALUES (?, ?);
  `;

  try {
    const [result] = await db.execute(query, [job_id, applicant_id]);
    return {
      id: result.insertId,
      job_id,
      applicant_id,
    };
  } catch (error) {
    console.error("Error saving job:", error);
    throw new Error("Failed to save job");
  }
};

//delete saved job
// 4. Delete an application entry by ID
const deleteSavedJobModel = async (savedId) => {
  const query = `
    DELETE FROM applicant_saved_jobs
    WHERE id = ?;
  `;
  const [result] = await db.execute(query, [savedId]);
  return result;
};

module.exports = {
  selectApplicationsByApplicantId,
  createApplicantApplication,
  editApplicantApplication,
  deleteApplicantApplication,
  deleteSavedJobModel,
  JobSavedModel,
  getSavedJobsByApplicantId
};
