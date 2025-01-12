const db = require('../../config/db');

// Create a new saved resume
const createSavedResumeModel = async ({
  applicant_id,
  employer_id,  // This is now both creator_id and employer_id
  collection_id,
  position_id,
  category_id,  // New category_id field
}) => {
  const query = `
    INSERT INTO saved_resumes (
      applicant_id,
      employer_id,  -- This is used as creator_id now
      collection_id,
      position_id,
      category_id  -- Include category_id in the insert statement
    )
    VALUES (?, ?, ?, ?, ?)
  `;
  const [result] = await db.execute(query, [
    applicant_id,
    employer_id,  // Pass employer_id as creator_id
    collection_id,
    position_id,
    category_id,  // Insert the category_id
  ]);
  return result;
};

// Get all saved resumes for a specific applicant
const getSavedResumesByCollectionId = async (employer_id, collection_id) => {
  const query = `
     SELECT 
  saved_resumes.id As resume_id,
  saved_resumes.applicant_id,
  saved_resumes.employer_id,
  saved_resumes.collection_id,
  saved_resumes.position_id,
  saved_resumes.category_id,
  employers.company_name AS employer_name,
  collections.name AS collection_name,
  positions.name AS position_name,
  industries.industry_name AS category_name,
  a.first_name AS first_name,
  a.last_name AS last_name,
   a.id AS id,
  a.logo AS logo,
  u.email AS email,           -- Assuming email is in the 'users' table
  ap.phone_number AS phone_number,          -- Assuming phone is in the 'applicant_phones' table
  aa.address AS address,      -- Assuming address is in the 'applicant_addresses' table
  r.name AS region_name,           -- Assuming region name is in the 'regions' table
  c.name AS applicant_country,          -- Assuming country name is in the 'countries' table
  m.name AS applicant_marital_status, -- Assuming marital status is in the 'marital_statuses' table
  g.name AS applicant_gender          -- Assuming gender name is in the 'genders' table
FROM 
  saved_resumes
LEFT JOIN 
  employers ON saved_resumes.employer_id = employers.id
LEFT JOIN 
  collections ON saved_resumes.collection_id = collections.id
LEFT JOIN 
  positions ON saved_resumes.position_id = positions.id
LEFT JOIN 
  industries ON saved_resumes.category_id = industries.id
LEFT JOIN 
  applicants a ON saved_resumes.applicant_id = a.id
LEFT JOIN 
  users u ON a.user_id = u.id                -- Join with users table for email
LEFT JOIN 
  applicant_addresses aa ON a.id = aa.applicant_id   -- Join with applicant_addresses table for address
LEFT JOIN 
  regions r ON aa.region_id = r.id             -- Join with regions table for region
LEFT JOIN 
  countries c ON r.country_id = c.id           -- Join with countries table for country
LEFT JOIN 
  marital_statuses m ON a.marital_id = m.id     -- Join with marital_statuses table for marital status
LEFT JOIN 
  genders g ON a.gender_id = g.id              -- Join with genders table for gender
LEFT JOIN 
  applicant_phones ap ON a.id = ap.applicant_id -- Join with applicant_phones table for phone
WHERE 
  saved_resumes.employer_id = ? 
  AND 
  saved_resumes.collection_id = ? 

  `;
  
  // Execute the query with both employer_id and collection_id as parameters
  const [rows] = await db.execute(query, [employer_id,collection_id]); // Ensure parameters match the query order
  return rows;
};

// Update a saved resume
const updateSavedResumeModel = async ({
  id,
  applicant_id,
  collection_id,
  position_id,
  category_id,  // Update the category_id
  updator_id,
}) => {
  const query = `
    UPDATE saved_resumes
    SET 
      applicant_id = ?,
      collection_id = ?,
      position_id = ?,
      category_id = ?,  -- Update category_id
      updator_id = ?
    WHERE 
      id = ?
  `;
  const [result] = await db.execute(query, [
    applicant_id,
    collection_id,
    position_id,
    category_id,  // Pass updated category_id
    updator_id,
    id,
  ]);
  return result;
};

// Delete a saved resume
const deleteSavedResumeModel = async (id) => {
  const query = `
    DELETE FROM saved_resumes
    WHERE id = ?
  `;
  const [result] = await db.execute(query, [id]);
  return result;
};

// Get collections by employer_id with total data available
const getCollectionByEmployerId = async (employerId) => {
  const query = `
    SELECT
      collections.name AS collection_name,               -- Collection name (only once)
      saved_resumes.category_id AS Category,              -- Category ID
      saved_resumes.employer_id AS employerId,              -- employer ID
      saved_resumes.collection_id ,
      GROUP_CONCAT(DISTINCT positions.name ORDER BY positions.name) AS position_names,  -- Concatenate positions in one row
      COUNT(*) AS Total_Data_Available                   -- Count the number of records per collection
    FROM
      saved_resumes
    LEFT JOIN 
      collections ON saved_resumes.collection_id = collections.id
    LEFT JOIN 
      positions ON saved_resumes.position_id = positions.id  -- Join with positions table
    WHERE 
      saved_resumes.employer_id = ?                      -- Filter by employer_id
    GROUP BY
      collections.name,                                  -- Group by collection name (only once)
      saved_resumes.category_id                          -- Group by category_id
    ORDER BY
      collections.name;                                  -- Optional, order by collection name
  `;

  const [rows] = await db.execute(query, [employerId]);
  return rows;
};

module.exports = {
  createSavedResumeModel,
  getSavedResumesByCollectionId,
  updateSavedResumeModel,
  deleteSavedResumeModel,
  getCollectionByEmployerId
};
