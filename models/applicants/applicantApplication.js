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


//implement modal function to handle all recruitment function base on stage
// Stage-specific data handlers

// Create screening data
const createScreening = async (applicationId, data) => {
  const query = `
    INSERT INTO screenings (application_id, screener_id, method, outcome, notes)
    VALUES (?, ?, ?, ?, ?);
  `;
  const [result] = await db.execute(query, [
    applicationId,
    data.screener_id,
    data.method,
    data.outcome,
    data.notes,
  ]);
  return result;
};

// Create assessment data
const createAssessment = async (applicationId, data) => {
  const query = `
    INSERT INTO assessments (application_id, evaluator_id, type, score, notes, date_taken)
    VALUES (?, ?, ?, ?, ?, ?);
  `;
  const [result] = await db.execute(query, [
    applicationId,
    data.evaluator_id,
    data.type,
    data.score,
    data.notes,
    data.date_taken,
  ]);
  return result;
};

// Create interview data
const createInterview = async (applicationId, data) => {
  const query = `
    INSERT INTO interviews (application_id, interviewer_id, type, result, interview_time, location, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?);
  `;
  const [result] = await db.execute(query, [
    applicationId,
    data.interviewer_id,
    data.type,
    data.result,
    data.interview_time,
    data.location,
    data.notes,
  ]);
  return result;
};


// Update stage ID only
const updateStageOnly = async (applicationId, stageId) => {
  const query = `
    UPDATE applicant_applications 
    SET stage_id = ? 
    WHERE id = ?;
  `;
  const [result] = await db.execute(query, [stageId, applicationId]);
  return result;
};

// Function to handle dynamic stage transitions
const handleStageTransition = async (applicationId, stageId, stageData) => {

  console.log("kelvin",stageId)
  switch (parseInt(stageId)) {
    case 2:  // Screening
      return await createScreening(applicationId, stageData);
    case 3:  // Assessment
      return await createAssessment(applicationId, stageData);
    case 4:  // Interview
      return await createInterview(applicationId, stageData);
    case 5:  // Offer
    case 6:  // Hired
    case 7:  // Rejected
    case 8:  //shortlistiing
      return await updateStageOnly(applicationId, stageId);
    default:
      throw new Error("Invalid stage",stageId);
  }
};

module.exports = {
  selectApplicationsByApplicantId,
  createApplicantApplication,
  editApplicantApplication,
  deleteApplicantApplication,
  deleteSavedJobModel,
  JobSavedModel,
  getSavedJobsByApplicantId,
  handleStageTransition,
};
